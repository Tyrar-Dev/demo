import Header from "@/components/admin/layouts/header";
import Sidebar from "@/components/admin/layouts/sidebar";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="flex-1 flex flex-col ml-64">
                <Header
                    search={search}
                    setSearch={setSearch} />
                <main>{children}</main>
            </div>
        </div>
    );
}