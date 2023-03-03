import { Flex, Stack, Text, Image, HStack } from "@chakra-ui/react"
import Table from "../common/Table"
import { preciseCommify } from "@app/util/misc"
import { shortenNumber } from "@app/util/markets"
import Container from "../common/Container"
import { UnderlyingItem } from "../common/Assets/UnderlyingItem"
import { PROTOCOL_IMAGES } from "@app/variables/images"
import { NETWORKS_BY_CHAIN_ID } from "@app/config/networks"

const ColHeader = ({ ...props }) => {
    return <Flex justify="flex-start" minWidth={'150px'} fontSize="14px" fontWeight="extrabold" {...props} />
}

const Cell = ({ ...props }) => {
    return <Stack direction="row" fontSize="14px" fontWeight="normal" justify="flex-start" minWidth="150px" {...props} />
}

const CellText = ({ ...props }) => {
    return <Text fontSize="15px" {...props} />
}

const FilterItem = ({ ...props }) => {
    return <HStack fontSize="14px" fontWeight="normal" justify="flex-start" {...props} />
}

const columns = [
    {
        field: 'lpName',
        label: 'Pool',
        header: ({ ...props }) => <ColHeader minWidth="200px" justify="flex-start"  {...props} />,
        value: (lp) => {
            return <Cell minWidth='200px' spacing="2" justify="flex-start" alignItems="center" direction="row">
                <UnderlyingItem {...lp} label={lp.lpName} showAsLp={true} chainId={lp.chainId} />
            </Cell>
        },
    },
    {
        field: 'protocol',
        label: 'Protocol',
        showFilter: true,
        filterWidth: '70px',
        filterItemRenderer: ({ protocol }) => <FilterItem>
            <Image src={PROTOCOL_IMAGES[protocol]} h='20px' w='20px' borderRadius="50px" title={protocol} />
            <Text>{protocol}</Text>
        </FilterItem>,
        header: ({ ...props }) => <ColHeader minWidth="80px" justify="center"  {...props} />,
        value: ({ protocol, protocolImage }) => {
            return <Cell minWidth='80px' spacing="2" justify="center" alignItems="center" direction="row">
                <Image src={protocolImage} h='20px' w='20px' borderRadius="50px" title={protocol} />
            </Cell>
        },
    },
    {
        field: 'chainId',
        label: 'Chain',
        showFilter: true,
        filterWidth: '70px',
        filterItemRenderer: ({ chainId }) => <FilterItem>
            <Image src={NETWORKS_BY_CHAIN_ID[chainId].image} h='20px' w='20px' borderRadius="50px" title={NETWORKS_BY_CHAIN_ID[chainId].name} />
            <Text>{NETWORKS_BY_CHAIN_ID[chainId].name}</Text>
        </FilterItem>,
        header: ({ ...props }) => <ColHeader minWidth="80px" justify="center"  {...props} />,
        value: ({ chainId, networkName }) => {
            const net = NETWORKS_BY_CHAIN_ID[chainId];
            return <Cell minWidth='80px' spacing="2" justify="center" alignItems="center" direction="row">
                <Image src={net.image} ignoreFallback={true} title={net.name} alt={net.name} w={5} h={5} mr="2" />
            </Cell>
        },
    },
    {
        field: 'tvl',
        label: 'TVL',
        header: ({ ...props }) => <ColHeader minWidth="120px" justify="flex-end"  {...props} />,
        value: ({ tvl }) => {
            return <Cell minWidth="120px" justify="flex-end" fontSize="15px">
                <CellText>{preciseCommify(tvl, 0, true)}</CellText>
            </Cell>
        },
    },
    {
        field: 'pairingDepth',
        label: 'Pairing Depth',
        header: ({ ...props }) => <ColHeader minWidth="120px" justify="flex-end"  {...props} />,
        value: ({ pairingDepth }) => {
            return <Cell minWidth="120px" justify="flex-end" fontSize="15px">
                <CellText>{preciseCommify(pairingDepth || 0, 0, true)}</CellText>
            </Cell>
        },
    },
    {
        field: 'dolaBalance',
        label: 'DOLA Balance',
        header: ({ ...props }) => <ColHeader minWidth="120px" justify="flex-end"  {...props} />,
        value: ({ dolaBalance }) => {
            return <Cell minWidth="120px" justify="flex-end" fontSize="15px">
                <CellText>{preciseCommify(dolaBalance || 0, 0, true)}</CellText>
            </Cell>
        },
    },
    {
        field: 'dolaWeight',
        label: 'DOLA Weight',
        header: ({ ...props }) => <ColHeader minWidth="90px" justify="flex-end"  {...props} />,
        value: ({ dolaWeight }) => {
            return <Cell minWidth="90px" justify="flex-end" fontSize="15px">
                <CellText>{shortenNumber(dolaWeight || 0, 2)}%</CellText>
            </Cell>
        },
    }
    , {
        field: 'pol',
        label: 'PoL',
        header: ({ ...props }) => <ColHeader minWidth="120px" justify="flex-end"  {...props} />,
        value: ({ pol }) => {
            return <Cell minWidth="120px" justify="flex-end" fontSize="15px">
                <CellText>{preciseCommify(pol, 0, true)}</CellText>
            </Cell>
        },
    }
    , {
        field: 'polDom',
        label: 'Pool Dom',
        header: ({ ...props }) => <ColHeader minWidth="90px" justify="flex-end"  {...props} />,
        value: ({ polDom }) => {
            return <Cell minWidth="90px" justify="flex-end" fontSize="15px">
                <CellText>{shortenNumber(polDom, 2)}%</CellText>
            </Cell>
        },
    }
];

export const PoLsTable = ({
    items,
}) => {
    return <Container noPadding p="0" label="Liquidity Pools" description="Accross all chains">
        <Table
            key="address"
            columns={columns}
            items={items}
            defaultSort="tvl"
            defaultSortDir="desc"
        />
    </Container>
}