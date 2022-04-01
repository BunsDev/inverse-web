import { Flex, Image, Text, VStack } from '@chakra-ui/react'

import Layout from '@app/components/common/Layout'
import { AppNav } from '@app/components/common/Navbar'
import Head from 'next/head'
import { TransparencyTabs } from '@app/components/Transparency/TransparencyTabs'
import { DAO, useDAO } from '@app/hooks/useDAO'
import { MultisigsFlowChart } from '@app/components/Transparency/MultisigsFlowChart'
import { ShrinkableInfoMessage } from '@app/components/common/Messages'
import { usePricesV2 } from '@app/hooks/usePrices'
import { Funds } from '@app/components/Transparency/Funds'
import Link from '@app/components/common/Link'
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { NetworkIds } from '@app/types';
import { RadioCardGroup } from '@app/components/common/Input/RadioCardGroup';
import { useEffect, useState } from 'react'
import { getNetworkConfigConstants, getNetworkImage } from '@app/util/networks';

const { MULTISIGS } = getNetworkConfigConstants()

const MultisigTabLabel = ({ multisig }: { multisig: DAO["multisigs"] }) => {
  return <Flex alignItems="center">
    <Image src={getNetworkImage(multisig.chainId)} ignoreFallback={true} alt="" w={5} h={5} mr="2" />
    <Text>{multisig.shortName}</Text>
  </Flex>
}

export const MultisigsDiagram = () => {
  const { multisigs } = useDAO();
  const { prices } = usePricesV2(true);

  const [multisigAd, setMultisigAd] = useState(null);
  const [multisig, setMultisig] = useState(null);

  useEffect(() => {
    const newM = multisigs.find(m => m.address === multisigAd)
    if (newM) {
      setMultisig(newM);
    }
  }, [multisigAd])

  useEffect(() => {
    if (!multisigAd && multisigs?.length > 0) {
      setMultisigAd(multisigs[0].address);
    }
  }, [multisigs])

  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - Transparency Multisigs</title>
      </Head>
      <AppNav active="Transparency" activeSubmenu="Multisig Wallets" />
      <TransparencyTabs active="multisigs" />
      <RadioCardGroup
        wrapperProps={{ w: 'full', justify: 'center', mt: '4', color: 'mainTextColor' }}
        group={{
          name: 'multisig',
          defaultValue: MULTISIGS[0].address,
          onChange: (t) => setMultisigAd(t),
        }}
        radioCardProps={{ minW: '80px', w: 'fit-content', textAlign: 'center', p: '2', fontSize: '12px' }}
        options={
          multisigs.map(m => ({
            label: <MultisigTabLabel multisig={m} />,
            value: m.address,
          }))
        }
      />
      <Flex w="full" justify="center" direction={{ base: 'column', xl: 'row' }}>
        <Flex direction="column" py="2">
          {!!multisig && <MultisigsFlowChart chainId={multisig.chainId} multisigs={[multisig]} />}
        </Flex>

        <VStack spacing={4} direction="column" pt="4" px={{ base: '4', xl: '0' }} w={{ base: 'full', xl: 'sm' }}>
          {
            multisig &&
            <ShrinkableInfoMessage
              title={
                <Flex fontSize="16px" fontWeight="bold" alignItems="center">
                  👥 {multisig.name}
                </Flex>
              }
              description={
                <VStack alignItems="flex-start" spacing="2">
                  <Flex pt="2" direction="row" w='full' justify="space-between">
                    <Text>- Required approvals to act:</Text>
                    <Text>{multisig.threshold} out of {multisig.owners.length} the members</Text>
                  </Flex>
                  <Link href={multisig.governanceLink}>
                    - 🏛️ Related Governance Proposal
                  </Link>
                  <Text fontWeight="bold">- 🎯 Purpose:</Text>
                  <Text as="i">{multisig.purpose}</Text>
                  <VStack spacing="0" w="full">
                    <Flex direction="row" w='full' justify="space-between">
                      <Text fontWeight="bold">Multisig Wallet Funds:</Text>
                    </Flex>
                    <Funds prices={prices} funds={multisig.funds} showPerc={false} />
                  </VStack>
                </VStack>
              }
            />
          }
        </VStack>
      </Flex>
    </Layout>
  )
}

export default MultisigsDiagram
