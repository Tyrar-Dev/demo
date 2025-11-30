import Wallet from "@/components/wallet/wallet";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Ví AutoBot - AutoBot Phái Sinh',
    description: 'Trang ví AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const WalletPage = () => {
    return (
        <div>
            <Wallet />
        </div>
    )
}

export default WalletPage