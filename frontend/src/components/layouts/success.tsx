'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ArrowRight, Check } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "sonner";
import axios from "axios";
import { GetAccessToken } from "../shared/token/accessToken";

const Success = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [accessToken, setAccessToken] = useState<string>('');
    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        handleVerifyDepositStatus(userInfo?.Id, accessToken);
    }, [userInfo?.Id, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const handleVerifyDepositStatus = async (userId: any, accessToken: string) => {
        console.log(accessToken);
        console.log(userId);
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Payment/VerifyDepositStatus?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-700"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
            </div>

            <div className="grow flex items-center justify-center z-10 py-20 px-4">
                <div className="text-center max-w-3xl mx-auto">

                    <div className="mb-10 relative flex justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        </div>

                        <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl shadow-green-100 animate-[bounce_3s_infinite]">
                            <div className="absolute inset-0 rounded-full border-4 border-green-50"></div>

                            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                                <Check className="w-10 h-10 text-white stroke-3" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
                            <div className="absolute -bottom-1 -left-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                            <div className="absolute top-1/2 -right-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-teal-600">
                            Thành công tuyệt đối!
                        </span>
                    </h2>

                    <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        Yêu cầu của bạn đã được hệ thống xử lý hoàn tất.
                        <br className="hidden md:block" />
                        Mọi thứ đã sẵn sàng, bạn có thể tiếp tục ngay bây giờ.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="group relative px-8 py-4 bg-green-600 text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2">
                            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                            <span>Tiếp tục giao dịch</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <Link
                            href="/"
                            className="px-8 py-4 bg-white text-gray-600 border-2 border-gray-100 font-bold rounded-full shadow-sm hover:shadow-md hover:border-green-200 hover:text-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            <span>Về trang chủ</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;