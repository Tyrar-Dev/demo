"use client";

import { useState } from "react";
import Sidebar from "../layouts/sidebar";
import Header from "../layouts/header";

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [search, setSearch] = useState("");

    return (
        // <div className="flex min-h-screen bg-gray-100">
        //     <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        //     <div className="flex-1 flex flex-col ml-64">
        //         <Header search={search} setSearch={setSearch} />

        <div className="">
            {activeTab !== "dashboard" && (
                <div className="p-6">
                    <div className="bg-white p-8 rounded-xl shadow-lg min-h-[70vh] flex items-center justify-center">
                        <h3 className="text-2xl font-semibold text-gray-600">
                            Nội dung {activeTab} đang được phát triển...
                        </h3>
                    </div>
                </div>
            )}
        </div>
        //     </div>
        // </div>
    );
};

export default Dashboard;
