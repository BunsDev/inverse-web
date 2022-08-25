import { VStack, Text, HStack } from '@chakra-ui/react'
import { UnderlyingItemBlock } from '@app/components/common/Assets/UnderlyingItemBlock'
import Container from '@app/components/common/Container'
import { getBnToNumber, shortenNumber } from '@app/util/markets'
import { commify } from '@ethersproject/units'
import { F2Market } from '@app/types'
import { BigNumber } from 'ethers'
import { useBalances } from '@app/hooks/useBalances'
import { useAccountDBRMarket } from '@app/hooks/useDBR'
import ScannerLink from '@app/components/common/ScannerLink'

export const MarketInfos = ({
    market,
    account,
}: {
    market: F2Market
    account: string | null | undefined
}) => {
    const colDecimals = market.underlying.decimals;
    const { deposits, bnDeposits, debt, bnWithdrawalLimit, dola } = useAccountDBRMarket(market, account);
    const { balances } = useBalances([market.collateral]);
    const bnCollateralBalance = balances ? balances[market.collateral] : BigNumber.from('0');
    const collateralBalance = balances ? getBnToNumber(bnCollateralBalance, colDecimals) : 0;

    return <Container
        noPadding
        p="0"
        label={`Market Infos`}
        description={<ScannerLink value={market.address} />}
        contentBgColor={'infoAlpha'}
        w={{ base: 'full', lg: '50%' }}
    >
        <VStack justifyContent='space-between' w='full'>
            <VStack alignItems='flex-start' w='full'>
                <HStack w='full' justifyContent="space-between">
                    <Text>Collateral Name:</Text>
                    <Text><UnderlyingItemBlock symbol={market?.underlying.symbol} /></Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Oracle Price:</Text>
                    <Text>${commify(market.price.toFixed(2))}</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Collateral Factor:</Text>
                    <Text>{market.collateralFactor}%</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Market's borrows:</Text>
                    <Text>{shortenNumber(market.totalDebt, 2)} DOLAs</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Market's available DOLA liquidity:</Text>
                    <Text>{shortenNumber(dola, 2)}</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Your Balance:</Text>
                    <Text>{shortenNumber(collateralBalance, 2)} ({shortenNumber(collateralBalance * market.price, 2, true)})</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Your Deposits:</Text>
                    <Text>{shortenNumber(deposits, 2)} ({shortenNumber(deposits * market.price, 2, true)})</Text>
                </HStack>
                <HStack w='full' justifyContent="space-between">
                    <Text>Your Debt:</Text>
                    <Text>{shortenNumber(debt, 2)} DOLAs</Text>
                </HStack>
            </VStack>
        </VStack>
    </Container>
}