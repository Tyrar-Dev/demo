import Deposit from "@/components/wallet/deposit";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang nạp tiền ví AutoBot - AutoBot Phái Sinh',
    description: 'Trang nạp tiền ví AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const DepositPage = () => {
    return (
        <div>
            <Deposit />
        </div>
    )
}

export default DepositPage