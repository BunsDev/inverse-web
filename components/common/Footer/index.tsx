import { Image, Stack, Text } from '@chakra-ui/react'
import { MENUS } from '@app/variables/menus'
import Link from '@app/components/common/Link'
import { useAppTheme } from '@app/hooks/useAppTheme';
import { lightTheme } from '@app/variables/theme';
import { LandingOutlineButton } from '../Button/RSubmitButton';
import { smallerSize2, smallerSize3, smallerSize4, smallerSize5 } from '@app/variables/responsive';

const SOCIALS = MENUS.socials;

const LINK_GROUPS = MENUS.footerGroups;

export const Footer = ({ isLanding = false }: { isLanding?: boolean }) => {
  const { themeName } = useAppTheme();
  const isLight = isLanding || themeName !== 'dark';
  const textColor = isLight ? lightTheme.colors.contrastMainTextColor : undefined;
  const secTextColor = isLight ? lightTheme.colors.secContrastMainTextColor : undefined;
  const bgColor = isLight ? lightTheme.colors.mainTextColor : 'transparent';

  return <Stack
    bgColor={bgColor}
    w="full"
    direction={{ base: 'column', lg: 'row' }}
    spacing={8}
    p={8}
    px="8%"
    justify="space-between"
    color="mainTextColor"
  >
    <Stack width={{ base: 'full', lg: 72 }} spacing={1}>
      <Stack direction="row" align="center">
        <Text fontSize={smallerSize3} fontWeight="bold" color={textColor}>Keep in touch</Text>
      </Stack>
      <Text fontSize={smallerSize4} color={secTextColor}>
        Inverse is building a suite of DeFi tools. Everything we do is a community effort, which means you too can participate in the decision-making process. Join us!
      </Text>
      <Stack pt="3" alignItems={{ base: 'center', sm: 'flex-start' }}>
        <LandingOutlineButton href="/newsletter" w={{ base: '150px', '2xl': 'auto' }} fontSize={smallerSize2} py="0" px="1vw">
          Subscribe Now
        </LandingOutlineButton>
      </Stack>
    </Stack>
    <Stack
      justify={{ base: 'flex-start', lg: 'space-around' }}
      spacing={{ base: 0, lg: 8 }}
      direction="row"
      wrap="wrap"
      shouldWrapChildren
      zIndex="0"
    >
      {LINK_GROUPS.map(({ groupLabel, items }) => (
        <Stack mt={{ base: '4', sm: '0' }} key={groupLabel} w={{ base: 28, '2xl': 48 }} spacing="1">
          <Text fontSize={smallerSize3} fontWeight="bold" color={textColor}>{groupLabel}</Text>
          {items.map(({ label, href }, i) => (
            <Link
              _hover={{ color: secTextColor, textDecoration: 'underline' }}
              color={secTextColor}
              key={i}
              href={href}
              fontSize={smallerSize5}
              as="a"
            >
              {label}
            </Link>
          ))}
        </Stack>
      ))}
      <Stack direction="column" spacing={2} align="flex-start">
        <Text fontSize={smallerSize3} fontWeight="bold" color={textColor}>
          Social
        </Text>
        <Stack direction="row">
          {SOCIALS.map(({ href, image }, i) => (
            <Link key={i} href={href} as="a">
              <Image width="24px" height="20px" src={image} alt="Social" />
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  </Stack>
}

export default Footer
