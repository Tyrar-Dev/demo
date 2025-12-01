"use client";

import Image from "next/image";
import { FaMoneyBill, FaMoneyBillWave, FaRobot } from "react-icons/fa";
import { LayoutGrid, Users, Briefcase, HelpCircle, Settings } from 'lucide-react';
import { IoChatbox } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


interface NavItem {
    name: string;
    key: string;
    icon: React.FC<any>;
    section: "MAIN MENU" | "ACCOUNT";
    link?: string;
}

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const router = useRouter();
    const pathname = usePathname();

    const NAV_ITEMS: NavItem[] = [
        { name: "Bảng điều khiển", key: "dashboard", icon: LayoutGrid, section: "MAIN MENU", link: "/admin/dashboard" },
        { name: "Người dùng", key: "policies", icon: Users, section: "MAIN MENU", link: "/admin/user" },
        { name: "Quản lý Bot", key: "calendar", icon: FaRobot, section: "MAIN MENU" },
        { name: "Đặt lệnh", key: "brokers", icon: Briefcase, section: "MAIN MENU" },
        { name: "Nội dung trang", key: "deals", icon: LayoutGrid, section: "MAIN MENU" },
        { name: "Lịch sử chuyển tiền", key: "exceptions", icon: FaMoneyBillWave, section: "MAIN MENU", link: "/admin/transaction" },
        { name: "Đoạn chat", key: "chat", icon: IoChatbox, section: "MAIN MENU", link: '/admin/chat' },
        { name: "Yêu cầu rút tiền", key: "withdraw", icon: FaMoneyBill, section: "MAIN MENU" },
        { name: "Hỗ trợ", key: "help", icon: HelpCircle, section: "ACCOUNT" },
        { name: "Cài đặt", key: "settings", icon: Settings, section: "ACCOUNT" },
    ];

    const menuSections: Record<string, NavItem[]> = {
        "MAIN MENU": NAV_ITEMS.filter(item => item.section === "MAIN MENU"),
        "ACCOUNT": NAV_ITEMS.filter(item => item.section === "ACCOUNT"),
    };

    return (
        <div className="w-64 bg-white border-r flex flex-col h-full fixed top-0 left-0 z-40">
            {/* Logo */}
            <div className="p-5 flex items-center gap-2 text-xl font-bold text-blue-600 border-b">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
                    <Image width={1000} height={1000} alt="Logo" src={'/assets/images/logo.png'} />
                </div>
                AutoBot
            </div>

            <nav className="flex-1 p-5 space-y-6 overflow-y-auto">
                {Object.keys(menuSections).map(section => (
                    <div key={section}>
                        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-2">{section}</h3>
                        <div className="space-y-1">
                            {menuSections[section].map(item => (
                                <button
                                    key={item.key}
                                    className={`flex items-center gap-3 p-3 text-sm rounded-lg w-full text-left transition-all duration-200 ${pathname === item.link
                                        ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                        }`}
                                    onClick={() => {
                                        setActiveTab(item.key);
                                        if (item.link) router.push(item.link);
                                    }}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Account Info */}
            <div className="p-4 border-t flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <img
                    src="https://placehold.co/40x40/4c84ff/ffffff?text=TB"
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e: any) => e.target.src = "https://placehold.co/40x40/4c84ff/ffffff?text=User"}
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800">Peaky Blinders</p>
                    <p className="text-xs text-gray-500">Sales Marketing</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;