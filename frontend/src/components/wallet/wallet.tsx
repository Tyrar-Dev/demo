'use client';

import { RootState } from "@/redux/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaWallet,
    FaCheck,
    FaArrowRight,
    FaShieldAlt,
    FaBolt,
    FaLock,
    FaChartBar,
    FaBell,
    FaSearch,
    FaChartPie,
    FaEyeSlash,
    FaEye
} from "react-icons/fa";
import { FiActivity, FiZap } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { GetAccessToken } from "../shared/token/accessToken";

const Wallet = () => {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
    const [isCreateWallet, setIsCreateWallet] = useState<boolean>(false);
    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
    const [pin, setPin] = useState<string>('');
    const [confirmPin, setConfirmPin] = useState<string>('');
    const [showPin, setShowPin] = useState<boolean>(false);
    const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);
    const [walletInfo, setWalletInfo] = useState<any>(null);
    const [isEnterPin, setIsEnterPin] = useState<boolean>(false);
    const [isCheckWallet, setIsCheckWallet] = useState<boolean>(false);
    const [isWalletChecking, setIsWalletChecking] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState<string>('');

    useEffect(() => {
        setIsLoadingUser(false);
        loadData();
        if (accessToken && userInfo?.Id) {
            handleCheckWallet();
            handleCreateWallet();
        }
    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    }

    useEffect(() => {
        if (pin.length === 6 && isCheckWallet) {
            handleCreatePinCode();
        }
    }, [pin, isCheckWallet]);

    const handleCheckWallet = async () => {
        setIsWalletChecking(true);
        if (!accessToken) {
            alert("Bạn chưa đăng nhập!");
            return;
        }
        if (!userInfo?.Id) return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Wallet/GetWalletByUserId?userId=${userInfo?.Id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (res.data.status === 200) {
                setIsCreateWallet(true);
                setIsCheckWallet(true);
            } else {
                router.push('/wallet');
            }

        } catch (err) {

        }

        setIsWalletChecking(false);
    }

    const handleCreateWallet = async () => {
        try {
            if (!accessToken) {
                toast.error("Bạn chưa đăng nhập!");
                return;
            }

            if (!userInfo?.Id) {
                toast.error("Không tìm thấy userId từ userInfo!");
                return;
            }

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_URL_API}Wallet/CreateWallet?userId=${userInfo?.Id}`,
                { userId: userInfo?.Id },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = res.data;
            setWalletInfo(data);
            if (data === null) {
                toast.error("Bạn đã tạo ví rồi");
                setIsEnterPin(true);
            } else {
                setIsCreateWallet(true);
            }
        } catch (error) {
            toast.error("Lỗi tạo ví");
        }
    };

    const handleCreatePinCode = async () => {
        const pinRegex = /^[0-9]+$/;
        if (isCheckWallet) {
            try {
                if (!userInfo?.Id) {
                    toast.error("Không tìm thấy userId!");
                    return;
                }

                if (!pin) {
                    toast.error("Vui lòng nhập mã PIN");
                    return;
                }

                if (!pinRegex.test(pin)) {
                    toast.error("PIN chỉ được phép chứa số!");
                    return;
                }
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL_API}Wallet/CheckPinWallet`,
                    {
                        userId: userInfo?.Id,
                        pin: pin
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (res.data.status === 200) {
                    router.push(`/wallet/mywallet`);
                } else {
                    toast.error(res.data.message || "Lỗi tạo PIN");
                }
            } catch (error: any) {
                toast.error(error);
            }
        } else {
            try {
                if (!userInfo?.Id) {
                    toast.error("Không tìm thấy userId!");
                    return;
                }

                if (!pin) {
                    toast.error("Vui lòng nhập đầy đủ PIN và xác nhận PIN!");
                    return;
                }

                if (!pinRegex.test(pin) || !pinRegex.test(confirmPin)) {
                    toast.error("PIN chỉ được phép chứa số!");
                    return;
                }

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL_API}Wallet/CreatePinWallet`,
                    {
                        userId: userInfo?.Id,
                        pin: pin,
                        confirmPin: confirmPin
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (res.data.status === 200) {
                    toast.success(res.data.message);
                    router.push(`/wallet/mywallet`);
                } else {
                    toast.error(res.data.message || "Lỗi tạo PIN");
                }
            } catch (error: any) {
                toast.error(error);
            }
        }


    };

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setPin(value);
    };

    if (isWalletChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                Đang tải ví...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans relative text-slate-800">
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop"
                    alt="Trading Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-slate-900/90 via-blue-900/80 to-slate-900/95"></div>
            </div>

            <main className="grow w-full flex items-center justify-center p-4 md:p-8 relative z-10">
                <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[40px] backdrop-blur-xl bg-white/5 ring-1 ring-white/10 shadow-2xl min-h-[600px]">


                    <div className="lg:col-span-5 p-10 md:p-16 text-white flex flex-col justify-between relative">
                        <div className="space-y-8">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-blue-400/30 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                                <FaWallet className="text-blue-300" />
                            </div>
                            <div>
                                <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">Ví AutoBot</span> <br />
                                    Siêu Tốc Độ.
                                </h2>
                                <p className="text-blue-100/80 text-lg mt-6 max-w-md font-light leading-relaxed">
                                    Trải nghiệm nạp rút không giới hạn và quản lý tài sản thông minh ngay trên nền tảng TradingBot.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 space-y-4">
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default group">
                                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                    <FiZap className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">Kích hoạt tức thì</p>
                                    <p className="text-sm text-blue-200/70">Sẵn sàng giao dịch trong 30s</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default group">
                                <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <FaShieldAlt size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white">Bảo mật Bank-Grade</p>
                                    <p className="text-sm text-blue-200/70">Mã hóa dữ liệu đa lớp</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!isCreateWallet && !isCheckWallet ? (
                            <motion.div
                                key="createWallet"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
                                className="lg:col-span-7 p-10 md:p-16 bg-white/95 backdrop-blur-2xl flex flex-col justify-center h-full"
                            >
                                <div className="max-w-2xl mx-auto w-full">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Mở khóa tiềm năng tài chính</h3>
                                        <p className="text-slate-500 text-base">Xác nhận thông tin để khởi tạo ví giao dịch của bạn.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">Loại ví</label>
                                            <div className="w-full p-6 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-blue-200">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-yellow-400 font-black text-2xl border-4 border-white shadow-sm">
                                                        ★
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-xl">Việt Nam Đồng</h4>
                                                        <p className="text-slate-500 font-medium">VND • Trading Account</p>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2.5 group-hover:translate-x-0">
                                                    <FaCheck size={20} strokeWidth={3} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 items-start p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                            <FaLock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Mã PIN giao dịch sẽ được yêu cầu thiết lập tại bước tiếp theo để đảm bảo an toàn tuyệt đối cho tài sản của bạn.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 py-2">
                                            <div className="relative flex items-center">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    checked={isTermsChecked}
                                                    onChange={() => setIsTermsChecked(!isTermsChecked)}
                                                    className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400"
                                                />
                                                <FaCheck size={16} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 pointer-events-none peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                            <label htmlFor="terms" className="text-base text-slate-600 cursor-pointer select-none">
                                                Tôi đồng ý với <a href="#" className="text-blue-600 font-bold hover:underline">Điều khoản sử dụng</a>.
                                            </label>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={!isTermsChecked}
                                            onClick={handleCreateWallet}
                                            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform duration-300 ${isTermsChecked
                                                ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] shadow-lg shadow-blue-600/20 cursor-pointer"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <span>Tạo Ví</span>
                                            <FaArrowRight className={`transition-transform duration-300 ${isTermsChecked ? 'translate-x-1' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="setPin"
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
                                className="lg:col-span-7 p-10 md:p-16 bg-white/95 backdrop-blur-2xl flex flex-col justify-center h-full"
                            >
                                <div className="max-w-2xl mx-auto w-full">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-bold text-slate-900 mb-2">
                                            {isCheckWallet ? 'Nhập mã PIN' : 'Thiết lập mã PIN'}
                                        </h3>
                                        <p className="text-slate-500 text-base">Nhập mã PIN 6 chữ số để bảo vệ giao dịch của bạn.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">Mã PIN</label>
                                            <div className="relative">
                                                <input
                                                    type={showPin ? "text" : "password"}
                                                    autoFocus
                                                    maxLength={6}
                                                    value={pin}
                                                    onChange={handlePinChange}
                                                    placeholder="••••••"
                                                    className="w-full p-6 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors border border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-xl tracking-widest"
                                                />
                                                <div
                                                    className="absolute top-8 right-5 cursor-pointer"
                                                    onClick={() => setShowPin((prev) => !prev)}
                                                >
                                                    {showPin ? <FaEyeSlash /> : <FaEye />}
                                                </div>
                                            </div>
                                        </div>

                                        {!isCheckWallet && (
                                            <div>
                                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 block">Xác nhận mã PIN</label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPin ? "text" : "password"}
                                                        maxLength={6}
                                                        value={confirmPin}
                                                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleCreatePinCode()}
                                                        placeholder="••••••"
                                                        className="w-full p-6 rounded-2xl bg-slate-50 hover:bg-blue-50/50 transition-colors border border-transparent focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-xl tracking-widest"
                                                    />
                                                    <div
                                                        className="absolute top-8 right-5 cursor-pointer"
                                                        onClick={() => setShowConfirmPin((prev) => !prev)}
                                                    >
                                                        {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
                                                    </div>
                                                </div>

                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleCreatePinCode}
                                            onKeyDown={(e) => e.key === 'Enter' && handleCreatePinCode()}
                                            className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform duration-300 bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.01] shadow-lg shadow-blue-600/20 cursor-pointer`}
                                        >
                                            <span>Xác nhận PIN</span>
                                            <FaArrowRight className="translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main >
            <section className="w-full py-24 relative z-10 border-t border-white/10 backdrop-blur-sm bg-slate-900/30">
                <div className="container mx-auto px-4 relative">

                    <div className="text-center mb-20">
                        <span className="text-blue-300 font-bold text-sm tracking-[0.2em] uppercase border border-blue-400/30 px-6 py-2 rounded-full backdrop-blur-sm bg-blue-900/30">
                            Professional Ecosystem
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-4">
                            Giao diện Dashboard tối ưu
                        </h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Công cụ phân tích kỹ thuật mạnh mẽ tích hợp trực tiếp trên trình duyệt của bạn.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                        <div className="lg:w-1/4 space-y-16 text-center lg:text-right">
                            <div className="group cursor-default">
                                <div className="inline-flex lg:ml-auto mb-4 p-4 rounded-2xl bg-white/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 backdrop-blur-md">
                                    <FiActivity />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Real-time Data</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Dữ liệu thị trường cập nhật từng mili-giây thông qua WebSocket.
                                </p>
                            </div>
                            <div className="group cursor-default">
                                <div className="inline-flex lg:ml-auto mb-4 p-4 rounded-2xl bg-white/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 backdrop-blur-md">
                                    <FaChartBar />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Biểu đồ Pro</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Hơn 100+ chỉ báo kỹ thuật hỗ trợ phân tích xu hướng chính xác.
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-2/4 relative flex justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                            <div className="relative w-full max-w-[700px] group hover:scale-[1.02] transition-transform duration-500">
                                <div className="bg-slate-800 rounded-t-2xl p-3 pb-0 shadow-2xl border border-slate-700 border-b-0 ring-1 ring-white/10">
                                    <div className="h-1.5 w-1.5 bg-slate-600 rounded-full mx-auto mb-3"></div>
                                    <div className="bg-slate-900 w-full aspect-video rounded-t-lg overflow-hidden flex flex-col border border-slate-700/50">
                                        <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="flex gap-4 text-slate-400">
                                                <FaSearch />
                                                <FaBell />
                                            </div>
                                        </div>

                                        <div className="flex-1 p-4 flex gap-4">
                                            <div className="w-16 hidden sm:flex flex-col gap-3">
                                                {[1, 2, 3].map(i => <div key={i} className="h-10 w-full bg-slate-800 rounded-lg animate-pulse"></div>)}
                                            </div>
                                            <div className="flex-1 flex flex-col gap-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-800 rounded-lg border border-slate-700/50"></div>)}
                                                </div>
                                                <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700/50 relative overflow-hidden">
                                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-blue-500/20 to-transparent"></div>
                                                    <svg viewBox="0 0 100 40" className="w-full h-full absolute bottom-0 left-0 stroke-blue-500 fill-none stroke-[0.5]">
                                                        <path d="M0 30 Q 15 20, 30 25 T 60 10 T 100 20" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-auto w-32 h-8 bg-slate-700 rounded-b-lg shadow-lg relative z-[-1]"></div>
                            </div>
                        </div>

                        <div className="lg:w-1/4 space-y-16 text-center lg:text-left">
                            <div className="group cursor-default">
                                <div className="inline-flex mb-4 p-4 rounded-2xl bg-white/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 backdrop-blur-md">
                                    <FaLock />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Bảo mật 2FA</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Xác thực hai yếu tố (2FA) đảm bảo chỉ bạn mới có quyền truy cập.
                                </p>
                            </div>
                            <div className="group cursor-default">
                                <div className="inline-flex mb-4 p-4 rounded-2xl bg-white/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 backdrop-blur-md">
                                    <FaChartPie />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Quản lý Vốn</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Theo dõi PnL và phân bổ tài sản trực quan trên một màn hình duy nhất.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div >
    );
};

export default Wallet;