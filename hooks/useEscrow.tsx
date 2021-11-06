import { Web3Provider } from '@ethersproject/providers'
import { getNetworkConfigConstants } from '@inverse/config/networks'
import useEtherSWR from '@inverse/hooks/useEtherSWR'
import { SWR } from '@inverse/types'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'

type Escrow = {
  withdrawalTime?: Date
  withdrawalAmount?: BigNumber
}

export const useEscrow = (): SWR & Escrow => {
  const { account, chainId } = useWeb3React<Web3Provider>()
  const { ESCROW } = getNetworkConfigConstants(chainId)
  
  const { data, error } = useEtherSWR([ESCROW, 'pendingWithdrawals', account])

  if (!data) {
    return {
      isLoading: !error,
      isError: error,
    }
  }

  return {
    withdrawalTime: new Date(data[0].toNumber() * 1000),
    withdrawalAmount: data[1],
    isLoading: !error && !data,
    isError: error,
  }
}
