import AdminInformationPage from "@/components/admin/information/information";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang thông tin Admin - AutoBot Phái Sinh',
    description: 'Trang thông tin Admin AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const AdminInformation = () => {
    return (
        <div>
            <AdminInformationPage />
        </div>
    )
}

export default AdminInformation;