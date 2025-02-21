import { NavButtons } from "@app/components/common/Button"
import Link from "@app/components/common/Link";
import InfoModal from "@app/components/common/Modal/InfoModal"
import { useAccount } from "@app/hooks/misc";
import { useAccountDBR } from "@app/hooks/useDBR";
import { useState } from "react"
import { F2RechargeDBRForm } from "../forms/F2RechargeDBRForm";
import { DBRInfos } from "../Infos/DBRInfos"
import { BUY_LINKS } from "@app/config/constants";

const INFOS_TAB = 'Infos';
const CALCULATOR_TAB = 'Calculator';

export const F2DbrInfosModal = ({
    onClose,
    isOpen,
}: {
    onClose: () => void
    isOpen: boolean
}) => {
    const [tab, setTab] = useState(INFOS_TAB);
    const account = useAccount();
    const { dailyDebtAccrual, debt } = useAccountDBR(account);

    return <InfoModal
        title={`Fixed Rate Duration and DBR`}
        onClose={onClose}
        onOk={onClose}
        isOpen={isOpen}
        minW={{ base: '98vw', lg: '650px' }}
        okLabel="Close"
        footerLeft={
            <Link textDecoration="underline" fontWeight="bold" href={BUY_LINKS.DBR} isExternal target="_blank">
                {debt > 0 ? 'Top-up DBR balance' : 'Get DBR tokens'}
            </Link>
        }
    >
        <NavButtons
            // bgColorActive="blue.800"
            // bgColor="blue.700"
            active={tab}
            options={[INFOS_TAB, CALCULATOR_TAB]}
            onClick={(v) => (setTab(v))}
        />
        {
            tab === INFOS_TAB && <DBRInfos />
        }
        {
            tab === CALCULATOR_TAB && <F2RechargeDBRForm dailyDebtAccrual={dailyDebtAccrual} />
        }
    </InfoModal>
}