import { Flex, Stack } from '@chakra-ui/react'

import Container from '@app/components/common/Container'
import { ErrorBoundary } from '@app/components/common/ErrorBoundary'
import Layout from '@app/components/common/Layout'
import { AppNav } from '@app/components/common/Navbar'
import Head from 'next/head'
import { usePositions } from '@app/hooks/usePositions'
import { useState } from 'react'
import { PositionsTable } from '@app/components/Positions/PositionsTable'
import moment from 'moment'
import { TopDelegatesAutocomplete } from '@app/components/common/Input/TopDelegatesAutocomplete'
import { shortenAddress } from '@app/util'
import { InfoMessage } from '@app/components/common/Messages'
import { TransparencyFrontierTabs, TransparencyTabs } from '@app/components/Transparency/TransparencyTabs'

export const ShortfallsPage = () => {
  const [accounts, setAccounts] = useState('');
  const { positions, markets, prices, collateralFactors, lastUpdate } = usePositions({ accounts });

  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - Transparency Shortfalls</title>
        <meta name="og:title" content="Inverse Finance - Shortfalls" />
        <meta name="og:description" content="Frontier's shortfalls" />
        <meta name="og:image" content="https://inverse.finance/assets/social-previews/transparency-portal.png" />
        <meta name="description" content="Inverse Finance Shortfalls Details" />
        <meta name="keywords" content="Inverse Finance, transparency, frontier, shortfalls" />
      </Head>
      <AppNav active="Transparency" activeSubmenu="Frontier (deprecated)" hideAnnouncement={true} />
      <TransparencyFrontierTabs active="frontier-shortfalls" />
      <ErrorBoundary>
        <Flex w="full" maxW='6xl' direction="column" justify="center">
          <Container
            noPadding
            label={`Filter by account (Shortfalling or Not)`}
          >
            <Stack minW={{ base: 'full', sm: '450px' }} w='full'>
              <TopDelegatesAutocomplete onItemSelect={(item) => item?.value ? setAccounts(item?.value) : setAccounts('') } />
            </Stack>
          </Container>
          <Container
            label={`${accounts ? shortenAddress(accounts)+"'s Positions" : 'Shortfalling Positions'} - ${!lastUpdate ? 'Loading...' : 'Last update '+moment(lastUpdate).fromNow()}`}
            description="Only shortfalls above or equal to $0.1 are shown"
            right={<InfoMessage description="Asset icon sizes reflects the usd worth size" />}
          >
            <PositionsTable collateralFactors={collateralFactors} markets={markets} prices={prices} positions={positions} />
          </Container>
        </Flex>
      </ErrorBoundary>
    </Layout>
  )
}

export default ShortfallsPage
