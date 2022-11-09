// TODO: Clean up the landing page, this was rushed in a few hours
import { Box, Flex, HStack, Image, UnorderedList, ListItem, Stack, Text, VStack, SimpleGrid, StackProps } from '@chakra-ui/react'
import { RTOKEN_CG_ID } from '@app/variables/tokens'
import LinkButton from '@app/components/common/Button'
import Layout from '@app/components/common/Layout'
import { LandingNav } from '@app/components/common/Navbar'
import { useDOLA } from '@app/hooks/useDOLA'
import { usePrices } from '@app/hooks/usePrices'
import { useTVL } from '@app/hooks/useTVL'
import Link from '@app/components/common/Link'
import Head from 'next/head'
import { lightTheme } from '@app/variables/theme'
import { SplashedText } from '@app/components/common/SplashedText'
import { LandingOutlineButton, LandingSubmitButton } from '@app/components/common/Button/RSubmitButton'
import { SimpleCard } from '@app/components/common/Cards/Simple'
import { shortenNumber } from '@app/util/markets'
import { getLandingProps } from '@app/blog/lib/utils'
import LightPostPreview from '@app/blog/components/light-post-preview'
import { useDBRPrice } from '@app/hooks/useDBR'

const ResponsiveStack = (props: StackProps) => <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" {...props} />

const Stat = ({ value, name }: { value: number, name: string }) => {
  return <VStack>
    <Text fontSize="40px" fontWeight="bold">{shortenNumber(value, 2, true)}</Text>
    <Text fontSize="16px">{name}</Text>
  </VStack>
}

const projects = [
  '/assets/projects/Scream.webp',
  '/assets/projects/Fantom.png',
  '/assets/projects/Olympus.png',
  '/assets/projects/Ether.png',
  '/assets/projects/YFI.svg',
  '/assets/projects/Sushiswap.png',
  '/assets/projects/Lido.png',
  '/assets/projects/Anyswap.png',
]

const cards = [
  {
    title: 'INV',
    description: 'Scale your earnings with Positive Sum Rewards & revenue sharing',
    label: 'Buy and Stake INV',
    image: '/assets/products/vaults.png',
    href: '/frontier',
    bg: "url('/assets/stake-inv.png')",
  },
  {
    title: 'Frontier',
    description: 'Earn more with decentralized, capital-efficient lending, borrowing',
    label: 'Lend & Borrow',
    image: '/assets/products/anchor.png',
    href: '/frontier',
    bg: "url('/assets/frontier.png')",
  },
  {
    title: 'DOLA',
    description: 'Borrow our fully-collateralized, low-interest stablecoin',
    label: 'Swap DOLA',
    image: '/assets/products/dola.png',
    href: '/stabilizer',
    bg: "url('/assets/dola.png')",
  },
]

