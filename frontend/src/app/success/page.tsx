import Success from "@/components/layouts/success";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang trạng thái - AutoBot Phái Sinh',
    description: 'Trang trạng thái AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const SuccessPage = () => {
    return (
        <div>
            <Success />
        </div>
    )
}

export default SuccessPage