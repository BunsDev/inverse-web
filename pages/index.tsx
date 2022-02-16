// TODO: Clean up the landing page, this was rushed in a few hours
import { Box, Flex, Image, Spacer, Stack, Text } from '@chakra-ui/react'
import { RTOKEN_CG_ID } from '@app/variables/tokens'
import LinkButton, { LinkOutlineButton } from '@app/components/common/Button'
import Layout from '@app/components/common/Layout'
import { LandingNav } from '@app/components/common/Navbar'
import { TEST_IDS } from '@app/config/test-ids'
import { useDOLA } from '@app/hooks/useDOLA'
import { usePrices } from '@app/hooks/usePrices'
import { useTVL } from '@app/hooks/useTVL'
import Link from '@app/components/common/Link'

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
    href: '/anchor',
  },
  {
    title: 'Anchor',
    description: 'Earn more with decentralized, capital-efficient lending, borrowing',
    label: 'Lend & Borrow',
    image: '/assets/products/anchor.png',
    href: '/anchor',
  },
  {
    title: 'DOLA',
    description: 'Borrow our fully-collateralized, low-interest stablecoin',
    label: 'Swap DOLA',
    image: '/assets/products/dola.png',
    href: '/stabilizer',
  },
]

const formatStat = ({ value, showDollar, showPercentage }: any): string => {
  const _value = value || 0

  if (showPercentage) {
    return `${(_value * 100).toFixed(0)}%`
  }

  let display = _value.toLocaleString()
  if (_value >= Math.pow(10, 9)) {
    display = `${(_value / Math.pow(10, 9)).toFixed(2)}b`
  } else if (_value >= Math.pow(10, 6)) {
    display = `${(_value / Math.pow(10, 6)).toFixed(2)}m`
  } else if (_value >= Math.pow(10, 4)) {
    display = `${(_value / Math.pow(10, 3)).toFixed(0)}k`
  }

  return `${showDollar ? '$' : ''}${display}`
}

