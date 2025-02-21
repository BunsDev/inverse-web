import { NetworkIds, Token } from '@app/types'
import { CHAIN_TOKENS } from '@app/variables/tokens';
import { Flex, HStack, Image } from '@chakra-ui/react'
import { MarketImage } from './MarketImage';

export const LPImages = ({
    lpToken,
    chainId = NetworkIds.mainnet,
    includeSubLps = false
}: {
    lpToken: Token,
    chainId?: NetworkIds,
    includeSubLps?: boolean
}) => {
    const subtokens = (lpToken.pairs?.map(address => CHAIN_TOKENS[chainId][address]) || []).filter(t => includeSubLps || (!includeSubLps && !t.isLP));
    if(subtokens?.length === 2 && subtokens[1].symbol === 'DOLA' && subtokens[0].symbol !== 'INV'){
        subtokens.reverse();
    }
    return <HStack spacing="1">
        {
            subtokens.map(t => {
                return <MarketImage key={t.address} size={20} image={t.image} protocolImage={t.protocolImage} imgProps={{ borderRadius: '50px' }} />
            })
        }
    </HStack>
}

export const LpPairImages = ({
    leftImg,
    rightImg,
    leftSize = 15,
    rightSize = 15,
    rightDeltaX = -10,
    rightDeltaY = 0,
}: {
    leftImg: string,
    rightImg: string,
    leftSize?: number,
    rightSize?: number,
    rightDeltaX?: number,
    rightDeltaY?: number
}) => {

    return (
        <Flex alignItems="center" w={`${leftSize+rightSize+rightDeltaX}px`}>
            <Image zIndex="1" borderRadius={'50px'} w={`${leftSize}px`} h={`${leftSize}px`} ignoreFallback={true} src={leftImg} />
            <Image borderRadius={'50px'} transform={`translate3d(${rightDeltaX}px, ${rightDeltaY}px, 0)`} w={`${rightSize}px`} h={`${rightSize}px`} ignoreFallback={true} src={rightImg} />
        </Flex>
    )
}