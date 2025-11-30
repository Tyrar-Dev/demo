import Dashboard from "@/components/admin/dashboard/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang bảng điều khiển Admin - AutoBot Phái Sinh',
    description: 'Trang bảng điều khiển Admin AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const DashboardPage = () => {
    return (
        <div>
            <Dashboard />
        </div>
    )
}

export default DashboardPage;