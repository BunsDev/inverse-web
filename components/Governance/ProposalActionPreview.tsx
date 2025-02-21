import { ProposalFunction } from '@app/types'
import { AbiCoder, commify, FunctionFragment, isAddress } from 'ethers/lib/utils';
import { Stack, Flex, Text, StackProps } from '@chakra-ui/react';
import Link from '@app/components/common/Link'
import { namedAddress, shortenAddress } from '@app/util';
import { REWARD_TOKEN, TOKENS, UNDERLYING } from '@app/variables/tokens';
import { capitalize, removeScientificFormat, _getProp } from '@app/util/misc';
import { formatUnits } from 'ethers/lib/utils';
import { getNetworkConfigConstants } from '@app/util/networks';
import ScannerLink from '@app/components/common/ScannerLink';
import moment from 'moment';
import { shortenNumber } from '@app/util/markets';
import { ErrorBoundary } from '../common/ErrorBoundary';

const { DOLA_PAYROLL, DOLA, COMPTROLLER, XINV_VESTOR_FACTORY, STABILIZER, GOVERNANCE, ORACLE, F2_CONTROLLER, FEDS, F2_MARKETS } = getNetworkConfigConstants();

const firmMarketsFunctions = [
    'setCollateralFactorBps',
    'setLiquidationFactorBps',
    'setLiquidationFeeBps',
    'setLiquidationIncentiveBps',
    // contracts have the typo
    'setReplenismentIncentiveBps',
];

const Amount = ({ value, decimals, isPerc = false }: { value: string, decimals: number, isPerc?: boolean }) => {
    return <Text display="inline-block" fontWeight="bold" color="secondary">
        {commify(removeScientificFormat(parseFloat(formatUnits(value, decimals)) * (isPerc ? 100 : 1))).replace(/\.0$/, '')}{isPerc && '%'}
    </Text>;
}

const XinvVestorHumanReadable = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text;

    if (['deployVester'].includes(funName)) {
        const [recipient, amountValue, startTimestampSec, durationSec, isCancellable] = callDatas;
        const contractKnownToken = REWARD_TOKEN!;
        const amount = <Amount value={amountValue} decimals={contractKnownToken.decimals} />;
        const destinator = <ScannerLink color="info" value={recipient} label={namedAddress(recipient)} />;
        const durationInDays = <b>{shortenNumber(parseInt(durationSec) / (3600 * 24), 0)} days</b>;
        const startingDate = <b>{moment(parseInt(startTimestampSec) * 1000).format('MMM Do YYYY')}</b>;

        text = <Flex display="inline-block">
            <Text>&laquo; Deploy a <b>{isCancellable === 'false' && 'Non-'}Cancellable</b> XinvVester for {destinator}:</Text>
            <Text>{amount} INV vested for {durationInDays} with a starting date of {startingDate} &raquo;</Text>
        </Flex>
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            {text}
        </Flex>
    )
}

const ComptrollerHumanReadableActionLabel = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text, amount;
    const contractKnownToken = _getProp(UNDERLYING, callDatas[0]);

    switch (funName) {
        case '_setCollateralFactor':
            amount = <Amount value={callDatas[1]} decimals={18} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b>'s Frontier Market</>} value={callDatas[0]} /> <b>Collateral Factor</b> to {amount}
            </Flex>
            break;
        case '_setCollateralPaused':
            text = <Flex display="inline-block">
                <b>{callDatas[1] === 'true' ? 'Forbid' : 'Allow'}</b> <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b></>} value={callDatas[0]} /> to be used as <b>Collateral</b> on Frontier {callDatas[1] === 'true' ? <b>(only prevents new borrowings to happen)</b> : null}
            </Flex>
            break;
        case '_setBorrowPaused':
            text = <Flex display="inline-block">
                <b>{callDatas[1] === 'true' ? 'Forbid' : 'Allow'}</b> <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b></>} value={callDatas[0]} /> to be <b>Borrowed</b> on Frontier
            </Flex>
            break;
        case '_setMintPaused':
            text = <Flex display="inline-block">
                <b>{callDatas[1] === 'true' ? 'Forbid' : 'Allow'}</b> <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b></>} value={callDatas[0]} /> to be <b>Supplied</b> on Frontier
            </Flex>
            break;
        case '_supportMarket':
            text = <Flex display="inline-block">
                <b>Add</b> <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b></>} value={callDatas[0]} /> as a <b>new Market</b> on Frontier
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const FirmMarketHumanReadableActionLabel = ({
    signature,
    callDatas,
    market,
}: {
    signature: string,
    callDatas: string[],
    market: string,
}) => {
    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case 'setCollateralFactorBps':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={market} /> <b>Collateral Factor</b> to {amount}
            </Flex>
            break;
        case 'setLiquidationFactorBps':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={market} /> <b>Liquidation Factor</b> to {amount}
            </Flex>
            break;
        case 'setLiquidationFeeBps':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={market} /> <b>Liquidation Fee</b> to {amount}
            </Flex>
            break;
        case 'setLiquidationIncentiveBps':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={market} /> <b>Liquidation Incentive</b> to {amount}
            </Flex>
            break;
        case 'setReplenismentIncentiveBps':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={market} /> <b>Replenishment Incentive</b> to {amount}
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const FirmControllerHumanReadableActionLabel = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case 'setDailyLimit':
            amount = <Amount value={callDatas[1]} decimals={18} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={callDatas[0]} /> <b>Daily Borrow Limit</b> to {amount} DOLA
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}


