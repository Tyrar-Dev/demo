import Active from "@/components/auth/isactive";
import Verify from "@/components/auth/twostep";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Xác minh 2 bước - AutoBot Phái Sinh',
    description: 'Trang xác minh 2 bước AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const TwoStepPage = () => {
    return (
        <div>
            <Verify />
        </div>
    )
}

export default TwoStepPage;