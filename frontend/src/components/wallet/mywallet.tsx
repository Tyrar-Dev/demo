'use client';

import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaHistory,
    FaEye,
    FaEyeSlash,
    FaChartBar,
    FaBell,
    FaMinus
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { formatCurrency } from "../shared/currency/formatCurrency";
import { useRouter } from "next/navigation";
import { formatDateFunc } from "../shared/date/formatDate";
import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from "date-fns";

type ChartPoint = {
    x: string;
    y: number;
    transactionType: string;
    amount: number;
};

const MyWallet = () => {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const accessToken = Cookies.get(`accessToken`);
    const [isVisible, setIsVisible] = useState(true);
    const [user, setUser] = useState<any>('');
    const [wallet, setWallet] = useState<any>('');
    const [transaction, setTransaction] = useState<any[]>([]);

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const currentMonth = format(new Date(), 'MM');

    const currentMonthTransactions = transaction.filter(tx => {
        const txDate = parseISO(tx.timestamp);
        return isWithinInterval(txDate, { start: startOfCurrentMonth, end: endOfCurrentMonth });
    });

    useEffect(() => {
        if (!userInfo?.Id) return;
        if (!accessToken) return;
        handleGetUser();
        handleGetWallet(accessToken);
        handleGetTransaction(accessToken);
    }, [userInfo]);

    const handleGetUser = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`)
            .then(res => {
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            });
    }

    const chartData: ChartPoint[] = currentMonthTransactions
        .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((tx: any) => ({
            x: format(new Date(tx.timestamp), "dd/MM"),
            y: tx.balanceAfter || tx.amount,
            transactionType: tx.transactionType,
            amount: tx.amount
        }));


    const handleGetTransaction = async (accessToken: string) => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}WalletTransaction/GetHistory?userId=${userInfo?.Id}&pageNumber=${1}&pageSize=${10}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        )
            .then(res => {
                setTransaction(res.data.data);
            }).catch(err => {
                console.log(err);
            });
    }

    const handleGetWallet = async (accessToken: string) => {
        if (!accessToken) {
            toast.error('Bạn chưa đăng nhập, vui lòng đăng nhập');
            return;
        }
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Wallet/GetMoneyInWallet?userId=${userInfo?.Id}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            setWallet(res.data.data);
        }).catch(err => {
            console.log(err);
        })
    }


    const width = 1100;
    const height = 180;

    const generateSVGPath = (data: any) => {
        if (data.length === 0) return "";
        const scaleX = width / (data.length - 1);
        const scaleY = (value: any) => height - ((value - minY) / (maxY - minY)) * height;

        let d = `M0,${scaleY(data[0].y)}`;
        data.forEach((point: any, i: number) => {
            const x = i * scaleX;
            const y = scaleY(point.y);
            d += ` L${x},${y}`;
        });
        return d;
    };

    const maxY = Math.max(...chartData.map((d: any) => d.y));
    const minY = Math.min(...chartData.map((d: any) => d.y));

    const pathD = generateSVGPath(chartData);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8 flex justify-center">

            <div className="w-full max-w-6xl space-y-6">

                <div className="flex items-center justify-between pb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Ví Của Tôi</h1>
                        <p className="text-slate-500 text-sm">Quản lý chi tiêu cá nhân</p>
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-colors text-slate-600">
                        <FaBell />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-7 flex flex-col h-full">
                        <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg h-full flex flex-col justify-between min-h-[300px]">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-blue-50 border border-white/10">
                                        <FaWallet /> Tài khoản chính
                                    </div>
                                    <button onClick={() => setIsVisible(!isVisible)} className="text-blue-100 hover:text-white transition-colors opacity-80 hover:opacity-100 cursor-pointer">
                                        {isVisible ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>

                                <div className="mb-10">
                                    <div>
                                        <p className="text-blue-100 text-sm mb-1 font-medium opacity-80">Chủ tài khoản</p>
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                                {user && (
                                                    <div className="text-2xl uppercase font-bold">
                                                        {user.fullName}
                                                    </div>
                                                )}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <p className="text-blue-100 text-sm mb-1 font-medium opacity-80">Số dư khả dụng</p>
                                        <div className="flex gap-2">
                                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                                                {isVisible
                                                    ? "*********"
                                                    : user && wallet ? (
                                                        <div className="text-2xl font-bold">
                                                            {formatCurrency(wallet.balance)}
                                                        </div>
                                                    ) : (
                                                        <div className="text-2xl font-bold text-emerald-600">
                                                            Chưa kích hoạt ví
                                                        </div>
                                                    )}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
                                <button onClick={() => router.push(`/wallet/mywallet/deposit`)} className="flex items-center justify-center gap-2 bg-white text-blue-700 py-3.5 rounded-xl font-bold transition-all hover:bg-blue-50 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer">
                                    <FaArrowDown /> Nạp Tiền
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-blue-800/50 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold backdrop-blur-sm transition-all border border-blue-400/30 active:scale-[0.98] cursor-pointer">
                                    <FaArrowUp /> Rút Tiền
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden min-h-[300px]">
                            <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                    <FaHistory className="text-slate-400" /> Biến động số dư
                                </h3>
                                <button className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Xem tất cả</button>
                            </div>

                            {transaction.length ? (
                                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                                    <div className="space-y-1">
                                        {transaction.map((tx: any) => (
                                            <div key={tx.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
            ${tx.transactionType === 'Tiền nạp' || tx.transactionType === 'Tiền rút' || tx.transactionType === 'Mua bot'
                                                                ? 'bg-green-50 text-green-600'
                                                                : 'bg-slate-50 text-slate-600'
                                                            }`}
                                                    >
                                                        {tx.transactionType === 'Tiền nạp' && <FaArrowUp />}
                                                        {tx.transactionType === 'Tiền rút' && <FaArrowDown />}
                                                        {tx.transactionType === 'Mua bot' && <FaMinus />}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 line-clamp-1">
                                                            {tx.description}
                                                        </p>

                                                        <p className="text-[11px] text-slate-400">
                                                            {formatDateFunc(tx.timestamp)}
                                                        </p>

                                                        {tx.transactionStatus === 'Success' && (
                                                            <p className="text-[11px] text-green-600 font-semibold mt-0.5">
                                                                Thành công
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0 pl-2">
                                                    <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-slate-800'}`}>
                                                        {tx.amount > 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(tx.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-10 flex items-center justify-center">Bạn chưa có giao dịch</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaChartBar className="text-blue-500" /> Biểu đồ chi tiêu
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">Theo dõi biến động số dư trong tháng</p>
                        </div>
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-auto">
                            <button className="px-4 py-1.5 text-xs font-bold text-white bg-white shadow-sm rounded-md">Tuần</button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Tháng {currentMonth}</button>
                        </div>
                    </div>

                    {transaction.length ? (
                        <div className="relative h-56 w-full">
                            <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300">
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                                <div className="border-b border-slate-100 w-full h-0"></div>
                            </div>

                            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" width={width} height={height}>
                                <path
                                    d={pathD}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                {chartData.map((p: any, i: number) => {
                                    const x = (i / (chartData.length - 1)) * width;
                                    const y = height - ((p.y - minY) / (maxY - minY)) * height;

                                    return (
                                        <circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r="5"
                                            fill="#3b82f6"
                                            stroke="white"
                                            strokeWidth="2"
                                            onMouseEnter={() => setHoveredIndex(i)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        />
                                    );
                                })}
                            </svg>

                            {hoveredIndex !== null && (
                                <div
                                    className="absolute w-fit bg-white p-5 rounded-md shadow-lg text-xs text-center font-semibold pointer-events-none"
                                    style={{
                                        left: `${(hoveredIndex / (chartData.length - 1)) * width}px`,
                                        top: `${height - ((chartData[hoveredIndex].y - minY) / (maxY - minY)) * height - 40}px`,
                                        transform: "translateX(-50%)"
                                    }}
                                >
                                    <div>{chartData[hoveredIndex].transactionType}</div>
                                    <div>{chartData[hoveredIndex].amount > 0 ? "+" : ""}{chartData[hoveredIndex].amount}đ</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center">Bạn chưa thực hiện giao dịch giao dịch</div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default MyWallet;