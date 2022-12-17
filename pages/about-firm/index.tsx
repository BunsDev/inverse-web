import Layout from '@app/components/common/Layout';
import { AppNav } from '@app/components/common/Navbar';
import { Flex, Text, Image, useMediaQuery } from '@chakra-ui/react'
import Head from 'next/head';

export const AboutFirm = () => {
  const [isLargerThan] = useMediaQuery('(min-width: 768px)')

  return (
    <Layout>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - About FiRM</title>
        <meta name="og:title" content="Inverse Finance - About FiRM" />
        <meta name="description" content="Everything you need to know about FiRM, Inverse Finance's Fixed Rate Market, that introduces the DOLA Borrowing Rights token DBR and solves major DeFi issues. Rethink the way you borrow!" />
        <meta name="og:description" content="Everything you need to know about FiRM, Inverse Finance's Fixed Rate Market, that introduces the DOLA Borrowing Rights token DBR and solves major DeFi issues. Rethink the way you borrow!" />
        <meta name="og:image" content="https://inverse.finance/assets/social-previews/everything-about-firm.png" />
        <meta name="keywords" content="Inverse Finance, FiRM, Fixed Rate, Fixed Rate Market, DOLA Borrowing Right, DBR, DeFi, DOLA, Personal Collateral Escrow, PCE, Borrowing, stablecoin, DAO, fixed rate DeFi, fixed rate loans, fixed rate lending, fixed rate borrowing" />
      </Head>
      <AppNav active="Learn" activeSubmenu="About FiRM" />
      <Flex
        // bg={`url(/assets/social-previews/everything-about-firm.png)`}
        bgSize="cover"
        bgPosition="0 -50px"
        maxW="100vw"
        direction="column"
        w={{ base: 'full' }}
        alignItems="center"
        pt="10"
      >
        <Text as="h1" fontSize={{ base: '22px', sm: '40px' }} fontWeight="extrabold">
          Everything about FiRM!
        </Text>
        <Text color="secondaryTextColor" as="h2" fontSize={{ base: '18px', sm: '20px' }} fontWeight="bold">
          Inverse Finance's Fixed Rate Market
        </Text>
        <Text transform="translateY(100px)">
          Loading...
        </Text>
        <Image
          zIndex="1"
          mt="10"
          width="100%"
          maxW="1000px"
          src={isLargerThan ? "/assets/firm/infographic-optimized.jpg" : "/assets/firm/infographic-mobile.jpg"}
        />
      </Flex>
    </Layout>
  )
}

export default AboutFirm