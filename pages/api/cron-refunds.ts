import "source-map-support";
import { getCacheFromRedis, getRedisClient, redisSetWithTimestamp } from '@app/util/redis';
import { getNetworkConfigConstants } from "@app/util/networks";
import { DRAFT_WHITELIST } from "@app/config/constants";
import { CUSTOM_NAMED_ADDRESSES } from "@app/variables/names";
import { getProvider } from "@app/util/providers";
import { Contract } from "ethers";
import { ORACLE_ABI } from "@app/config/abis";
import { Fed, NetworkIds, RefundableTransaction } from "@app/types";
import { cacheMultisigMetaKey } from "./transparency/dao";
import { getTxsOf } from "@app/util/covalent";
import { capitalize, throttledPromises, uniqueBy } from "@app/util/misc";
import { ELIGIBLE_TXS } from "./gov/eligible-refunds";
import { formatEther } from "@ethersproject/units";

const client = getRedisClient();

const { GOVERNANCE, FEDS, MULTISIGS, MULTI_DELEGATOR, ORACLE, XINV } = getNetworkConfigConstants(NetworkIds.mainnet);

const topics = {
    "0xdcc16fd18a808d877bcd9a09b544844b36ae8f0a4b222e317d7b777b2c18b032": "Expansion",
    "0x32d275175c36fa468b3e61c6763f9488ff3c9be127e35e011cf4e04d602224ba": "Contraction",
}

const formatResults = (covalentResponse: any, type: string, refundWhitelist?: string[], voteCastWhitelist?: string[], multisig?: string): RefundableTransaction[] => {
    if (!covalentResponse || covalentResponse?.data === null) {
        return [{ ...covalentResponse }];
    }
    const { items, chain_id } = covalentResponse?.data;
    return items
        .filter(item => typeof item.fees_paid === 'string' && /^[0-9\.]+$/.test(item.fees_paid))
        .map(item => {
            const decodedArr = item.log_events?.map(e => e.decoded).filter(d => !!d);
            const fedLog = item.log_events
                .find(e => (['Contraction', 'Expansion'].includes(e?.decoded?.name) || !!e?.raw_log_topics?.find(r => !!topics[r])));
            const isFed = !!fedLog;
            const isContraction = fedLog?.decoded?.name === 'Contraction' || !!fedLog?.raw_log_topics?.find(rawTopic => topics[rawTopic] === 'Contraction')
            const decoded = isFed ? { name: isContraction ? 'Contraction' : 'Expansion' } : decodedArr[0];
            const isContractCreation = !item.to_address;
            const log0 = (item.log_events && item.log_events[0] && item.log_events[0]) || {};
            const to = item.to_address || log0.sender_address;
            const name = (isContractCreation ? 'ContractCreation' : !!decoded ? decoded.name || `${capitalize(type)}Other` : type === 'oracle' ? 'Keep3rAction' : `${capitalize(type)}Other`) || 'Unknown';

            return {
                from: item.from_address,
                to: to,
                txHash: item.tx_hash,
                timestamp: Date.parse(item.block_signed_at),
                successful: item.successful,
                fees: formatEther(item.fees_paid),
                name,
                contractTicker: isContractCreation ? log0.sender_contract_ticker_symbol : undefined,
                contractName: isContractCreation ? log0.sender_name : undefined,
                chainId: chain_id,
                type: isFed ? 'fed' : type,
                multisig,
                refunded: false,
                block: item.block_height,
            }
        })
        .filter(item => item.name === 'VoteCast' && voteCastWhitelist ?
            voteCastWhitelist.includes(item.from.toLowerCase())
            :
            type === 'custom' || refundWhitelist.includes(item.from.toLowerCase())
        )
}

