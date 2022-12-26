import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/accordion"
import { Box } from "@chakra-ui/react"
import Container from "../Container"

export type FAQType = {
    label: string
    defaultCollapse?: boolean
    collapsable?: boolean
    items: {
        title: string
        body: any
    }[]
}

export const FAQ = ({
    label = 'FAQ',
    items,
    collapsable = false,
    defaultCollapse = false,
}: FAQType) => {
    return <Container
        label={label}
        noPadding 
        p="0"
        collapsable={collapsable}
        defaultCollapse={defaultCollapse}
        lineHeight="0"
    >
        <Accordion w='full' allowMultiple>
            {
                items.map((item, i) => {
                    return <AccordionItem border="none" borderBottom={i < (items.length - 1) ? '1px solid #eee' : 'none'} key={item.title}>
                        <h2>
                            <AccordionButton >
                                <Box flex='1' lineHeight="normal" textAlign='left' color="mainTextColor" fontWeight="bold" fontSize="lg">
                                    {item.title}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel lineHeight="normal" pb={4} color="secondaryTextColor">
                            {item.body}
                        </AccordionPanel>
                    </AccordionItem>
                })
            }
        </Accordion>
    </Container>
}