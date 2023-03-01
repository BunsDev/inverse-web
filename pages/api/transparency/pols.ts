import { Contract } from 'ethers'
import 'source-map-support'
import { ERC20_ABI } from '@app/config/abis'
import { getNetworkConfigConstants } from '@app/util/networks'
import { getProvider } from '@app/util/providers';
import { getCacheFromRedis, redisSetWithTimestamp } from '@app/util/redis'
import { Multisig, NetworkIds, Token } from '@app/types';
import { getBnToNumber } from '@app/util/markets'
import { CHAIN_TOKENS } from '@app/variables/tokens';
import { fedOverviewCacheKey } from './fed-overview';
import { getLPBalances } from '@app/util/contracts';

export default async function handler(req, res) {

    const { TREASURY, MULTISIGS } = getNetworkConfigConstants(NetworkIds.mainnet);
    const cacheKey = `pols-v1.0.0`;

    try {

        const validCache = await getCacheFromRedis(cacheKey, true, 300);
        if (validCache) {
            res.status(200).json(validCache);
            return
        }

        const fedsOverviewCache = await getCacheFromRedis(fedOverviewCacheKey, false);

        const multisigsToShow = MULTISIGS;
        // POL
        const lps = [
            ...Object
                .values(CHAIN_TOKENS[NetworkIds.mainnet]).filter(({ isLP }) => isLP)
                .map((lp) => ({ chainId: NetworkIds.mainnet, ...lp })),
            ...Object
                .values(CHAIN_TOKENS[NetworkIds.optimism]).filter(({ isLP }) => isLP)
                .map((lp) => ({ chainId: NetworkIds.optimism, ...lp })),
            ...Object
                .values(CHAIN_TOKENS[NetworkIds.bsc]).filter(({ isLP }) => isLP)
                .map((lp) => ({ chainId: NetworkIds.bsc, ...lp })),
        ]

        const chainTWG: { [key: string]: Multisig } = {
            [NetworkIds.mainnet]: multisigsToShow.find(m => m.shortName === 'TWG')!,
            [NetworkIds.ftm]: multisigsToShow.find(m => m.shortName === 'TWG on FTM')!,
            [NetworkIds.optimism]: multisigsToShow.find(m => m.shortName === 'TWG on OP')!,
            [NetworkIds.bsc]: multisigsToShow.find(m => m.shortName === 'TWG on BSC')!,
        }

        const fedPols = fedsOverviewCache?.fedOverviews || [];

        const getPol = async (lp: Token & { chainId: string }) => {
            const fedPol = fedPols.find(f => {
                return f?.strategy?.pools?.[0]?.address === lp.address
            });
            const provider = getProvider(lp.chainId);

            const subBalances = fedPol?.subBalances || (await getLPBalances(lp, lp.chainId, provider));
            const totalSupply = subBalances.reduce((prev, curr) => prev + curr.balance, 0);
            const dolaPart = subBalances.find(d => d.symbol === 'DOLA' || d.symbol === 'INV');

            let ownedAmount = 0
            if (!fedPol) {
                const contract = new Contract(lp.lpBalanceContract || lp.address, ERC20_ABI, provider);
                // const totalSupply = getBnToNumber(await contract.totalSupply());

                const owned: { [key: string]: number } = {};
                if (!lp.isUniV3) {
                    owned.twg = getBnToNumber(await contract.balanceOf(chainTWG[lp.chainId].address));
                    if (lp.chainId === NetworkIds.mainnet) {
                        // no more
                        // owned.bondsManager = getBnToNumber(await contract.balanceOf(OP_BOND_MANAGER));
                        owned.treasuryContract = getBnToNumber(await contract.balanceOf(TREASURY));
                    }
                }
                ownedAmount = Object.values(owned).reduce((prev, curr) => prev + curr, 0);
            } else {
                ownedAmount = fedPol.supply;
            }
            return {
                ...lp,
                totalSupply,
                ownedAmount,
                perc: ownedAmount / totalSupply * 100,
                pairingDepth: totalSupply - (dolaPart?.balance || 0),
                dolaBalance: dolaPart?.balance || 0,
                dolaWeight: dolaPart?.perc || 0,
            }
        }

        const pols = (await Promise.all([
            ...lps.map(lp => getPol(lp))
        ]))

        const resultData = {
            timestamp: +(new Date()),
            pols,
        }
        await redisSetWithTimestamp(cacheKey, resultData);

        res.status(200).json(resultData)
    } catch (err) {
        console.error(err);
        // if an error occured, try to return last cached results
        try {
            const cache = await getCacheFromRedis(cacheKey, false);
            if (cache) {
                console.log('Api call failed, returning last cache found');
                res.status(200).json(cache);
            }
        } catch (e) {
            console.error(e);
        }
    }
}