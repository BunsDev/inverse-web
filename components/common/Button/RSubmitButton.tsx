
import { Link, ButtonProps, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import { SubmitButton } from "."
import { lightTheme } from '@app/variables/theme'

type Props = ButtonProps & { href?: string, target?: string, linkProps?: LinkProps }

export const RSubmitButton = (props: Props) => {
    const _props = { borderLeftRadius: '50vmax', borderRightRadius: '50vmax', ...props }
    if (_props?.href) {
        const { target, linkProps, ...btnProps } = _props;
        return <NextLink href={_props.href} passHref>
            <Link target={target} textDecoration="none" _hover={{ textDecoration: 'none' }} {...linkProps}>
                <SubmitButton w='full' {...btnProps} />
            </Link>
        </NextLink>
    }
    return <SubmitButton {..._props} />
}

export const LandingSubmitButton = (props: Props) => {
    const px = !props?.px ? { base: '2', sm: '40px', '2xl': '3vw' } : props.px;
    const py = !props?.py ? { base: '2', sm: '20px', '2xl': '2vmin' } : props.py;
    return <RSubmitButton
        boxShadow="none"
        textTransform="inherit"
        w={{ base: 'full', sm: 'auto' }}
        px={px}
        py={py}
        h='50px'
        fontSize={{ base: '16px', '2xl': '0.9vw' }}
        {...props} />
}

export const LandingOutlineButton = (props: Props) => {
    return <LandingSubmitButton color={lightTheme.colors.mainTextColor} border={`1px solid ${lightTheme.colors.mainTextColor}`} bgColor="white" {...props} />
}