const FirmFedHumanReadableActionLabel = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case 'changeMarketCeiling':
            amount = <Amount value={callDatas[1]} decimals={18} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" value={callDatas[0]} /> <b>Supply Ceiling</b> to {amount} DOLA
            </Flex>
            break;
        case 'changeSupplyCeiling':
            amount = <Amount value={callDatas[0]} decimals={18} />;
            text = <Flex display="inline-block">
                Set <b>FiRM's Global Supply Ceiling</b> to {amount} DOLA
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const OracleHumanReadableActionLabel = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text;
    const contractKnownToken = _getProp(UNDERLYING, callDatas[0]);

    switch (funName) {
        case 'setFeed':
            const decimals = <Amount value={callDatas[2]} decimals={0} isPerc={false} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" label={<><b>{contractKnownToken?.symbol || shortenAddress(callDatas[0])}</b>'s Frontier Market</>} value={callDatas[0]} /> <b>Price Feed Source</b> to <ScannerLink color="info" value={callDatas[1]} />  with a {decimals} decimals Underlying
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const AnchorHumanReadableActionLabel = ({
    target,
    signature,
    callDatas,
}: {
    target: string,
    signature: string,
    callDatas: string[],
}) => {
    const contractKnownToken = _getProp(UNDERLYING, target);

    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case '_reduceReserves':
        case '_addReserves':
            amount = <Amount value={callDatas[0]} decimals={contractKnownToken.decimals} />;
            text = <Flex display="inline-block">
                <b>{funName === '_addReserves' ? 'Add' : 'Reduce'}</b> <ScannerLink color="info" label={<><b>{contractKnownToken.symbol}</b>'s Frontier Market</>} value={target} /> <b>Reserves</b> by {amount}
            </Flex>
            break;
        case '_setReserveFactor':
            amount = <Amount value={callDatas[0]} decimals={18} isPerc={true} />;
            text = <Flex display="inline-block">
                Set <ScannerLink color="info" label={<><b>{contractKnownToken.symbol}</b>'s Frontier Market</>} value={target} /> <b>Reserve Factor</b> to {amount}
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const StabilizerHumanReadableActionLabel = ({
    target,
    signature,
    callDatas,
}: {
    target: string,
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case 'setBuyFee':
        case 'setSellFee':
            amount = <Amount value={callDatas[0]} decimals={4} isPerc={true} />;
            text = <Flex display="inline-block">
                Set the <ScannerLink color="info" label={<><b>Stabilizer</b></>} value={target} /> <b>{funName === 'setBuyFee' ? 'Buy Fee' : 'Sell Fee'}</b> to {amount}
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const GovernanceHumanReadableActionLabel = ({
    signature,
    callDatas,
}: {
    signature: string,
    callDatas: string[],
}) => {
    const funName = signature.split('(')[0];
    let text, amount;

    switch (funName) {
        case 'updateProposalQuorum':
        case 'updateProposalThreshold':
            amount = <Amount value={callDatas[0]} decimals={18} />;
            text = <Flex display="inline-block">
                Set <b>{funName === 'updateProposalQuorum' ? 'Proposal Success Quorum' : 'Proposal Submit Threshold'}</b> to {amount}
            </Flex>
            break;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

const HumanReadableActionLabel = ({
    target,
    signature,
    callDatas,
}: {
    target: string,
    signature: string,
    callDatas: string[],
}) => {
    const lcTarget = target.toLowerCase();
    const funName = signature.split('(')[0];
    if (_getProp(UNDERLYING, target)) {
        return <AnchorHumanReadableActionLabel target={target} signature={signature} callDatas={callDatas} />;
    } else if (lcTarget === COMPTROLLER.toLowerCase()) {
        return <ComptrollerHumanReadableActionLabel signature={signature} callDatas={callDatas} />;
    } else if (lcTarget === XINV_VESTOR_FACTORY.toLowerCase()) {
        return <XinvVestorHumanReadable signature={signature} callDatas={callDatas} />
    } else if (lcTarget === STABILIZER.toLowerCase()) {
        return <StabilizerHumanReadableActionLabel target={target} signature={signature} callDatas={callDatas} />
    } else if (lcTarget === GOVERNANCE.toLowerCase()) {
        return <GovernanceHumanReadableActionLabel signature={signature} callDatas={callDatas} />
    } else if (lcTarget === ORACLE.toLowerCase()) {
        return <OracleHumanReadableActionLabel signature={signature} callDatas={callDatas} />
    } else if (lcTarget === F2_CONTROLLER.toLowerCase()) {
        return <FirmControllerHumanReadableActionLabel signature={signature} callDatas={callDatas} />
    } else if (!!F2_MARKETS.find(f => f.address.toLowerCase() === lcTarget) || firmMarketsFunctions.includes(funName)) {
        return <FirmMarketHumanReadableActionLabel signature={signature} callDatas={callDatas} market={target} />
    } else if (!!FEDS.find(f => f.address.toLowerCase() === lcTarget && f.isFirm)) {
        return <FirmFedHumanReadableActionLabel signature={signature} callDatas={callDatas} />
    }

    const isDolaPayroll = lcTarget === DOLA_PAYROLL.toLowerCase();
    const contractKnownToken = isDolaPayroll ? _getProp(TOKENS, DOLA) : _getProp(TOKENS, target);

    const destinator = <ScannerLink color="info" value={callDatas[0]} label={namedAddress(callDatas[0])} />;
    
    const symbol = <Text fontWeight="bold" display="inline-block">{contractKnownToken.symbol}</Text>;

    const amount = <Amount value={callDatas[1]} decimals={contractKnownToken.decimals} />

    let text;

    if (isDolaPayroll) {
        text = <Flex display="inline-block">Add {destinator} to the <b>PayRolls</b> with a yearly salary of {amount} {symbol}</Flex>
    } else if (funName === 'approve') {
        text = <Flex display="inline-block">Set {destinator}'s {symbol} <b>Allowance</b> to {amount}</Flex>;
    } else {
        text = <Flex display="inline-block"><b>{capitalize(funName)}</b> {amount} {symbol} to {destinator}</Flex>;
    }

    return (
        <Flex display="inline-block" mb="2" fontStyle="italic">
            &laquo; {text} &raquo;
        </Flex>
    )
}

export const ProposalActionPreview = (({
    target,
    signature,
    callData,
    num,
    ...props
}: ProposalFunction & { num?: number } & StackProps) => {
    const callDatas = new AbiCoder()
        .decode(FunctionFragment.from(signature).inputs, callData)
        .toString()
        .split(',');

    const funName = signature.split('(')[0];
    const isHumanRedeableCaseHandled = [
        'approve',
        'transfer',
        'mint',
        'addRecipient',
        '_reduceReserves',
        '_addReserves',
        '_setReserveFactor',
        '_setCollateralFactor',
        '_setCollateralPaused',
        '_setBorrowPaused',
        '_setMintPaused',
        '_supportMarket',
        'setFeed',
        'deployVester',
        'setSellFee',
        'setBuyFee',
        'updateProposalQuorum',
        'updateProposalThreshold',
        // firm
        'changeMarketCeiling',
        'changeSupplyCeiling',
        'setDailyLimit',
        ...firmMarketsFunctions,
    ].includes(funName);

    const contractKnownToken = target.toLowerCase() === DOLA_PAYROLL.toLowerCase() ?
        _getProp(TOKENS, DOLA) :
        _getProp(TOKENS, target) || _getProp(UNDERLYING, target);

    return (
        <Stack w="full" spacing={1} {...props} textAlign="left">
            {
                num ?
                    <Flex fontSize="xs" fontWeight="bold" textTransform="uppercase" color="secondaryTextColor">
                        {`Action ${num}`}
                    </Flex>
                    : null
            }
            <Flex w="full" overflowX="auto" direction="column" bgColor="primary.850" borderRadius={8} p={3}>
                {
                    isHumanRedeableCaseHandled
                    && (!!contractKnownToken
                        || [COMPTROLLER, XINV_VESTOR_FACTORY, STABILIZER, GOVERNANCE, ORACLE, F2_CONTROLLER].map(v => v.toLowerCase()).includes(target.toLowerCase())
                        || (!!F2_MARKETS.find(f => f.address.toLowerCase() === target.toLowerCase()) || firmMarketsFunctions.includes(funName))
                        || !!FEDS.find(f => f.address.toLowerCase() === target.toLowerCase() && f.isFirm)
                    )
                    && <ErrorBoundary description={null}>
                        <HumanReadableActionLabel target={target} signature={signature} callDatas={callDatas} />
                    </ErrorBoundary>
                }
                <Flex fontSize="15px">
                    <Link isExternal href={`https://etherscan.io/address/${target}`} color="secondaryTextColor" fontWeight="semibold">
                        {namedAddress(target)}
                    </Link>
                    <Flex>{`.${signature.split('(')[0]}(${!callDatas[0] ? ')' : ''}`}</Flex>
                </Flex>
                <Flex direction="column" fontSize="sm" pl={4} pr={4}>
                    {callDatas.map((data: string, i) =>
                        isAddress(data) ? (
                            <Link isExternal key={i} href={`https://etherscan.io/address/${data}`} whiteSpace="nowrap">
                                {namedAddress(data)}
                                {i + 1 !== callDatas.length ? ',' : ''}
                            </Link>
                        ) : (
                            <Text key={i}>
                                {data}
                                {i + 1 !== callDatas.length ? ',' : ''}
                            </Text>
                        )
                    )}
                </Flex>
                {callDatas[0] && <Text>)</Text>}
            </Flex>
        </Stack>
    )
})