export default async function handler(req, res) {
    const { filterType, multisig } = req.query;

    if (req.method !== 'POST') res.status(405).json({ success: false });
    else if (req.headers.authorization !== `Bearer ${process.env.API_SECRET_KEY}`) return res.status(401).json({ success: false });

    try {
        const _multisigFilter = filterType === 'multisig' ? multisig : '';

        const lastSuccessKey = `${ELIGIBLE_TXS}-${filterType}-${_multisigFilter}`;
        // if job had success in last 12h, skip job
        const hadSuccess = await getCacheFromRedis(lastSuccessKey, true, 43200);
        if(hadSuccess) {
            const lastSuccessUTC = (new Date(hadSuccess.timestamp)).toUTCString();
            res.status(200).json({ success: true, delta: 0, skipped: true, lastSuccessUTC });
            return;
        }

        let refundWhitelist = [
            ...DRAFT_WHITELIST,
            ...Object.keys(CUSTOM_NAMED_ADDRESSES),
        ];

        const provider = getProvider(NetworkIds.mainnet);

        const xinvFeed = await new Contract(ORACLE, ORACLE_ABI, provider).feeds(XINV);
        const xinvKeeperAddress = await new Contract(xinvFeed, ['function oracle() public view returns (address)'], provider).oracle();
        // old one, then we add the current one
        const invOracleKeepers = ['0xd14439b3a7245d8ea92e37b77347014ea7e4f809', xinvKeeperAddress];

        const deltaDays = 4;

        const hasFilter = !!filterType;

        const [multisigsOwners] = (await getCacheFromRedis(cacheMultisigMetaKey, false)) || [[]];

        const [
            multisigsRes,
            gov,
            multidelegator,
            gno,
            feds,
            oracleOld,
            oracleCurrent,
            delegatesRes,
        ] = await Promise.all([
            Promise.all(
                MULTISIGS
                    .filter(m => m.chainId === NetworkIds.mainnet && ((!!_multisigFilter && hasFilter && m.shortName === _multisigFilter) || !hasFilter || !_multisigFilter))
                    .map(m => !hasFilter || filterType === 'multisig' ?
                        getTxsOf(m.address, ['FedChair', 'TWG'].includes(m.shortName) ? deltaDays * 10 : deltaDays * 5)
                        : new Promise((r) => r({ data: { items: [] } })))
            ),
            !hasFilter || filterType === 'gov' ? getTxsOf(GOVERNANCE, deltaDays * 3) : new Promise((r) => r({ data: { items: [] } })),
            !hasFilter || filterType === 'multidelegator' ? getTxsOf(MULTI_DELEGATOR, deltaDays * 3) : new Promise((r) => r({ data: { items: [] } })),
            // gnosis proxy, for creation
            !hasFilter || filterType === 'gnosis' ? getTxsOf('0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2', deltaDays * 5) : new Promise((r) => r({ data: { items: [] } })),            
            !hasFilter || filterType === 'feds' ? 
                throttledPromises(
                    (f: Fed) => getTxsOf(f.address, deltaDays * 10),
                    FEDS.filter(f => f.chainId === NetworkIds.mainnet && !f.hasEnded),
                    // freemium: 5 req per sec
                    5,
                    1000,
                )
                : new Promise((r) => r([{ data: { items: [] } }])),
            // price feed update
            !hasFilter || filterType === 'oracles' ? getTxsOf(invOracleKeepers[0], deltaDays * 2) : new Promise((r) => r({ data: { items: [] } })),
            !hasFilter || filterType === 'oracles' ? getTxsOf(invOracleKeepers[1], deltaDays * 2) : new Promise((r) => r({ data: { items: [] } })),
            client.get(`1-delegates`),
        ])

        const delegates = JSON.parse(delegatesRes).data;
        const eligibleVoteCasters = Object.values(delegates)
            .map(val => val)
            .filter(del => {
                return del.votingPower >= 500 && del.delegators.length > 2;
            }).map(del => del.address.toLowerCase());

        multisigsOwners.forEach(multisigOwners => {
            refundWhitelist = refundWhitelist.concat(multisigOwners);
        });
        refundWhitelist = refundWhitelist.map(a => a.toLowerCase());

        let cronJobItems = formatResults(gov, 'governance', refundWhitelist, eligibleVoteCasters)
            .concat(formatResults(multidelegator, 'multidelegator', refundWhitelist))
            .concat(formatResults(gno, 'gnosisproxy', refundWhitelist))
            .concat(formatResults(oracleOld, 'oracle', refundWhitelist))
            .concat(formatResults(oracleCurrent, 'oracle', refundWhitelist))

        multisigsRes.forEach(r => {
            cronJobItems = cronJobItems.concat(formatResults(r, 'multisig', refundWhitelist, [], multisig))
        });
        feds.forEach(r => {
            cronJobItems = cronJobItems.concat(formatResults(r, 'fed', refundWhitelist))
        });

        const error = cronJobItems.find(item => item.error);
        const hasErrors = !!error;

        let cachedEligibleTxs = [];
        let totalItems = [];
        if (!hasErrors) {
            const cached = (await getCacheFromRedis(ELIGIBLE_TXS, false, 0, true)) || { formattedTxs: [] };
            cachedEligibleTxs = cached?.formattedTxs || [];
            totalItems = cachedEligibleTxs.concat(cronJobItems);
            totalItems = uniqueBy(totalItems, (o1, o2) => o1.txHash === o2.txHash);
            totalItems.sort((a, b) => a.timestamp - b.timestamp);
        }

        const nbBefore = hasErrors ? 0 : cachedEligibleTxs.length;
        const nbAfter = hasErrors ? 0 : totalItems.length;

        if (!hasErrors) {
            const timestamp = Date.now();
            const resultData = {
                timestamp,
                formattedTxs: totalItems,
            }
            await Promise.all([
                redisSetWithTimestamp(lastSuccessKey, { timestamp }),
                redisSetWithTimestamp(ELIGIBLE_TXS, resultData, true),
            ]);
        }

        res.status(200).json({ success: !hasErrors, delta: nbAfter - nbBefore, error })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true });
    }
};
