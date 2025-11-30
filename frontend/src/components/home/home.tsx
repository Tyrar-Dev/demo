'use client';
import Image from "next/image";
import React, { useEffect } from "react";
import { FaBolt, FaCheck, FaClock, FaHeadset } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoSettingsSharp } from "react-icons/io5";
import { GiClick } from "react-icons/gi";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { HiSignal } from "react-icons/hi2";
import { IoIosWarning } from "react-icons/io";

const Home = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="bg-[#f5f5f5] mt-3">
            <div className="relative ">
                <Image
                    width={1000}
                    height={1000}
                    alt="Baner"
                    src={"/assets/images/home/bg.jpg"}
                    className="w-full h-[650px] object-cover" />
            </div>
            <div className="absolute top-23 left-0 w-full h-[650px] bg-black/60 pointer-events-none"></div>

            <div className="absolute top-60 mx-20 z-50">
                <div>
                    <div className="text-white text-[2.2rem] font-bold">Công nghệ đọc lệnh - Thị trường phản hồi</div>
                    <div className="flex flex-col gap-3">
                        <div className="text-white text-[1.2rem]">Đăng kí với 3 bước đơn giản</div>
                        <div className="text-white flex gap-3"><FaCheck />Tiến hành đăng ký</div>
                        <div className="text-white flex gap-3"><FaCheck />Xác thực OTP</div>
                        <div className="text-white flex gap-3"><FaCheck />Kích hoạt tài khoản</div>
                    </div>

                </div>

                <button className="slice mt-3">
                    <span className="text">Đăng ký</span>
                </button>
            </div>

            <div>
                <div className="text-center text-[40px] font-semibold mt-14 mb-10">Lý do bạn nên chọn chúng tôi</div>
                <div className="grid grid-cols-4 gap-32 text-center px-[100px]">
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#FBABB2] flex justify-center items-center">
                            <IoSettingsSharp className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem ] text-center">Tối ưu</p>
                        <p className="text-center text-[0.8rem]">Thuật toán được thiết kế dựa trên hành vi thị trường Việt Nam, tăng độ chính xác khi ra lệnh.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#99E1D4] flex justify-center items-center ">
                            <GiClick className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Đơn giản</p>
                        <p className="text-center text-[0.8rem]">Người dùng chỉ cần vài bước để kích hoạt bot và chọn chiến lược.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#FEF0AF] flex justify-center items-center  ">
                            <FaHeadset className="text-[1.6rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Hỗ trợ kỹ thuật</p>
                        <p className="text-center text-[0.8rem]">Đội ngũ bảo trì giúp theo dõi bot, xử lý lỗi, cập nhật để phù hợp với biến động thị trường.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="800">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#DCEEEA] flex justify-center items-center  ">
                            <AiFillSafetyCertificate className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">An toàn - Minh bạch</p>
                        <p className="text-center text-[0.8rem]">Bot hoạt động dựa trên API chính thống, bảo mật dữ liệu và không thu thập thông tin đặt lệnh của khách hàng.</p>
                    </div>

                </div>
            </div>


            <div>
                <div className="text-center text-[40px] font-semibold mt-14 mb-10">Tính năng của hệ thống</div>
                <div className="grid grid-cols-4 gap-32 text-center px-[100px]">
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1000">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#FBABB2] flex justify-center items-center  ">
                            <HiSignal className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Tự động đặt lệnh theo tính hiệu</p>
                        <p className="text-center text-[0.8rem]">Bot phân tích MA, RSI, MACD, Volume… và tự đặt lệnh Mua/Bán chuẩn xác, giảm cảm xúc và độ trễ của người dùng.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#99E1D4] flex justify-center items-center  ">
                            <IoIosWarning className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Quản lý rủi ro thông minh</p>
                        <p className="text-center text-[0.8rem]">Tự động áp dụng stop-loss, take-profit, trailing stop và tỷ lệ vào lệnh theo vốn để bảo vệ tài khoản.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1400">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#FEF0AF] flex justify-center items-center  ">
                            <FaClock className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Theo dõi thị trường thời gian thực</p>
                        <p className="text-center text-[0.8rem]">Liên tục cập nhật giá, khối lượng và biến động mạnh, từ đó ra quyết định giao dịch trong mili-giây.</p>
                    </div>
                    <div className="flex flex-col items-center" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1600">
                        <div className="w-[50px] h-[50px] rounded-[100%] border-[5px] border-[#DCEEEA] flex justify-center items-center  ">
                            <FaBolt className="text-[1.8rem]" />
                        </div>
                        <p className="font-semibold text-[1.2rem] text-center">Tối ưu chiến lược tự động</p>
                        <p className="text-center text-[0.8rem]">Backtest dữ liệu, tinh chỉnh thông số và gợi ý chiến lược tối ưu để nâng cao hiệu suất giao dịch lâu dài.</p>
                    </div>
                </div>
            </div>

            <div>
                <div className="text-center text-[40px] font-semibold mt-14 mb-10">Bảng giá dịch vụ</div>
            </div>
        </div >
    )
}

export default Home;