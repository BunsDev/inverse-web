import { BoxProps, ImageProps, Text, TextProps } from '@chakra-ui/react'
import { OLD_XINV } from '@app/config/constants'
import { NotifBadge } from '@app/components/common/NotifBadge'
import React from 'react'
import { Token } from '@app/types';
import { MarketImage } from './MarketImage';

const DEFAULT_CONTAINER = React.Fragment;

export const UnderlyingItem = ({
    label,
    image,
    address,
    imgSize = 20,
    imgProps,
    imgContainerProps,
    textProps,
    badge,
    Container = DEFAULT_CONTAINER,
    containerProps,
    protocolImage,
}: {
    label: string,
    image: string,
    address?: string,
    imgSize?: number,
    imgProps?: Partial<ImageProps>,
    imgContainerProps?: Partial<BoxProps>,
    textProps?: Partial<TextProps>,
    badge?: Token["badge"],
    Container?: React.ComponentType<any>,
    containerProps?: any,
    protocolImage?: string,
}) => {
    const paused = /(-v1|old)/i.test(label);
    return <Container {...containerProps}>
        <MarketImage
            size={imgSize}
            image={image}
            protocolImage={protocolImage}
            isInPausedSection={paused}
            imgProps={imgProps}
            {...imgContainerProps}
        />
        <Text opacity={paused ? 0.5 : undefined} {...textProps}>{label}{address === OLD_XINV ? ' (OLD)' : ''}</Text>
        {
            !!badge &&
            <NotifBadge position="absolute" right="-20px" fontSize="12px" w="fit-content" top="auto" bgColor={badge.color}>
                {badge.text}
            </NotifBadge>
        }
    </Container>
}
