import { Flex } from '@chakra-ui/react'
import {
  AnchorBorrow,
  AnchorBorrowed,
  AnchorOverview,
  AnchorSupplied,
  AnchorSupply,
  AnchorHeader,
} from '@app/components/Anchor'
import { NavButtons } from '@app/components/common/Button'
import Container from '@app/components/common/Container'
import { ErrorBoundary } from '@app/components/common/ErrorBoundary'
import Layout from '@app/components/common/Layout'
import { AppNav } from '@app/components/common/Navbar'
import Head from 'next/head'
import { useState } from 'react'
import { F2Header } from '@app/components/F2/F2Header'

export const Anchor = () => {
  const [active, setActive] = useState('Supply');

  const supplyDisplay = { base: active === 'Supply' ? 'flex' : 'none', lg: 'flex' }
  const borrowDisplay = { base: active === 'Borrow' ? 'flex' : 'none', lg: 'flex' }

  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - Frontier</title>
        <meta name="og:image" content="https://images.ctfassets.net/kfs9y9ojngfc/4sS7NplccirIT7nEm1CEb7/407061e0f56f7d725b7ab51ba2247b8e/Final_INV_x_1-14.png?w=3840&q=75" />
      </Head>
      <AppNav active="Stake" />
      <ErrorBoundary>
        <Flex w={{ base: 'full' }} maxW="84rem" justify="flex-start">
          <ErrorBoundary description="Failed to load header">
            {/* <AnchorHeader /> */}
            <F2Header />
          </ErrorBoundary>
        </Flex>
        <Flex w={{ base: 'full' }} maxW="84rem" justify="center">
          <ErrorBoundary description="Failed to load borrow limits">
            <AnchorOverview />
          </ErrorBoundary>
        </Flex>
        <Flex w="full" direction="column" justify="center" alignItems="center">
          <Flex w="full" justify="center" display={{ base: 'flex', lg: 'none' }}>
            <Container noPadding>
              <NavButtons options={['Supply', 'Borrow']} active={active} onClick={setActive} />
            </Container>
          </Flex>
          <Flex w="full" maxW="84rem" justify="center">
            <Flex w={{ base: 'full', xl: '55%', lg: '60%' }} justify="flex-end" display={supplyDisplay}>
              <ErrorBoundary description="Failed to load supplied assets"><AnchorSupplied /></ErrorBoundary>
            </Flex>
            <Flex w={{ base: 'full', xl: '45%', lg: '40%' }} display={borrowDisplay}>
              <ErrorBoundary description="Failed to load borrowed assets"><AnchorBorrowed /></ErrorBoundary>
            </Flex>
          </Flex>
          <Flex w="full" maxW="84rem" justify="center">
            <Flex w={{ base: 'full', xl: '55%', lg: '60%' }} justify="flex-end" display={supplyDisplay}>
              <ErrorBoundary description="Failed to load suppliable assets"><AnchorSupply paused={false}  /></ErrorBoundary>
            </Flex>
            <Flex w={{ base: 'full', xl: '45%', lg: '40%' }} display={borrowDisplay}>
              <ErrorBoundary description="failed to load borrowable assets"><AnchorBorrow paused={false}  /></ErrorBoundary>
            </Flex>
          </Flex>
        </Flex>
      </ErrorBoundary>
    </Layout>
  )
}

export default Anchor
