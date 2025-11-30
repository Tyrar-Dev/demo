'use client';
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaClock, FaFacebook, FaPhoneAlt, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiZalo } from "react-icons/si";

const Footer = () => {
    return (
        <div className="relative z-70 bg-white pt-4">
            <div className="flex items-center px-20 gap-2">
                <Image width={1000}
                    height={500}
                    alt="Logo"
                    src={"/assets/images/logo.png"}
                    className="w-[50px] " />
                <p className="text-[1.3rem] font-bold dark:text-black">TradingBot</p>
            </div>
            <div className="h-px w-full bg-[#ccc] my-4"></div>
            <div className="flex gap-60 pb-4 px-20 ">
                <div className="flex flex-col gap-3">
                    <h1 className="text-[1.2rem] font-bold dark:text-black">Liên hệ</h1>
                    <div className="flex items-center gap-2 dark:text-black">
                        <FaPhoneAlt />  0936793913
                    </div>
                    <div className="flex items-center gap-2 dark:text-black">
                        <MdEmail /> abc.@gmail.com
                    </div>
                    <div className="flex items-center gap-2 dark:text-black">
                        <FaClock /> Thứ 2 - Thứ 7 ( 8:00 - 19:30)

                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-[1.2rem] font-bold dark:text-black">Về chúng tôi</h1>
                    <Link href={"/"} className="dark:text-black">Giới thiệu</Link>
                    <Link href={"/"} className="dark:text-black">Bảng giá dịch vụ</Link>
                    <Link href={"/"} className="dark:text-black">Tải Extension</Link>
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-[1.2rem] font-bold dark:text-black">Tài khoản</h1>
                    <Link href={"/"} className="dark:text-black">Đăng ký</Link>
                    <Link href={"/"} className="dark:text-black">Đăng nhập</Link>
                </div>

                <div className="flex gap-5">
                    <FaFacebook className="text-[2rem] hover:text-blue-400 dark:text-black cursor-pointer transition-all duration-300" />

                    <SiZalo className="text-[2rem] border bg-black text-white rounded-full p-1 hover:bg-blue-400  dark:text-black cursor-pointer transition-all duration-300" />

                    <FaTelegram className="text-[2rem] hover:text-blue-400 dark:text-black cursor-pointer transition-all duration-300" />
                </div>
            </div>
        </div>
    )
}

export default Footer;