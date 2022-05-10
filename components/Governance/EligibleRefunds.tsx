import { useEligibleRefunds } from '@app/hooks/useDAO';
import { RefundableTransaction } from '@app/types';
import { submitRefunds } from '@app/util/governance';
import { CheckIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Flex, Stack, Text, VStack } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { Timestamp } from '../common/BlockTimestamp/Timestamp';
import { SubmitButton } from '../common/Button';
import Container from '../common/Container';
import { Input } from '../common/Input';
import { InfoMessage } from '../common/Messages';
import ScannerLink from '../common/ScannerLink';
import { SkeletonBlob } from '../common/Skeleton';
import Table from '../common/Table';

export const EligibleRefunds = () => {
    const { account, library } = useWeb3React<Web3Provider>();
    const { transactions: items, isLoading } = useEligibleRefunds();
    const [eligibleTxs, setEligibleTxs] = useState<RefundableTransaction[]>([]);
    const [checkedTxs, setCheckedTxs] = useState<string[]>([]);
    const [refundTxHash, setRefundTxHash] = useState('');

    useEffect(() => {
        if(checkedTxs.length > 0 || eligibleTxs.length > 0){ return }
        setEligibleTxs(items)
    }, [items, checkedTxs, eligibleTxs]);

    useEffect(() => {
        console.log(checkedTxs)
        setEligibleTxs(eligibleTxs.map(t => ({ ...t, checked: checkedTxs.includes(t.txHash) })));
    }, [checkedTxs])

    const handleCheckTx = (txHash: string) => {
        console.log(txHash)
        if (checkedTxs.includes(txHash)) {
            setCheckedTxs(checkedTxs.filter(h => txHash !== h));
        } else {
            setCheckedTxs([...checkedTxs, txHash])
        }
    }

    const columns = [
        {
            field: 'txHash',
            label: 'TX',
            header: ({ ...props }) => <Flex justify="flex-start" minWidth={'110px'} {...props} />,
            value: ({ txHash }) => <Flex justify="flex-start" minWidth={'110px'}>
                <ScannerLink type="tx" value={txHash} />
            </Flex>,
        },
        {
            field: 'timestamp',
            label: 'Date',
            header: ({ ...props }) => <Flex justify="center" minW={'120px'} {...props} />,
            value: ({ timestamp }) => <Flex justify="center" minW={'120px'}>
                <Timestamp timestamp={timestamp} />
            </Flex>,
        },
        {
            field: 'fees',
            label: 'Paid Fees',
            header: ({ ...props }) => <Flex justify="flex-end" minWidth={'200px'} {...props} />,
            value: ({ fees }) => <Flex justify="flex-end" minWidth={'200px'} alignItems="center">
                <Text mr="1">{fees}</Text>
                {/* <AnimatedInfoTooltip message={fees} /> */}
            </Flex>,
        },
        {
            field: 'name',
            label: 'Action',
            header: ({ ...props }) => <Flex justify="flex-end" minWidth={'180px'} {...props} />,
            value: ({ name, call }) => <Flex justify="flex-end" minWidth={'180px'} alignItems="center">
                {name}
            </Flex>,
        },
        {
            field: 'from',
            label: 'From',
            header: ({ ...props }) => <Flex justify="center" minWidth={'120px'} {...props} />,
            value: ({ from, chainId }) => <Flex justify="center" minWidth={'120px'}>
                <ScannerLink value={from} chainId={chainId} />
            </Flex>,
        },
        {
            field: 'to',
            label: 'Contract',
            header: ({ ...props }) => <Flex justify="center" minWidth={'200px'} {...props} />,
            value: ({ to, chainId }) => <Flex justify="center" minWidth={'200px'}>
                <ScannerLink value={to} chainId={chainId} />
            </Flex>,
        },
        // {
        //     field: 'successful',
        //     label: 'Tx Success?',
        //     header: ({ ...props }) => <Flex justify="center" minWidth={'80px'} {...props} />,
        //     value: ({ successful }) => <Flex justify="center" minWidth={'80px'}>
        //         {successful ? 'yes' : 'no'}
        //     </Flex>,
        // },
        {
            field: 'refunded',
            label: 'Refunded?',
            header: ({ ...props }) => <Flex justify="center" minWidth={'80px'} {...props} />,
            value: ({ refunded, refundTxHash }) => <Flex justify="center" minWidth={'80px'}>
                {
                    refunded ?
                        <VStack>
                            <CheckIcon color="secondary" />
                            <ScannerLink value={refundTxHash} />
                        </VStack>
                        :
                        <MinusIcon />
                }
            </Flex>,
        },
        {
            field: 'checked',
            label: '#',
            header: ({ ...props }) => <Flex justify="center" minWidth={'80px'} {...props} />,
            value: ({ txHash, checked }) => <Flex justify="center" minWidth={'80px'} position="relative" onClick={() => handleCheckTx(txHash)}>
                <Box position="absolute" top="0" bottom="0" left="0" right="0" maring="auto" zIndex="1"></Box>
                <Checkbox value="true" isChecked={checked} />
            </Flex>
        },
    ];

    const handleRefund = (eligibleTxs, checkedTxs, refundTxHash) => {
        if (!library?.getSigner()) { return }
        const items = eligibleTxs.filter(t => checkedTxs.includes(t.txHash));
        return submitRefunds(items, refundTxHash, library?.getSigner(), ({ refunds, signedBy, signedAt }) => {
            const refundsTxHashes = refunds.map(r => r.txHash);
            const updatedItems = [...eligibleTxs];
            eligibleTxs.forEach((et, i) => {
                if (refundsTxHashes.includes(et.txHash)) {
                    const isRefunded = !!refundTxHash;
                    updatedItems[i] = { ...et, refundTxHash: refundTxHash, refunded: isRefunded, signedBy, signedAt }
                }
            })
            setEligibleTxs(updatedItems)
            setCheckedTxs([]);
            setRefundTxHash('');
        })
    }

    return (
        <Container
            label="Potentially Eligible Transactions for Gas Refunds"
            description="Taken into consideration: GovMills txs (VoteCasting: only for delegates) and Multisig txs"
            noPadding
            contentProps={{ maxW: { base: '90vw', sm: '100%' }, overflowX: 'auto' }}
            collapsable={true}
            right={<Stack direction={{ base: 'column-reverse', xl: 'row' }} w="700px" justifyContent="flex-end" alignItems={{ base: 'flex-end', xl: 'center' }}>
                {
                    checkedTxs.length > 0 && !!account ?
                        <>
                            <SubmitButton
                                disabled={!checkedTxs.length}
                                w="240px"
                                onClick={() => handleRefund(eligibleTxs, checkedTxs, refundTxHash)}>
                                {refundTxHash ? `Submit ${checkedTxs.length} Refund(s)` : `Cancel ${checkedTxs.length} Refund(s)`}
                            </SubmitButton>
                        </>
                        :
                        !!account ?
                            <InfoMessage alertProps={{ fontSize: '12px', w:'500px' }} description="Check at least one Transaction" />
                            :
                            <InfoMessage alertProps={{ fontSize: '12px' }} description="Please Connect Wallet" />

                }
                <Input
                    textAlign="left"
                    h="40px"
                    py="0"
                    fontSize="12px"
                    maxW="350px"
                    placeholder="Refund TX hash or Leave Blank to cancel refund action"
                    value={refundTxHash}
                    onChange={(e) => setRefundTxHash(e.target.value)}
                />
            </Stack>}
        >
            {
                isLoading ?
                    <SkeletonBlob />
                    :
                    eligibleTxs.length > 0 ?
                        <Table
                            columns={columns}
                            items={eligibleTxs}
                            keyName={'txHash'}
                            defaultSort="timestamp"
                            defaultSortDir="desc"
                            maxH="calc(100vh - 300px)"
                        />
                        :
                        <Text>No Eligible Transactions</Text>
            }
        </Container>
    )
}