import UserManagementPage from "@/components/admin/user/user";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang người dùng Admin - AutoBot Phái Sinh',
    description: 'Trang người dùng Admin AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const UserDashboardPage = () => {
    return (
        <div>
            <UserManagementPage />
        </div>
    )
}

export default UserDashboardPage;