import { Input } from '@app/components/common/Input';
import { useEligibleRefunds } from '@app/hooks/useDAO';
import { RepeatClockIcon } from '@chakra-ui/icons';
import { Divider, Flex, HStack, Stack, Text, VStack, InputLeftElement, InputGroup } from '@chakra-ui/react';

import { Timestamp } from '@app/components/common/BlockTimestamp/Timestamp';
import { SubmitButton } from '@app/components/common/Button';
import Container from '@app/components/common/Container';
import ScannerLink from '@app/components/common/ScannerLink';
import { SkeletonBlob } from '@app/components/common/Skeleton';
import Table from '@app/components/common/Table';
import { useEffect, useState } from 'react';
import { timestampToUTC } from '@app/util/misc';
import { ONE_DAY_MS } from '@app/config/constants';
import { InfoMessage } from '@app/components/common/Messages';

const columns = [
    {
        field: 'timestamp',
        label: 'Date',
        header: ({ ...props }) => <Flex justify="flex-start" minW={'120px'} {...props} />,
        value: ({ timestamp }) => <Flex justify="flex-start" minW={'120px'}>
            <Timestamp timestamp={timestamp} />
        </Flex>,
    },
    {
        field: 'txHash',
        label: 'TX',
        header: ({ ...props }) => <Flex justify="center" minWidth={'110px'} {...props} />,
        value: ({ txHash, chainId }) => <Flex justify="center" minWidth={'110px'}>
            <ScannerLink type="tx" value={txHash} chainId={chainId} />
        </Flex>,
    },
    {
        field: 'from',
        label: 'From',
        header: ({ ...props }) => <Flex justify="center" minWidth={'120px'} {...props} />,
        value: ({ from, chainId }) => <Flex justify="center" minWidth={'120px'}>
            <ScannerLink value={from} chainId={chainId} />
        </Flex>,
        filterWidth: '120px',
        showFilter: true,
    },
    {
        field: 'to',
        label: 'Contract',
        header: ({ ...props }) => <Flex justify="center" minWidth={'200px'} {...props} />,
        value: ({ to, chainId }) => <Flex justify="center" minWidth={'200px'}>
            <ScannerLink value={to} chainId={chainId} />
        </Flex>,
        filterWidth: '200px',
        showFilter: true,
    },
    {
        field: 'type',
        label: 'Type',
        header: ({ ...props }) => <Flex justify="center" minWidth={'120px'} {...props} />,
        value: ({ type }) => <Flex justify="center" minWidth={'120px'}>
            <Text>{`${type[0].toUpperCase()}${type.substring(1, type.length)}`}</Text>
        </Flex>,
        filterWidth: '120px',
        showFilter: true,
    },
    {
        field: 'name',
        label: 'Event',
        header: ({ ...props }) => <Flex justify="flex-end" minWidth={'180px'} {...props} />,
        value: ({ name, contractTicker }) => <VStack justify="flex-end" minWidth={'180px'} alignItems="center">
            <Text>{name}</Text>
            { !!contractTicker && <Text>{contractTicker}</Text> }
        </VStack>,
        filterWidth: '180px',
        showFilter: true,
    },
];

const MAX_DELTA_DAYS = 5;

export const DaoOperationsTable = () => {
    const now = new Date();
    const [startDate, setStartDate] = useState(timestampToUTC((+(now))-ONE_DAY_MS*2));
    const [endDate, setEndDate] = useState(timestampToUTC(+(now)));
    const [chosenStartDate, setChosenStartDate] = useState(startDate);
    const [chosenEndDate, setChosenEndDate] = useState(endDate);
    const [reloadIndex, setReloadIndex] = useState(0);
    const [subfilters, setSubfilters] = useState({});
    const [isAboveMaxRange, setIsAboveMaxRange] = useState(false);

    const { transactions: items, isLoading } = useEligibleRefunds(chosenStartDate, chosenEndDate, reloadIndex, true);

    useEffect(() => {
        const deltaDays = Math.round(Math.abs(Date.parse(startDate) - Date.parse(endDate))/ONE_DAY_MS);        
        setIsAboveMaxRange(deltaDays > MAX_DELTA_DAYS);
    }, [startDate, endDate]);

    const reloadData = () => {
        setChosenStartDate(startDate);
        setChosenEndDate(endDate);
        setReloadIndex(reloadIndex + 1);
    }

    const isValidDateFormat = (date: string) => {
        return /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date);
    }

    return (
        <Container
            label="DAO Transactions on Ethereum in the last 3 days"
            description="Taken into consideration: Governance, Multisigs, Delegation Submissions, Feds, Inv oracle"
            noPadding
            contentProps={{ maxW: { base: '90vw', sm: '100%' }, overflowX: 'auto' }}
        >
            {
                isLoading ?
                    <SkeletonBlob />
                    :
                    <VStack spacing="4" w='full' alignItems="space-between">                        
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
                            <HStack w='auto'>
                                {/* <InputGroup>
                                    <InputLeftElement fontSize="12px" children={<Text color="secondaryTextColor" pl="4">From:</Text>} />
                                    <Input fontSize="12px" isInvalid={!isValidDateFormat(startDate)} p="0" value={startDate} placeholder="Start date UTC" onChange={(e) => setStartDate(e.target.value)} />
                                </InputGroup>
                                <InputGroup>
                                    <InputLeftElement fontSize="12px" children={<Text color="secondaryTextColor" pl="4">To:</Text>} />
                                    <Input fontSize="12px" isInvalid={!isValidDateFormat(endDate) && !!endDate} pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" p="0" value={endDate} placeholder="End date UTC" onChange={(e) => setEndDate(e.target.value)} />
                                </InputGroup> */}
                                <SubmitButton disabled={!isValidDateFormat(startDate) || (!isValidDateFormat(endDate) && !!endDate) || isAboveMaxRange} maxW="30px" onClick={reloadData}>
                                    <RepeatClockIcon />
                                </SubmitButton>
                                {
                                    isAboveMaxRange && <InfoMessage
                                        alertProps={{ minW: '300px', fontSize: '12px'}}
                                        description={`Please choose a duration below ${MAX_DELTA_DAYS} days`}
                                    />
                                }
                            </HStack>
                        </Stack>
                        <Divider />
                        <Table
                            columns={columns}
                            items={items}
                            keyName={'txHash'}
                            defaultSort="timestamp"
                            defaultSortDir="desc"
                            defaultFilters={subfilters}
                            onFilter={(visibleItems, filters) => {
                                setSubfilters(filters);
                            }}
                        />
                    </VStack>
            }
        </Container>
    )
}