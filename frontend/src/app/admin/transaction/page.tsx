import TransactionHistory from "@/components/admin/transaction/transaction";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang lịch sử giao dịch Admin - AutoBot Phái Sinh',
    description: 'Trang lịch sử giao dịch AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const TransactionPage = () => {
    return (
        <div>
            <TransactionHistory />
        </div>
    )
}

export default TransactionPage;