import Active from "@/components/auth/isactive";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Kích hoạt tài khoản - AutoBot Phái Sinh',
    description: 'Trang kích hoạt tài khoản AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const ActivePage = () => {
    return (
        <div>
            <Active />
        </div>
    )
}

export default ActivePage;