export const Landing = ({ posts }: {
  posts: any[]
}) => {
  const { totalSupply } = useDOLA();
  const { prices } = usePrices();
  const { price: dbrPrice } = useDBRPrice();
  const { tvl } = useTVL();

  const stats = [
    {
      name: 'DOLA Circulation',
      value: totalSupply,
    },
    {
      name: 'INV price',
      value: prices[RTOKEN_CG_ID] ? prices[RTOKEN_CG_ID].usd : 0,
    },
    {
      name: 'TVL',
      value: tvl,
    },
    {
      name: 'DBR price',
      value: dbrPrice,
    },
  ]

  return (
    <Layout pt="0">
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
        <meta name="og:image" content="https://inverse.finance/assets/social-previews/home.png" />
      </Head>
      <Flex px="8%" py="0px" w="full" h="100vh" bgImage="/assets/v2/landing/hero.png" bgRepeat="no-repeat" backgroundSize="cover" direction="column">
        <LandingNav />
        <VStack w='full' pt="50px">
          <Stack position="relative" direction={{ base: 'column', md: 'row' }} w='full' justify="space-between" alignItems="space-between">
            <VStack alignItems="flex-start" maxW="450px">
              <SplashedText
                as="h1"
                color={`${lightTheme?.colors.mainTextColor}`}
                fontSize="44px"
                fontWeight="extrabold"
              >
                Rethink<br />The Way<br />You Borrow
              </SplashedText>
              <VStack spacing="4" alignItems="flex-start">
                <Text fontSize="20px" as="h2" color={`${lightTheme?.colors.mainTextColor}`}>
                  DOLA Borrowing Rights replace interest rates with a fixed fee that can earn you more.
                </Text>
                <HStack>
                  <LandingSubmitButton href="/firm">
                    Try Beta
                  </LandingSubmitButton>
                  <LandingOutlineButton href="https://docs.inverse.finance/inverse-finance/firm" target="_blank">
                    Learn More
                  </LandingOutlineButton>
                </HStack>
              </VStack>
            </VStack>
          </Stack>
        </VStack>
      </Flex>
      <Flex px="8%" py="20" w="full" minH="100vh" bgImage="/assets/v2/landing/part2.png" bgRepeat="no-repeat" backgroundSize="cover" direction="column">
        <VStack spacing="8" w='full' bgImage="/assets/v2/landing/part2.png" position="relative">
          <SplashedText
            splash="cross-dirty"
            containerProps={{ position: 'absolute', left: 0, top: 0 }}
            splashProps={{
              left: '-200px',
              top: '-100px',
              w: '400px',
              h: '400px',
              zIndex: '1',
              opacity: 0.8,
              bgColor: `${lightTheme?.colors.secAccentTextColor}`,
            }}
          >
          </SplashedText>
          <Image width="400px" zIndex="0" top="-200px" left="-200px" position="absolute" src="/assets/v2/landing/building1.png" />
          <Image borderRadius="999px" src="/assets/v2/dbr.svg" w='200px' h="200px" />
          <SplashedText
            as="h3"
            color={`${lightTheme?.colors.mainTextColor}`}
            fontSize="44px"
            fontWeight="extrabold"
            splash="horizontal-wave"
            splashProps={{ right: '-30px', left: 'inherit', bottom: 0, top: 'inherit' }}
          >
            Never Pay Interest Again
          </SplashedText>
          <Text textAlign="center" fontWeight="bold" fontSize="20px" maxW='350px'>
            High-volatility interest rates don't work for long-term borrowers.
          </Text>
          <Text textAlign="center" fontSize="16px" maxW='350px'>
            DOLA Borrowing Rights (DBRs) allow you to fix a rate today and borrow later
          </Text>
          <HStack>
            <LandingSubmitButton href="/firm">
              Try Beta
            </LandingSubmitButton>
            <LandingOutlineButton href="https://docs.inverse.finance/inverse-finance/firm" target="_blank">
              Learn More
            </LandingOutlineButton>
          </HStack>
        </VStack>
        <SplashedText
          splash="circle-dirty"
          splashProps={{
            left: 'inherit',
            top: 'inherit',
            bottom: '-250px',
            right: '-250px',
            w: '400px',
            h: '400px',            
            bgColor: `${lightTheme?.colors.accentTextColor}`,
          }}
        ></SplashedText>
      </Flex>
      <Flex zIndex="1" px="8%" py="20" w="full" bg={lightTheme.colors.mainTextColor} bgColor={lightTheme.colors.mainTextColor} direction="column">
        <ResponsiveStack justify="center" alignItems="space-between" w='full'>
          <VStack justify="center" w='50%' h="260px">
            <Image borderRadius="999px" src="/assets/v2/landing/interests.png" w='200px' h="200px" />
          </VStack>
          <VStack spacing="4" justify="center" w='50%' alignItems="flex-start">
            <VStack w='full' spacing="0" alignItems="flex-start">
              <Text
                fontWeight="extrabold"
                color={`white`}
                fontSize="30px"
              >
                Smarter Collateral
              </Text>
              <Text color="white" fontWeight="bold" fontSize="20px">
                Introducing Personal Collateral Escrows
              </Text>
            </VStack>
            <UnorderedList color="white" pl="5">
              <ListItem>
                Isolates deposits by user
              </ListItem>
              <ListItem>
                Retains governance rights
              </ListItem>
              <ListItem>
                User collateral can never be borrowed
              </ListItem>
              <ListItem>
                Improved price oracle technology
              </ListItem>
              <ListItem>
                Highly customizable
              </ListItem>
            </UnorderedList>
            <LandingSubmitButton maxW='200px' bgColor="white" color={lightTheme.colors.mainTextColor} href="/whitepaper" target="_blank">
              View Whitepaper
            </LandingSubmitButton>
          </VStack>
        </ResponsiveStack>
      </Flex>
      <Flex px="8%" py="20" w="full" bgImage="/assets/v2/landing/wall.png" bgRepeat="no-repeat" backgroundSize="cover" direction="column" position="relative">
        <VStack alignItems="flex-start" spacing="2" w='full' bgImage="/assets/v2/landing/part2.png" position="relative">         
          <SplashedText
            as="h3"
            color={`${lightTheme?.colors.mainTextColor}`}
            fontSize="36px"
            fontWeight="extrabold"
            splash="horizontal-wave"
            splashProps={{ right: '-30px', left: 'inherit', bottom: 0, top: 'inherit' }}
          >
            Try Inverse
          </SplashedText>
          <Text fontWeight="bold" fontSize="20px">
            Put our protocol to work for you
          </Text>
        </VStack>
        <ResponsiveStack mt="4" justify="space-between" w='full' spacing="8">
          <SimpleCard minH="470px" w='33%' justify="space-between">
            <VStack w='full'>
              <Image src="/assets/v2/landing/borrow.png?1" width="full" w="160px" h="150px" mt="6" />
                <Text fontWeight="extrabold" fontSize="30px">Borrow</Text>
                <Text fontSize="18px">
                  Borrow DOLA for a fixed-rate for an unlimited duration with DOLA Borrowing Rights.
                </Text>
            </VStack>            
            <LandingSubmitButton href="/firm">
              I want to Borrow
            </LandingSubmitButton>
          </SimpleCard>
          <SimpleCard minH="470px" w='33%' justify="space-between">
            <VStack w='full'>
              <Image src="/assets/v2/landing/earn.png" width="full" w="150px" h="150px" mt="6" />            
              <Text fontWeight="extrabold" fontSize="30px">Earn</Text>
              <Text fontSize="18px">
                Earn attractive returns when you provide liquidity to a trading pair on Curve, Convex, Balancer and others.
              </Text>
            </VStack>
            <LandingSubmitButton href="/yield-opportunities">
              I want to Earn
            </LandingSubmitButton>
          </SimpleCard>
          <SimpleCard minH="470px" w='33%' justify="space-between">
            <VStack w='full'>
              <Image src="/assets/v2/landing/stake.png?" width="full" w="150px" h="150px" mt="6" />
              <Text fontWeight="extrabold" fontSize="30px">Stake</Text>
              <Text fontSize="18px">
                Buy INV and stake on Frontier with high APY. Participate in Governance.
              </Text>
            </VStack>
            <LandingSubmitButton href="/frontier">
              I want to Stake INV
            </LandingSubmitButton>
          </SimpleCard>          
        </ResponsiveStack>       
        <Image zIndex="-1" src="/assets/v2/landing/building4.png" w="300px" position="absolute" bottom="-100px" right="-100px" />
        <VStack w='full' alignItems="center" mt="24" spacing="8">
          <SplashedText
              as="h4"
              color={`${lightTheme?.colors.mainTextColor}`}
              fontSize="36px"
              fontWeight="extrabold"
              splash="horizontal-lr2"
              splashProps={{ w: '400px', h: '100px', left: '-20px', top: '-20px' }}
            >
              Meet our security partners
          </SplashedText>
          <ResponsiveStack pt="4" justify="center" alignItems="center">
            <SimpleGrid columns={2} gap={4} w='60%'>
              <VStack w="250px" h="180px" bgColor="white" alignItems="center" justify="center">
                <Image maxW="150px" src="/assets/v2/landing/code4arena.png" />
              </VStack>
              <VStack w="250px" h="180px" bgColor="white" alignItems="center" justify="center">
                <Image maxW="150px" src="/assets/v2/landing/hats.png" />
              </VStack>
              <VStack w="250px" h="180px" bgColor="white" alignItems="center" justify="center">
                <Image maxW="150px" src="/assets/v2/landing/defimoon.png" />
              </VStack>
              <VStack w="250px" h="180px" bgColor="white" alignItems="center" justify="center">
                <Image maxW="150px" src="/assets/v2/landing/peckshield.png" />
              </VStack>
            </SimpleGrid>
            <VStack w='40%' alignItems="flex-start" spacing='4'>
              <Text fontWeight="bold" fontSize="24px">
                Designed from the ground up with security in mind and now backing it up with third party security professionals
              </Text>
              <Text fontSize="20px">
                We know the importance of security, especially for new lending protocols.Read our audit reports or work with us as we expand our third party security efforts.
              </Text>
              <LandingOutlineButton w='200px' href="https://docs.inverse.finance/" target="_blank">
                Learn More
              </LandingOutlineButton>
            </VStack>
          </ResponsiveStack>
        </VStack>
      </Flex>
      <Flex zIndex="1" px="8%" py="10" w="full" bgColor={lightTheme.colors.mainTextColor} direction="column" position="relative">
          <ResponsiveStack justify="space-between">
            <Text color="white" maxW="600px">
              Inverse Finance invites developers and security researches to take a look at our repos on Github and earn bug bounty rewards.
            </Text>
            <LandingOutlineButton w='200px' boxShadow="none" href="https://docs.inverse.finance/" target="_blank">
              Bug Bounty Program
            </LandingOutlineButton>
          </ResponsiveStack>
      </Flex>
      <VStack spacing="20" px="8%" py="20" w="full" bgImage="/assets/v2/landing/wall.png" bgRepeat="no-repeat" backgroundSize="cover" direction="column" position="relative">        
        <VStack alignItems="flex-start" spacing="2" w='full' bgImage="/assets/v2/landing/part2.png" position="relative">
          <SplashedText            
            splash="cross-dirty"
            containerProps={{ top: '-160px', zIndex: '0', right: '-150px', left: 'inherit', position: "absolute" }}
            splashProps={{ bgColor: lightTheme?.colors.secAccentTextColor, right: 0, left: 'inherit', bottom: '-10px', top: 'inherit', height: '600px', width: '400px' }}
          >              
          </SplashedText>
          <ResponsiveStack w='full' alignItems="center">
            <SplashedText
              as="h3"
              color={`${lightTheme?.colors.mainTextColor}`}
              fontSize="36px"
              fontWeight="extrabold"
              splash="horizontal-rl"
              splashProps={{ right: 0, left: 'inherit', bottom: '-10px', top: 'inherit' }}
            >
              Our Ecosystem
            </SplashedText>            
            <LandingSubmitButton w='200px' href="https://discord.gg/YpYJC7R5nv" target="_blank">
              Become a Partner
            </LandingSubmitButton>
          </ResponsiveStack>
          <Text fontWeight="bold" fontSize="20px">
            Tabs
          </Text>
        </VStack>
        <VStack alignItems="flex-start" spacing="2" w='full' py="20" bgImage="/assets/v2/landing/part2.png" position="relative">         
          <ResponsiveStack w='full' alignItems="center">
            <SplashedText
              as="h3"
              color={`${lightTheme?.colors.mainTextColor}`}
              fontSize="36px"
              fontWeight="extrabold"
              splash="circle"
              splashProps={{ right: '-60px', h: '80px', left: 'inherit', bottom: '-10px', top: 'inherit' }}
            >
              The Stats
            </SplashedText>
            <LandingSubmitButton w='200px' href="/analytics">
              DAO Analytics
            </LandingSubmitButton>
          </ResponsiveStack>
          <Text fontSize="18px">
            Inverse Finance DAO operates unmatched transparency into its operation and governance
          </Text>
          <ResponsiveStack pt="8" w='full' alignItems="center">
            {stats.map(stat => <Stat key={stat.name} {...stat} />)}
          </ResponsiveStack>
        </VStack>
        <VStack alignItems="flex-start" spacing="2" w='full' position="relative">
          <ResponsiveStack w='full' alignItems="center">
            <SplashedText
              as="h3"
              color={`${lightTheme?.colors.mainTextColor}`}
              fontSize="36px"
              fontWeight="extrabold"
              splash="horizontal-wave"
              splashProps={{ w: '600px', h: '50px', right: '-200px', left: 'inherit', bottom: 0, top: 'inherit' }}
            >
              Built For You, Governed By You
            </SplashedText>
            <LandingSubmitButton w='200px' href="/transparency">
              DAO Transparency
            </LandingSubmitButton>
          </ResponsiveStack>
          <ResponsiveStack pt="8" w='full' alignItems="center" justify="space-around">
            <SimpleCard spacing="0" p="0">
            <SplashedText            
              splash="cross-dirty"
              containerProps={{ top: '-60px', left: '-120px', zIndex: '-1', position: "absolute" }}
              splashProps={{ bgColor: lightTheme?.colors.secAccentTextColor, left: 'inherit', height: '600px', width: '400px' }}
            >              
            </SplashedText>
              <Image src="/assets/v2/landing/inverse-light.gif" h="300px" w="360px" />
            </SimpleCard>
            <VStack w='40%' alignItems="flex-start" spacing='4'>
              <Text fontWeight="bold" fontSize="24px">
              Inverse Finance DAO operates using a 100% on-chain governance voting model that avoids the pitfalls of centralized DAO governance. 
              </Text>
              <Text fontSize="20px">
                We are the most transparent DAO in DeFi with unprecedented levels of operational visibility. 
              </Text>
              <Link href="https://www.inverse.finance/blog/posts/en-US/dola-borrowing-rights-dbr-airdrop" fontWeight="bold" color={lightTheme.colors.mainTextColor} textDecoration="underline">
                Airdrop Info >>
              </Link>
              <ResponsiveStack>
                <LandingSubmitButton w='200px' href="https://discord.gg/YpYJC7R5nv" target="_blank">
                  <Image src="/assets/socials/discord.svg" h='10px' mr="1" />
                  Join our Discord
                </LandingSubmitButton>
                <LandingOutlineButton w='200px' href="/governance">
                  View Proposals
                </LandingOutlineButton>
              </ResponsiveStack>
            </VStack>
          </ResponsiveStack>
        </VStack>
        <VStack alignItems="flex-start" spacing="8" w='full' position="relative">
          <ResponsiveStack w='full' alignItems="center" justify="space-between">
            <SplashedText
              as="h3"
              color={`${lightTheme?.colors.mainTextColor}`}
              fontSize="36px"
              fontWeight="extrabold"
              splash="horizontal-rl"
              splashProps={{ w: '400px', h: '40px', right: '-20px', left: 'inherit', bottom: '-10px', top: 'inherit' }}
            >
              Check Out Our The Latest Alpha...
            </SplashedText>
            <HStack>
              <LandingSubmitButton w='200px' href="https://twitter.com/InverseFinance" target="_blank">
                <Image src="/assets/socials/twitter.svg" h='10px' mr="1" />
                Follow on Twitter
              </LandingSubmitButton>
              <LandingSubmitButton w='120px' href="/blog">
                View Blog
              </LandingSubmitButton>
            </HStack>
          </ResponsiveStack>
          <ResponsiveStack overflow="visible" spacing="6">
            {posts.map(post => {
              return <LightPostPreview key={post.slug} w='300px' {...post} />
            })}
          </ResponsiveStack>
        </VStack>
      </VStack>
    </Layout>
  )
}

export default Landing;

export async function getStaticProps(context) {
  return { ...await getLandingProps(context), revalidate: 1500 }
}

// export async function getStaticPaths() {
//   if(!process.env.CONTENTFUL_SPACE_ID) {
//     return { paths: [], fallback: true }
//   }
//   return {
//     // paths: ['/'],
//     fallback: true,
//   }
// }
