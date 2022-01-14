import { Flex, Image, Text } from '@chakra-ui/react'

import Layout from '@inverse/components/common/Layout'
import { AppNav } from '@inverse/components/common/Navbar'
import Head from 'next/head'
import { InfoMessage } from '@inverse/components/common/Messages'
import { GovernanceFlowChart } from '@inverse/components/Transparency/GovernanceFlowChart'
import { getNetworkConfigConstants } from '@inverse/config/networks';
import { NetworkIds, TokenList, TokenWithBalance } from '@inverse/types'
import useEtherSWR from '@inverse/hooks/useEtherSWR'
import { commify, parseEther } from '@ethersproject/units'
import { formatEther } from 'ethers/lib/utils';
import { usePrices } from '@inverse/hooks/usePrices'
import { shortenNumber } from '@inverse/util/markets'
import { useTVL } from '@inverse/hooks/useTVL'
import { OLD_XINV } from '@inverse/config/constants'
import { TransparencyTabs } from '@inverse/components/Transparency/TransparencyTabs';
import Link from '@inverse/components/common/Link'
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useDAO } from '@inverse/hooks/useDAO'
import { SuppplyInfos } from '@inverse/components/common/Dataviz/SupplyInfos'
import { Funds } from '@inverse/components/Transparency/Funds'

const { INV, XINV, ESCROW, COMPTROLLER, TREASURY, GOVERNANCE, DOLA, DAI, TOKENS, DEPLOYER } = getNetworkConfigConstants(NetworkIds.mainnet);

const defaultValues = {
  comptroller: COMPTROLLER,
  compGuard: '0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28',
  compAdmin: TREASURY,
  escrow: ESCROW,
  escrowGov: TREASURY,
  treasury: TREASURY,
  treasuryAdmin: GOVERNANCE,
  xinv: XINV,
  xinvComptroller: COMPTROLLER,
  xinvAdmin: TREASURY,
  xinvUnderlying: INV,
  xinvEscrow: ESCROW,
  governance: GOVERNANCE,
  govGuard: '0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28',
  govTreasury: TREASURY,
  govToken: INV,
  govStakedToken: XINV,
  dola: DOLA,
  dolaOperator: TREASURY,
}

