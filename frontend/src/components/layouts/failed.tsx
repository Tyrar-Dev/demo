'use client';

import Link from "next/link";
import { Home, RotateCcw, X } from "lucide-react";

const Fail = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">
            
            {/* --- BACKGROUND EFFECTS (Tông màu Đỏ/Cam cho cảm giác cảnh báo) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Blob 1: Đỏ - Tượng trưng cho Lỗi */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
                {/* Blob 2: Cam - Tượng trưng cho Cảnh báo */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-700"></div>
                {/* Blob 3: Hồng/Rose - Tạo độ sâu */}
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="grow flex items-center justify-center z-10 py-20 px-4">
                <div className="text-center max-w-3xl mx-auto">
                    
                    {/* --- ERROR ICON WRAPPER --- */}
                    <div className="mb-10 relative flex justify-center">
                        {/* Vòng tròn phát sáng phía sau */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-red-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        </div>

                        {/* Vòng tròn chứa dấu X */}
                        <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl shadow-red-100 animate-[bounce_3s_infinite]">
                            {/* Viền border mỏng */}
                            <div className="absolute inset-0 rounded-full border-4 border-red-50"></div>
                            
                            {/* Icon X */}
                            <div className="w-20 h-20 bg-linear-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-inner group">
                                <X className="w-10 h-10 text-white stroke-3 group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            {/* Các hạt trang trí bay ra (dùng thẻ div nhỏ) */}
                            <div className="absolute top-0 right-0 w-3 h-3 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                            <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400 rounded-full animate-bounce delay-150"></div>
                            <div className="absolute top-1/2 -left-4 w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* --- TEXT CONTENT --- */}
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-600">
                            Giao dịch thất bại
                        </span>
                    </h2>
                    
                    <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        Rất tiếc, đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn. 
                        <br className="hidden md:block"/>
                        Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút.
                    </p>

                    {/* --- BUTTONS --- */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {/* Nút: Thử lại (Chính) */}
                        <button className="group relative px-8 py-4 bg-red-600 text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2">
                            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                            <span>Thử lại ngay</span>
                        </button>

                        {/* Nút: Về trang chủ (Phụ) */}
                        <Link 
                            href="/" 
                            className="px-8 py-4 bg-white text-gray-600 border-2 border-gray-100 font-bold rounded-full shadow-sm hover:shadow-md hover:border-red-200 hover:text-red-600 transition-all duration-300 flex items-center justify-center gap-2"
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

export default Fail;