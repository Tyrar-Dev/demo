import Signin from "@/components/auth/signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Đăng nhập - AutoBot Phái Sinh',
    description: 'Trang đăng nhập AutoBot - Cho thuê bot chứng khoán phái sinh',
}

const SigninPage = () => {
    return (
        <div>
            <Signin />
        </div>
    )
}

export default SigninPage;