export const Overview = () => {
  const { prices } = usePrices()
  const { data: tvlData } = useTVL()
  const { dolaTotalSupply, invTotalSupply, fantom, treasury } = useDAO();

  const { data: xinvData } = useEtherSWR([
    [XINV, 'admin'],
    [XINV, 'escrow'],
    [XINV, 'comptroller'],
    [XINV, 'underlying'],
  ])

  const [xinvAdmin, xinvEscrow, comptroller, xinvUnderlying] = xinvData || [TREASURY, ESCROW, COMPTROLLER, INV]

  const { data: daoData } = useEtherSWR([
    [xinvEscrow.toLowerCase(), 'governance'],
    [comptroller, 'admin'],
    [comptroller, 'pauseGuardian'],
    [TREASURY, 'admin'],
    [GOVERNANCE, 'guardian'],
    [GOVERNANCE, 'inv'],
    [GOVERNANCE, 'xinv'],
    [GOVERNANCE, 'timelock'],
    [DOLA, 'operator'],
  ])

  const [escrowGov, compAdmin, compGuard, treasuryAdmin, govGuard, govToken, govStakedToken, govTreasury, dolaOperator] = daoData
    || [TREASURY, TREASURY, DEPLOYER, GOVERNANCE, DEPLOYER, INV, XINV, TREASURY, TREASURY];

  const fetchedValues = { xinvAdmin, xinvEscrow, comptroller, xinvUnderlying, escrowGov, compAdmin, compGuard, treasuryAdmin, govGuard, govToken, govStakedToken, govTreasury, dolaOperator }
  const govFlowChartData = { ...defaultValues, ...fetchedValues };

  const { data: otherData } = useEtherSWR([
    [GOVERNANCE, 'quorumVotes'],
    [GOVERNANCE, 'proposalThreshold'],
  ])

  const [quorumVotes, proposalThreshold] =
    otherData || [parseEther('4000'), parseEther('1000')];

  return (
    <Layout>
      <Head>
        <title>Inverse Finance - Transparency Overview</title>
      </Head>
      <AppNav active="Transparency" />
      <TransparencyTabs active="overview" />
      <Flex w="full" justify="center" direction={{ base: 'column', xl: 'row' }}>
        <Flex direction="column" py="2">
          <GovernanceFlowChart {...govFlowChartData} />
        </Flex>
        <Flex direction="column" p={{ base: '4', xl: '0' }}>
          <Flex w={{ base: 'full', xl: 'sm' }} justify="center">
            <InfoMessage
              alertProps={{ fontSize: '12px', w: 'full' }}
              title="🏛️ Governance Rules"
              description={
                <>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text>- Min. Quorum required for a vote to pass:</Text>
                    <Text>{commify(parseFloat(formatEther(quorumVotes)))}</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text>- Min. Voting Power required to create proposals:</Text>
                    <Text>{commify(parseFloat(formatEther(proposalThreshold)))}</Text>
                  </Flex>
                </>
              }
            />
          </Flex>
          {
            !!treasury && <Flex w={{ base: 'full', xl: 'sm' }} mt="5" justify="center">
              <InfoMessage
                alertProps={{ fontSize: '12px', w: 'full' }}
                title="🏦 Treasury Funds"
                description={
                  <Funds
                    prices={prices}
                    funds={[
                      { token: TOKENS[INV], balance: treasury.invBalance },
                      { token: TOKENS[DOLA], balance: treasury.dolaBalance },
                      { token: TOKENS[DAI], balance: treasury.daiBalance },
                    ]}
                  />
                }
              />
            </Flex>
          }
          <Flex w={{ base: 'full', xl: 'sm' }} mt="5" justify="center">
            {!!tvlData && <InfoMessage
              alertProps={{ fontSize: '12px', w: 'full' }}
              title={<Flex alignItems="center">
                ⚓ Anchor Total Value Locked (
                <Link isExternal href="https://dune.xyz/naoufel/anchor-metrics">
                  Analytics <ExternalLinkIcon mb="1px" fontSize="10px" />
                </Link>
                )
              </Flex>
              }
              description={
                <Funds prices={
                  Object.fromEntries(new Map(tvlData?.anchor?.assets.map(assetWithBalance => {
                    return [assetWithBalance.coingeckoId || assetWithBalance.symbol, { usd: assetWithBalance.oraclePrice }]
                  })))
                }
                funds={
                  tvlData?.anchor?.assets.map(assetWithBalance => {
                    return { balance: assetWithBalance.balance, token: assetWithBalance }
                  })
                } />
              }
            />}
          </Flex>
          <Flex w={{ base: 'full', xl: 'sm' }} mt="5" justify="center">
            <SuppplyInfos token={TOKENS[INV]} mainnetSupply={invTotalSupply - fantom?.invTotalSupply} fantomSupply={fantom?.invTotalSupply} />
          </Flex>
          <Flex w={{ base: 'full', xl: 'sm' }} mt="5" justify="center">
            <SuppplyInfos token={TOKENS[DOLA]} mainnetSupply={dolaTotalSupply - fantom?.dolaTotalSupply} fantomSupply={fantom?.dolaTotalSupply} />
          </Flex>
          <Flex w={{ base: 'full', xl: 'sm' }} mt="5" justify="center">
            <InfoMessage
              title="⚡ Roles & Powers"
              alertProps={{ fontSize: '12px', w: 'full' }}
              description={
                <>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold">- Pause Guardian:</Text>
                    <Text>Pause (but not unpause) a Market</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold">- Anchor Admin:</Text>
                    <Text>All rights on Anchor</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold">- xINV Admin:</Text>
                    <Text>Change INV APY</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold">- Escrow Admin:</Text>
                    <Text>Change xINV escrow duration</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold">- Dola operator:</Text>
                    <Text>Add/remove DOLA minters</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold" whiteSpace="nowrap">- Gov Guardian:</Text>
                    <Text>Update Gov. rules, cancel a proposal</Text>
                  </Flex>
                  <Flex direction="row" w='full' justify="space-between">
                    <Text fontWeight="bold" whiteSpace="nowrap">- Treasury Admin:</Text>
                    <Text>Use treasury funds</Text>
                  </Flex>
                </>
              }
            />
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Overview
