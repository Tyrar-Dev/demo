'use client';

import Link from "next/link";
import Image from "next/image";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden font-sans">
            
            {/* --- BACKGROUND EFFECTS (Hiệu ứng nền bằng Tailwind thuần) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                {/* Các đốm màu blur trôi nhẹ */}
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-grow flex items-center justify-center z-10 py-20 px-4">
                <div className="text-center max-w-3xl mx-auto">
                    
                    {/* Wrapper số 404 */}
                    <div className="relative flex justify-center items-center mb-8 select-none">
                        {/* Số 4 bên trái - Bounce effect */}
                        <span className="text-[8rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 drop-shadow-2xl animate-bounce">
                            4
                        </span>
                        
                        {/* Logo xoay ở giữa */}
                        <div className="mx-2 md:mx-6 relative group">
                            {/* Glow effect sau logo */}
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            
                            {/* Logo chính - Dùng Next/Image */}
                            <Image 
                                src="/assets/images/logo.png" 
                                width={160} 
                                height={160} 
                                alt="0"
                                className="w-[100px] h-[100px] md:w-[160px] md:h-[160px] object-contain drop-shadow-2xl relative z-10 animate-[spin_10s_linear_infinite]"
                            />
                        </div>

                        {/* Số 4 bên phải - Bounce effect */}
                        <span className="text-[8rem] md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-bl from-purple-600 to-blue-600 drop-shadow-2xl animate-bounce delay-100">
                            4
                        </span>
                    </div>

                    {/* Thông báo */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
                        Oops! Lạc mất tín hiệu rồi?
                    </h2>
                    <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị bot dọn dẹp. 
                        <br className="hidden md:block"/>
                        Đừng lo, thị trường vẫn còn đó!
                    </p>

                    {/* Các nút điều hướng */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {/* Nút Home - Dùng Next/Link */}
                        <Link 
                            href="/" 
                            className="group relative px-8 py-4 bg-blue-600 text-white font-bold rounded-full overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                            <Home size={20} />
                            <span>Trở về trang chủ</span>
                        </Link>
                        
                        {/* Nút Report */}
                        <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-100 font-bold rounded-full shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
                           <AlertCircle size={20} /> 
                           <span>Báo cáo lỗi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;