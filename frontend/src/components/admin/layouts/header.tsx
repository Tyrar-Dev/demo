"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon, User, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/redux/slices/userSlice";
import axios from "axios";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "@/components/shared/token/accessToken";


interface HeaderProps {
    search: string;
    setSearch: (value: string) => void;
}

const HeaderAdmin: React.FC<HeaderProps> = ({ search, setSearch }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [accessToken, setAccessToken] = useState<string>('');

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        if (userInfo) {
            setUser(userInfo);
        }

        loadData();
        if (accessToken) {
            handleGetInforUser();
        }
    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleLogout = async () => {
        dispatch(clearUser());
        router.push(`/auth/signin`);
    }

    const handleGetInforUser = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="flex justify-end items-center gap-2 p-3 bg-white shadow-md border-b sticky top-0 z-50">
            <div className="relative flex items-center w-full max-w-sm">
                <SearchIcon className="absolute left-3 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm kiếm...."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="relative z-50" onClick={() => setIsUserOpen(!isUserOpen)}>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition duration-150 cursor-pointer">
                    <img
                        src={user?.urlAvatar}
                        alt="Admin"
                        className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-blue-500/50"
                        onError={(e: any) => e.target.src = "https://placehold.co/40x40/0E7490/FFFFFF?text=AD"}
                    />
                </button>

                {isUserOpen && (
                    <div className="absolute right-0 w-64 bg-white rounded-2xl shadow-2xl z-50">
                        <div className="p-1 rounded-xl">
                            <button
                                className="flex items-center gap-3 w-full p-3 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                onClick={() => {
                                    setIsUserOpen(false);
                                    router.push("/admin/information");
                                }}
                            >
                                <User size={18} className="text-blue-500" />
                                Thông tin cá nhân
                            </button>
                            <button
                                className="flex items-center gap-3 w-full p-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition mt-1"
                                onClick={() => {
                                    handleLogout();
                                    setIsUserOpen(false);
                                }}
                            >
                                <LogOut size={18} className="text-red-500" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderAdmin;
