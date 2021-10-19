import { Web3Provider } from '@ethersproject/providers'
import { COMPTROLLER, UNDERLYING } from '@inverse/config'
import { useBorrowBalances, useSupplyBalances } from '@inverse/hooks/useBalances'
import useEtherSWR from '@inverse/hooks/useEtherSWR'
import { useExchangeRates } from '@inverse/hooks/useExchangeRates'
import { useMarkets } from '@inverse/hooks/useMarkets'
import { useAnchorPrices } from '@inverse/hooks/usePrices'
import { Market, SWR } from '@inverse/types'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

type AccountLiquidity = {
  usdSupply: number
  usdBorrow: number
  usdBorrowable: number
}

export const useAccountLiquidity = (): SWR & AccountLiquidity => {
  const { account } = useWeb3React<Web3Provider>()
  const { data, error } = useEtherSWR([COMPTROLLER, 'getAccountLiquidity', account])
  const { markets, isLoading: marketsIsLoading } = useMarkets()
  const { prices: oraclePrices, isLoading: pricesIsLoading } = useAnchorPrices()
  const { balances: supplyBalances, isLoading: supplyBalancesIsLoading } = useSupplyBalances()
  const { balances: borrowBalances, isLoading: borrowBalancesIsLoading } = useBorrowBalances()
  const { exchangeRates, isLoading: exchangeRatesIsLoading } = useExchangeRates()

  if (
    !account ||
    !data ||
    !oraclePrices ||
    marketsIsLoading ||
    pricesIsLoading ||
    supplyBalancesIsLoading ||
    borrowBalancesIsLoading ||
    exchangeRatesIsLoading ||
    !supplyBalances ||
    !borrowBalances ||
    !exchangeRates
  ) {
    return {
      usdSupply: 0,
      usdBorrow: 0,
      usdBorrowable: 0,
      isLoading: !error,
      isError: error,
    }
  }

  let prices = {}
  for (var key in oraclePrices) {
    if (oraclePrices.hasOwnProperty(key)) {
        prices[key] = parseFloat(formatUnits(oraclePrices[key], BigNumber.from(36).sub(UNDERLYING[key].decimals)))
    }
  }
  // const prices = oraclePrices
  // .map((v,i) => parseFloat(formatUnits(v, BigNumber.from(36).sub(UNDERLYING[addresses[i]].decimals))))
  // .reduce((p,v,i) => ({...p, [addresses[i]]:v}), {})
  
  const usdSupply = Object.entries(supplyBalances).reduce((prev, [address, balance]) => {
    const underlying = UNDERLYING[address]
    return (
      prev +
      parseFloat(formatUnits(balance, underlying.decimals)) *
        parseFloat(formatUnits(exchangeRates[address])) *
        prices[address]
    )
  }, 0)

  const usdBorrow = Object.entries(borrowBalances).reduce((prev, [address, balance]) => {
    const underlying = UNDERLYING[address]
    return prev + parseFloat(formatUnits(balance, underlying.decimals)) * prices[address]
  }, 0)

  return {
    usdSupply,
    usdBorrow,
    usdBorrowable: parseFloat(formatUnits(data[1])),
    isLoading: !error && !data,
    isError: error,
  }
}
