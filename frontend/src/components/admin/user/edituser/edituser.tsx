"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { toast } from "sonner";

const EditUser = ({
    isModalEditOpen,
    setIsModalEditOpen,
    userData,
    onSave
}: {
    isModalEditOpen: boolean,
    setIsModalEditOpen: (v: boolean) => void,
    userData: any,
    onSave?: (data: any) => void
}) => {
    const [userName, setUserName] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [day, setDay] = useState(0);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<string>("");

    useEffect(() => {
        if (!userData) return;
        setUserName(userData.userName || "");
        setFullName(userData.fullName || "");
        setEmail(userData.email || "");
        setPhoneNumber(userData.phoneNumber || "");

        if (userData.birthDay) {
            const date = new Date(userData.birthDay);
            setDay(date.getDate());
            setMonth(date.getMonth() + 1);
            setYear(String(date.getFullYear()));
        }
    }, [userData]);

    const [accessToken, setAccessToken] = useState<string>('');
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();

    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const validateUserData = () => {
        const userNameRegex = /^[a-zA-Z0-9_]+$/;
        const fullNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
        if (!userName.trim()) {
            toast.error("Tên đăng nhập không được để trống!");
            return false;
        }
        if (!userNameRegex.test(userName)) {
            toast.error("Tên đăng nhập không được chứa ký tự đặc biệt!");
            return false;
        }

        if (!fullName.trim()) {
            toast.error("Họ tên không được để trống!");
            return false;
        }
        if (!fullNameRegex.test(fullName)) {
            toast.error("Họ tên không được chứa ký tự đặc biệt hoặc số!");
            return false;
        }
        if (!email.trim()) {
            toast.error("Email không được để trống!");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ!");
            return false;
        }

        if (!phoneNumber.trim()) {
            toast.error("Số điện thoại không được để trống!");
            return false;
        }

        if (day <= 0 || month <= 0 || !year) {
            toast.error("Ngày sinh không hợp lệ!");
            return false;
        }
        const yearNum = Number(year);
        if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
            toast.error("Năm sinh không hợp lệ!");
            return false;
        }

        return true;
    };


    const handleUpdateUser = async () => {
        if (!validateUserData()) return;

        if (!userData?.id) {
            console.log("Không tìm thấy ID người dùng!");
            return;
        }

        const birthDay = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/UpdateUserInfo`, {
                id: userData?.id,
                userName,
                fullName,
                phoneNumber,
                birthDay
            },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            toast.success("Cập nhật thành công");
            setIsModalEditOpen(false);
            if (onSave) onSave(res.data); // Đóng modal sau khi update thành công
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <AnimatePresence>
            {isModalEditOpen && (
                <>
                    {/* Background */}
                    <motion.div
                        className="fixed inset-0 bg-black/20 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <div className="bg-white text-left rounded-xl shadow-lg w-full max-w-lg overflow-hidden">

                            {/* Header */}
                            <div className="flex justify-between items-center p-5 border-b">
                                <h2 className="text-2xl font-bold">Sửa Thông Tin</h2>
                                <button onClick={() => setIsModalEditOpen(false)}>
                                    <MdOutlineClose size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form className="p-6 space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault(); // Ngăn reload trang
                                    handleUpdateUser(); // Gọi hàm lưu
                                }}>
                                {/* Tên đăng nhập */}
                                <div>
                                    <label className="text-sm font-medium">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Họ tên */}
                                <div>
                                    <label className="text-sm font-medium">Họ tên</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="text-sm font-medium">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                    />
                                </div>

                                {/* Ngày sinh */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="text-sm font-medium">Ngày</label>
                                        <select
                                            value={day}
                                            onChange={(e) => setDay(Number(e.target.value))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        >
                                            <option value={0}>Ngày</option>
                                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Tháng</label>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(Number(e.target.value))}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        >
                                            <option value={0}>Tháng</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Năm</label>
                                        <input
                                            type="text"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            placeholder="Năm"
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalEditOpen(false)}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-400 rounded-lg"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit" // <-- Thay div thành nút submit
                                        className="px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded-lg cursor-pointer"
                                    >
                                        Lưu
                                    </button>

                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence >

    );
};

export default EditUser;
