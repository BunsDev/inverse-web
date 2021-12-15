import { useState } from 'react'
import { FormControl, FormLabel, VStack } from '@chakra-ui/react'
import { AddressAutocomplete } from '@inverse/components/common/Input/AddressAutocomplete'
import ScannerLink from '@inverse/components/common/ScannerLink'
import { isAddress } from 'ethers/lib/utils'
import { useEffect } from 'react';
import { AutocompleteItem, NetworkIds, TemplateProposalFormActionFields, ProposalTemplates } from '@inverse/types'
import { getNetworkConfigConstants } from '@inverse/config/networks';
import { RadioCardGroup } from '@inverse/components/common/Input/RadioCardGroup'

const { COMPTROLLER, CONTRACTS } = getNetworkConfigConstants(NetworkIds.mainnet)

const anchorContractsList = Object.entries(CONTRACTS)
    .filter(([address, label]) => label.startsWith('an'))
    .map(([address, label]) => {
        return { value: address, label }
    })

const FUNCTIONS = {
    [ProposalTemplates.anchorLending]: '_setMintPaused',
    [ProposalTemplates.anchorBorrowing]: '_setBorrowPaused',
}

const LABELS = {
    [ProposalTemplates.anchorLending]: 'Pause supplying',
    [ProposalTemplates.anchorBorrowing]: 'Pause borrowing',
}

export const AnchorBoolTemplate = ({
    defaultAddress = '',
    defaultValue = '',
    type,
    onDisabledChange,
    onActionChange,
}: {
    defaultAddress?: string,
    defaultValue?: string,
    type: ProposalTemplates.anchorLending | ProposalTemplates.anchorBorrowing,
    onDisabledChange: (v: boolean) => void
    onActionChange: (action: TemplateProposalFormActionFields | undefined) => void
}) => {
    const [address, setAddress] = useState(defaultAddress);
    const [value, setValue] = useState(defaultValue);
    const [action, setAction] = useState<TemplateProposalFormActionFields | undefined>(undefined);
    const [isDisabled, setIsDisabled] = useState(true);

    const functionName = FUNCTIONS[type]

    useEffect(() => {
        onDisabledChange(isDisabled)
    }, [isDisabled])

    useEffect(() => {
        onActionChange(action)
    }, [action])

    useEffect(() => {
        const disabled = !['true', 'false'].includes(value) || !address || !isAddress(address)
        setIsDisabled(disabled)
        if (disabled) { return }

        const action: TemplateProposalFormActionFields = {
            contractAddress: COMPTROLLER,
            func: `${functionName}(address cToken,bool state)`,
            args: [
                { type: 'address', value: address, name: 'cToken' },
                { type: 'bool', value: value, name: 'state' },
            ],
            value: '0',
        }
        setAction(action)
    }, [value, address])

    const handleValueChange = (val: string) => {
        setValue(val)
    }

    const handleAddressChange = (item: AutocompleteItem | undefined) => {
        setAddress(item?.value || '')
    }

    return (
        <VStack spacing="4">
            <FormControl>
                <FormLabel>
                    Anchor Market :
                    {
                        defaultAddress && isAddress(defaultAddress) ?
                            <ScannerLink value={defaultAddress} shorten={true} /> : null
                    }
                </FormLabel>
                <AddressAutocomplete
                    title="Available Anchor Markets : "
                    list={anchorContractsList}
                    defaultValue={defaultAddress}
                    onItemSelect={handleAddressChange}
                />
            </FormControl>
            <FormControl>
                <FormLabel>
                    {LABELS[type]} for this market ? :
                </FormLabel>
                <RadioCardGroup
                    wrapperProps={{ w: 'full', justify: 'center', mt: '4' }}
                    group={{
                        name: 'bool',
                        defaultValue,
                        onChange: handleValueChange,
                    }}
                    radioCardProps={{ w: '80px', textAlign: 'center', p: '1' }}
                    options={[{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                />
            </FormControl>
        </VStack>
    )
}