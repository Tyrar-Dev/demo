'use client';

import { useEffect, useState } from "react";
import {
    FiCode,
    FiChevronRight,
    FiShield,
    FiZap,
    FiClock,
    FiActivity,
    FiCheckCircle,
    FiAlertCircle,
    FiCheck
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { GetAccessToken } from "../shared/token/accessToken";

const Deposit = () => {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [id, setId] = useState<string>('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(100000);
    const amounts = [10000, 20000, 50000, 100000, 200000, 500000];
    const [accessToken, setAccessToken] = useState<string>('');

    const [transactions, setTransactions] = useState([
        { id: 1, user: "User***992", amount: 500000, time: "Vừa xong", method: "VietQR" },
        { id: 2, user: "User***104", amount: 2000000, time: "15 giây trước", method: "VietQR" },
        { id: 3, user: "User***553", amount: 100000, time: "42 giây trước", method: "VietQR" },
        { id: 4, user: "User***881", amount: 50000, time: "1 phút trước", method: "VietQR" },
        { id: 5, user: "User***229", amount: 1000000, time: "2 phút trước", method: "VietQR" },
        { id: 6, user: "User***331", amount: 200000, time: "3 phút trước", method: "VietQR" },
    ]);

    const handleRechargeInWallet = async () => {
        const accessToken = await GetAccessToken(userInfo?.Id);
        if (!userInfo?.Id) return;

        if (!accessToken) {
            toast.error('Bạn chưa đăng nhập, vui lòng thử lại sau');
            return;
        }

        if (!selectedAmount) {
            toast.error('Vui lòng chọn hoặc nhập số tiền để tiếp tục');
            return;
        }
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_URL_API}Payment/CreateWalletDepositLink`,
                {
                    userId: userInfo.Id,
                    amount: selectedAmount
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            router.push(`${res.data.data}`);
        } catch (err) {
            console.log(err);
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleRechargeInWallet();
        }}>
            <div className="min-h-screen flex flex-col bg-slate-50">
                <main className="grow w-full flex flex-col items-center p-4 md:p-12 relative z-10 gap-8">

                    <div className="text-white text-center mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Nạp tiền vào ví</h1>
                        <p className="text-blue-100 opacity-90">Hệ thống nạp tự động qua VietQR 24/7 - An toàn & Nhanh chóng</p>
                    </div>

                    <div className="w-full max-w-[1600px] bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
                            <div className="lg:col-span-7 p-8 md:p-12 border-b lg:border-r border-slate-100">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                    <h3 className="text-xl font-bold">Chọn số tiền cần nạp</h3>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                    {amounts.map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setSelectedAmount(amount)}
                                            className={`py-5 px-4 rounded-xl border-2 font-bold text-lg transition-all
                                            ${selectedAmount === amount
                                                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                                                    : "border-slate-100 bg-slate-50 text-slate-600"
                                                }`}
                                        >
                                            {formatCurrency(amount)}
                                            {selectedAmount === amount && (
                                                <div className="absolute top-0 right-0 w-6 h-6 bg-blue-600 rounded-bl-xl flex items-center justify-center">
                                                    <FiCheck className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1">Số tiền khác</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={Number(selectedAmount)}
                                            onChange={(e) => setSelectedAmount(Number(e.target.value))}
                                            placeholder="Nhập số tiền (tối thiểu 10.000đ)"
                                            className="w-full pl-6 pr-16 py-4 rounded-xl border-2 border-slate-200"
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">VND</span>
                                    </div>
                                </div>

                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex gap-4">
                                    <FiAlertCircle className="text-amber-600 w-5 h-5 mt-0.5" />
                                    <div className="text-sm text-amber-900">
                                        <p className="font-bold mb-1">Lưu ý quan trọng:</p>
                                        <p>Vui lòng nhập chính xác <strong>Nội dung chuyển khoản</strong> để hệ thống tự động cộng tiền.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 p-8 md:p-12 bg-slate-50">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                    <h3 className="text-xl font-bold">Phương thức thanh toán</h3>
                                </div>

                                <div className="p-5 rounded-2xl border-2 border-blue-600 bg-white shadow-lg mb-8 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border">
                                            <FiCode />
                                        </div>
                                        <div>
                                            <p className="font-bold text-blue-900 text-lg">VietQR Pro</p>
                                            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                                <FiCheckCircle className="text-green-500" /> Tự động duyệt 24/7
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-200">
                                    <div className="flex justify-between mb-6">
                                        <span className="text-slate-500 text-sm">Tổng thanh toán</span>
                                        <span className="text-3xl font-extrabold text-blue-700">
                                            {selectedAmount ? formatCurrency(selectedAmount) : "0 ₫"}
                                        </span>
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 text-lg">
                                        <span>Tạo mã QR Ngay</span>
                                        <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lịch sử */}
                    <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border p-6">
                            <div className="mb-8">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                                    <FiShield />
                                </div>
                                <h4 className="text-lg font-bold">An toàn tuyệt đối</h4>
                                <p className="text-sm text-slate-500">Bảo mật chuẩn quốc tế.</p>
                            </div>

                            <div className="mb-8 border-t"></div>

                            <div>
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                                    <FiZap />
                                </div>
                                <h4 className="text-lg font-bold">Nhanh chóng</h4>
                                <p className="text-sm text-slate-500">Xử lý giao dịch tự động.</p>
                            </div>
                        </div>

                        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <FiActivity />
                                    </div>
                                    <h3 className="text-lg font-bold">Lịch sử nạp mới nhất</h3>
                                </div>
                                <span className="text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded-full border">
                                    Live System
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                                                {tx.user.substring(0, 1)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{tx.user}</p>
                                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <FiClock /> {tx.time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">+{new Intl.NumberFormat('vi-VN').format(tx.amount)}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{tx.method}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center pb-8">
                        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                            <FiClock /> Hỗ trợ trực tuyến 24/7.
                        </p>
                    </div>

                </main>
            </div>
        </form>
    );
};

export default Deposit;
