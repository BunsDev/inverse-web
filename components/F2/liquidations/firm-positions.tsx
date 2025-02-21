import { Flex, HStack, Stack, Text, useDisclosure, VStack } from "@chakra-ui/react"
import { shortenNumber } from "@app/util/markets";
import Container from "@app/components/common/Container";
import { getRiskColor } from "@app/util/f2";
import { BigImageButton } from "@app/components/common/Button/BigImageButton";
import { useFirmPositions } from "@app/hooks/useFirm";
import Link from "@app/components/common/Link";
import { ViewIcon } from "@chakra-ui/icons";
import ScannerLink from "@app/components/common/ScannerLink";
import moment from 'moment'
import { useState } from "react";
import { FirmLiquidationModal } from "./FirmLiquidationModal";
import Table from "@app/components/common/Table";

const ColHeader = ({ ...props }) => {
    return <Flex justify="flex-start" minWidth={'100px'} fontSize="14px" fontWeight="extrabold" {...props} />
}

const Cell = ({ ...props }) => {
    return <Stack direction="row" fontSize="14px" fontWeight="normal" justify="flex-start" minWidth="100px" {...props} />
}

const CellText = ({ ...props }) => {
    return <Text fontSize="16px" {...props} />
}

const columns = [
    {
        field: 'marketName',
        label: 'Market',
        header: ({ ...props }) => <ColHeader minWidth="200px" justify="flex-start"  {...props} />,
        value: ({ market }) => {
            const { name, icon, marketIcon, underlying } = market;
            return <Cell minWidth="200px" justify="flex-start" alignItems="center" >
                <BigImageButton bg={`url('${marketIcon || icon || underlying.image}')`} h="40px" w="60px" backgroundSize='contain' backgroundRepeat="no-repeat" />
                <CellText>{name}</CellText>
            </Cell>
        },
        showFilter: true,
        filterWidth: '200px',
        filterItemRenderer: ({ marketName }) => <CellText>{marketName}</CellText>
    },
    {
        field: 'user',
        label: 'Borrower',
        header: ({ ...props }) => <ColHeader justify="flex-start" {...props} minWidth="120px" />,
        value: ({ user }) => {
            return <Cell w="120px" justify="flex-start" position="relative" onClick={(e) => e.stopPropagation()}>
                <Link isExternal href={`/firm?viewAddress=${user}`}>
                    <ViewIcon color="blue.600" boxSize={3} />
                </Link>
                <ScannerLink value={user} />
            </Cell>
        },
        showFilter: true,
        filterWidth: '100px',
    },
    {
        field: 'deposits',
        label: 'Deposits',
        header: ({ ...props }) => <ColHeader minWidth="100px" justify="center"  {...props} />,
        value: ({ deposits, market }) => {
            return <Cell minWidth="100px" justify="center" alignItems="center" direction="column" spacing="0">
                <CellText>{shortenNumber(deposits, 2)}</CellText>
                <CellText>({shortenNumber(deposits * market?.price, 2, true)})</CellText>
            </Cell>
        },
    },
    {
        field: 'creditLimit',
        label: 'Max debt',
        header: ({ ...props }) => <ColHeader minWidth="100px" justify="center"  {...props} />,
        value: ({ creditLimit }) => {
            return <Cell minWidth="100px" justify="center" alignItems="center" direction="column" spacing="0">
                <CellText>{shortenNumber(creditLimit, 2)}</CellText>
            </Cell>
        },
    },
    {
        field: 'debt',
        label: 'Debt',
        header: ({ ...props }) => <ColHeader minWidth="100px" justify="center"  {...props} />,
        value: ({ debt }) => {
            return <Cell minWidth="100px" justify="center" >
                <CellText>{shortenNumber(debt, 2)}</CellText>
            </Cell>
        },
    },
    // {
    //     field: 'liquidationPrice',
    //     label: 'Liq. price',
    //     header: ({ ...props }) => <ColHeader minWidth="100px" justify="center"  {...props} />,
    //     value: ({ liquidationPrice }) => {
    //         return <Cell minWidth="100px" justify="center" alignItems="center" direction="column" spacing="0">
    //             <CellText>{preciseCommify(liquidationPrice, 2, true)}</CellText>                
    //         </Cell>
    //     },
    // },
    {
        field: 'isLiquidatable',
        label: 'In shortfall?',
        header: ({ ...props }) => <ColHeader minWidth="150px" alignItems="center" justify="center"  {...props} />,
        value: ({ isLiquidatable }) => {
            return <Cell minWidth="150px" justify="center" direction="column" alignItems="center">
                <CellText color={isLiquidatable ? 'error' : 'mainTextColor'}>{isLiquidatable ? 'Yes' : 'No'}</CellText>
            </Cell>
        },
        showFilter: true,
        filterWidth: '100px',
    },
    {
        field: 'liquidatableDebt',
        label: 'Seizable',
        header: ({ ...props }) => <ColHeader minWidth="150px" alignItems="center" justify="center"  {...props} />,
        value: ({ seizableWorth, liquidatableDebt }) => {
            return <Cell minWidth="150px" justify="center" direction="column" alignItems="center">
                {
                    liquidatableDebt > 0 ? <>
                        <CellText>{shortenNumber(seizableWorth, 2, true)}</CellText>
                        <CellText>for {shortenNumber(liquidatableDebt, 2)} DOLA</CellText>
                    </> : <CellText>-</CellText>
                }
            </Cell>
        },
    },
    {
        field: 'perc',
        label: 'Borrow Limit',
        header: ({ ...props }) => <ColHeader minWidth="100px" justify="flex-end"  {...props} />,
        value: ({ perc, debt }) => {
            const color = getRiskColor(perc);
            return <Cell minWidth="100px" justify="flex-end" >
                <CellText color={debt > 0 ? color : undefined}>{debt > 0 ? `${shortenNumber(100-perc, 2)}%` : '-'}</CellText>
            </Cell>
        },
    },
]