export const Landing = () => {
  const { totalSupply } = useDOLA()
  const { prices } = usePrices()
  const { tvl } = useTVL()

  const stats = [
    {
      label: 'TVL',
      value: tvl,
      showDollar: true,
    },
    {
      label: 'DOLA Supply',
      value: totalSupply,
      showDollar: true,
    },
    {
      label: '$INV Price',
      value: prices[RTOKEN_CG_ID] ? prices[RTOKEN_CG_ID].usd : 0,
      showDollar: true,
    },
  ]

  return (
    <Layout bgColor="#020207" pt="0">
      <Flex w="full" bgImage="/assets/landing/graphic1.png" bgRepeat="no-repeat" direction="column">
        <LandingNav />
        <Stack w="full" align="center" mt={{ base: 4, md: 28 }} spacing={4} p={2}>
          <Flex direction="column">
            {/* <Text color="secondary" fontWeight="bold">
              Invert the System
            </Text> */}
            <Flex
              direction="column"
              fontSize={{ base: '3xl', md: '7xl' }}
              fontWeight="bold"
              lineHeight="shorter"
              textAlign="center"
            >
              <Text>Master the Game</Text>
              <Stack direction="row">
                <Text>Of</Text>
                <Text pl="2" color="secondaryPlus">Positive Sum DeFi</Text>
              </Stack>
            </Flex>
          </Flex>
          <Flex
            direction="column"
            textAlign="center"
            fontSize={{ base: 'md', md: 'xl' }}
            lineHeight={{ base: 'base', md: 'shorter' }}
            fontWeight="medium"
            maxW="900px"
          >
            <Text>
              Here at Inverse, we're decentralized by design, moving past reckless, outdated systems towards a better solution: Positive Sum Defi.
              We help you maximize your earnings via revenue sharing, accumulate high yields with sustainable APYs, and benefit from low-cost stable coin borrowing. Join our community to grow and thrive.
            </Text>
          </Flex>
          <Flex pt="4">
            <Flex w={32} m={2}>
              <LinkButton flexProps={{ bgColor: 'primaryPlus' }} data-testid={TEST_IDS.landing.enterBtn} target="_self" href="/anchor">
                Enter App
              </LinkButton>
            </Flex>
            <Flex w={32} m={2}>
              <LinkOutlineButton data-testid={TEST_IDS.landing.learnMore} target="_self" href="https://docs.inverse.finance/">Learn More</LinkOutlineButton>
            </Flex>
          </Flex>
          <Text pt={16} fontSize={{ base: 'md', md: 'lg' }} textAlign="center" fontWeight="medium">
            {process.env.NEXT_PUBLIC_SHORTNAME} is proudly partnered with leading cryptocurrency & DeFi protocols
          </Text>
          <Stack pt={4} direction="row" spacing={0} justify="center" wrap="wrap" shouldWrapChildren>
            {projects.map((project) => (
              <Flex key={project} w={16} h={16} m={6}>
                <Image w={16} h={16} src={project} />
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Flex>
      <Stack w={{ base: 'full', xl: 'container.xl' }} mt={{ base: 8, lg: 24 }} p={8}>
        <Text pb={8} fontSize="2xl" fontWeight="bold" textAlign={{ base: 'center', lg: 'start' }}>
          Start Earning With Inverse Now:
        </Text>
        <Stack
          w="full"
          direction="row"
          justify={{ base: 'center', lg: 'space-around' }}
          spacing={0}
          wrap="wrap"
          shouldWrapChildren
        >
          {cards.map(({ title, description, label, image, href }) => (
            <Stack
              key={title}
              p={8}
              m={4}
              textAlign="center"
              borderRadius={16}
              bgColor="purple.800"
              align="center"
              shadow="dark-lg"
            >
              <Text fontSize="2xl" fontWeight="bold">
                {title}
              </Text>
              <Text w={{ base: 56, lg: 64 }} h={12} whiteSpace="pre-line" fontSize="sm" fontWeight="medium">
                {description}
              </Text>
              <Spacer />
              <Flex w={'180px'} pt={6}>
                <LinkButton flexProps={{ bgColor: "primaryPlus" }} href={href}>{label}</LinkButton>
              </Flex>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Flex
        w="full"
        bgImage="/assets/landing/graphic2.png"
        bgRepeat="no-repeat"
        bgPosition="right top"
        justify="center"
        pt={{ base: 6, lg: 6 }}
        pb={{ base: 8, lg: 32 }}
      >
        <Flex w={{ base: 'full', xl: 'container.xl' }} p={8} pt="0" textAlign={{ base: 'center', lg: 'start' }}>
          <Stack w="3xl" spacing={6} align={{ base: 'center', lg: 'flex-start' }}>
            <Text fontSize="2xl" fontWeight="bold">
              New Bonding Opportunities with Olympus Pro!
            </Text>
            <Box fontSize="lg" color="white">
              Purchase INV at a substantial discount by depositing your Sushi or Curve liquidity pool tokens on Olympus Pro.
              <Link textDecoration="underline" isExternal display="inline-block" mx="1"
                href={process.env.NEXT_PUBLIC_BONDS_URL}>
                Click here
              </Link>
              <Text display="inline-block">for bonding or </Text>
              <Link textDecoration="underline" isExternal display="inline-block" ml="1"
                href="https://docs.inverse.finance/inverse-finance/providing-liquidity/olympus-pro-bonds">
                Learn more
              </Link>.
            </Box>
            <Text fontSize="2xl" fontWeight="bold">
              Join the Inverse DAO - Governance By The People
            </Text>
            <Text fontSize="lg">
              Inverse.finance was created by a sole developer in December 2020, and since then has grown to include
              hundreds of active DAO members voting on the direction of the organization.
            </Text>
            <Text fontSize="lg">
              Our vision is to establish one of DeFi’s major financial ecosystems giving users of all levels inclusive
              access to meaningful opportunities spanning a variety of innovative, DAO-owned protocols, all governed by
              an empowered {process.env.NEXT_PUBLIC_REWARD_TOKEN_SYMBOL} community.
            </Text>
            <Flex w={32}>
              <LinkButton flexProps={{ bgColor: "primaryPlus" }} href="https://discord.gg/YpYJC7R5nv">Join the DAO</LinkButton>
            </Flex>
          </Stack>
        </Flex>
      </Flex>
      <Flex
        position="relative"
        w="full"
        bgGradient="linear(to-bl, #2a2557 0%, #191633 100%);"
        align="center"
        direction="column"
        pt={{ base: 16, lg: 32 }}
        pb={{ base: 16, lg: 32 }}
        mb={-6}
      >
        <Flex
          position="absolute"
          bgImage="/assets/landing/graphic3.png"
          bgRepeat="no-repeat"
          bgSize="100% 100%"
          w="full"
          h="full"
          top={0}
          left={0}
        ></Flex>
        <Stack
          w="full"
          pl={{ base: 8, lg: 16, xl: 32 }}
          pr={{ base: 8, lg: 16, xl: 32 }}
          pb={0}
          direction={{ base: 'column', md: 'row' }}
          spacing={0}
          wrap="wrap"
          shouldWrapChildren
          justify="space-around"
        >
          {stats.map((stat) => (
            <Stack key={stat.label} align="center" m={4}>
              <Text fontSize="5xl" fontWeight="bold" lineHeight={1}>
                {formatStat(stat)}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.100">
                {stat.label}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Flex>
    </Layout>
  )
}

export default Landing
