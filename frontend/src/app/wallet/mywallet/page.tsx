import Deposit from "@/components/wallet/deposit";
import MyWallet from "@/components/wallet/mywallet";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Ví AutoBot - AutoBot Phái Sinh',
    description: 'Trang ví AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const WalletHomePage = () => {
    return (
        <div>
            <MyWallet />
        </div>
    )
}

export default WalletHomePage;