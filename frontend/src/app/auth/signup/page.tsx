import SignupOne from "@/components/auth/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Đăng ký - AutoBot Phái Sinh',
    description: 'Trang đăng ký AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const SignupPage = () => {
    return (
        <div>
            <SignupOne />
        </div>
    )
}

export default SignupPage;