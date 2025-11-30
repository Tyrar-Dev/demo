import Forgot from "@/components/auth/forgot";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Quên mật khẩu - AutoBot Phái Sinh',
    description: 'Trang quên mật khẩu AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const FotgotPage = () => {
    return (
        <div>
            <Forgot />
        </div>
    )
}

export default FotgotPage;