export const FirmPositions = ({

}: {

    }) => {
    const { positions, timestamp } = useFirmPositions();
    const { onOpen, onClose, isOpen } = useDisclosure();
    const [position, setPosition] = useState(null);

    const openLiquidation = async (data) => {
        setPosition(data);
        onOpen();
    }
    
    const totalTvl = positions.reduce((prev, curr) => prev + (curr.deposits * curr.market.price), 0);
    const totalDebt = positions.reduce((prev, curr) => prev + curr.debt, 0);
    const avgHealth = positions?.length > 0 && totalDebt > 0 ? positions.reduce((prev, curr) => prev + curr.perc * curr.debt, 0) / totalDebt : 100;
    const avgRiskColor = getRiskColor(avgHealth);

    return <VStack w='full'>
        <Container
            label="FiRM Positions"
            description={timestamp ? `Last update ${moment(timestamp).from()}` : `Loading...`}
            contentProps={{ maxW: { base: '90vw', sm: '100%' }, overflowX: 'auto' }}
            headerProps={{
                direction: { base: 'column', md: 'row' },
                align: { base: 'flex-start', md: 'flex-end' },
            }}
            right={
                <HStack justify="space-between" spacing="4">
                    <VStack alignItems={{ base: 'flex-start', sm: 'center' }}>
                        <Text fontWeight="bold">Avg Borrow Limit</Text>
                        <Text color={avgRiskColor}>{shortenNumber(100-avgHealth, 2)}%</Text>
                    </VStack>
                    <VStack alignItems="center">
                        <Text textAlign="center" fontWeight="bold">Total Value Locked</Text>
                        <Text textAlign="center" color="secondaryTextColor">{shortenNumber(totalTvl, 2, true)}</Text>
                    </VStack>
                    <VStack alignItems="flex-end">
                        <Text textAlign="right" fontWeight="bold">Total Debt</Text>
                        <Text textAlign="right" color="secondaryTextColor">{shortenNumber(totalDebt, 2, true)}</Text>
                    </VStack>
                </HStack>
            }
        >
            {
                !!position && <FirmLiquidationModal onClose={onClose} isOpen={isOpen} position={position} />
            }
            <Table
                keyName="key"
                noDataMessage="No live positions in last update"
                columns={columns}
                items={positions}
                onClick={(v) => openLiquidation(v)}
                defaultSort="debt"
                defaultSortDir="desc"
            />
        </Container>
    </VStack>
}