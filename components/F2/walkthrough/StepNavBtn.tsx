import { SubmitButton } from "@app/components/common/Button"
import { RSubmitButton } from "@app/components/common/Button/RSubmitButton"
import { ButtonProps } from "@chakra-ui/react"

export const StepNavBtn = (props: ButtonProps) => {
    return <RSubmitButton
        px={{ base: '2', sm: '4', md: '6', lg: '6' }}
        h={{ base: '40px', md: '50px' }}
        fontSize={{ base: '12px', sm: '16px', md: '20px' }}
        minW="fit-content"
        w="150px"
        {...props} />
}