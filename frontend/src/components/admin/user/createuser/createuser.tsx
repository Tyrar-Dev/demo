"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion"; // Giữ lại animation để đẹp mắt
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import axios from "axios";
import { differenceInYears } from "date-fns";

const CreateUserForm = ({ isModalOpen, setIsModalOpen, getListUser, currentPage }: { isModalOpen: boolean, currentPage: number, setIsModalOpen: (val: boolean) => void, getListUser: (page: number) => Promise<void> }) => {
    const [userName, setUserName] = useState<string>("");
    const [userNameErr, setUserNameErr] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [emailErr, setEmailErr] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [phoneErr, setPhoneErr] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [day, setDay] = useState<number>(0);
    const [errDay, setErrDay] = useState<boolean>(false);
    const [month, setMonth] = useState<number>(0);
    const [errMonth, setErrMonth] = useState<boolean>(false);
    const [year, setYear] = useState<string>('');
    const [errYear, setErrYear] = useState<boolean>(false);

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

    const validateUserName = (value: string) => {
        const regex = /^[a-zA-Z0-9_]+$/;
        if (!regex.test(value)) {
            toast.error("Tên đăng nhập chỉ chứa chữ, số, gạch dưới");
            setUserNameErr("Tên đăng nhập không hợp lệ");
        } else setUserNameErr("");
    };

    const validateEmail = (value: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            toast.error("Email không hợp lệ");
            setEmailErr("Email không hợp lệ");
        } else setEmailErr("");
    };

    const validatePhone = (value: string) => {
        if (!value.trim()) {
            toast.error("Số điện thoại không được để trống");
            setPhoneErr("Số điện thoại không hợp lệ");
        } else setPhoneErr("");
    };

    const validatePassword = (value: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(value)) {
            toast.error("Mật khẩu phải >= 8 ký tự, có chữ hoa, thường và số");
            setPasswordErr("Mật khẩu yếu");
        } else setPasswordErr("");
    };

    const validateDay = (d: number, m: number, y: number) => {
        if (d <= 0) return;

        if (m <= 0 || !y) return; // chưa chọn tháng/năm thì skip

        const daysInMonth = new Date(y, m, 0).getDate();
        if (d > daysInMonth) {
            toast.error(`Tháng ${m} năm ${y} chỉ có ${daysInMonth} ngày`);
        }
    };

    const validateMonth = (m: number) => {
        if (m <= 0 || m > 12) {
            toast.error("Tháng phải từ 1 đến 12");
        }
    };

    const validateYear = (y: number) => {
        if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) {
            toast.error("Năm sinh không hợp lệ");
        }
    };

    const createUser = async () => {
        const birthDayFormatted = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        try {
            if (day <= 0 || month <= 0 || year.trim() === "") {
                toast.error("Vui lòng nhập đầy đủ ngày sinh hợp lệ");
                return;
            }

            const formData = new FormData();
            formData.append("UserName", userName);
            formData.append("FullName", fullName);
            formData.append("Email", email);
            formData.append("PhoneNumber", phoneNumber);
            formData.append("PassWord", password);
            formData.append("BirthDay", birthDayFormatted);
            formData.append("UrlAvatar", "");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_URL_API}Authen/CreateUser`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                console.log("Đăng ký thành công:", res.data);
                setUserName(""); setFullName(""); setEmail(""); setPhoneNumber("");
                setPassword(""); setBirthday(""); setDay(0); setMonth(0); setYear('');
                setIsModalOpen(false);
                getListUser(currentPage);
            }
        } catch (err: any) {
            console.log("Lỗi:", err.response?.data || err.message);
        }
    }


    return (
        <div>
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/20 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}

                        />

                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="bg-white text-left rounded-xl shadow-lg w-full max-w-lg overflow-hidden">

                                {/* Header */}
                                <div className="flex justify-between items-center p-5 border-b">
                                    <h2 className="text-2xl font-bold">Thêm Người Dùng</h2>
                                    <button onClick={() => setIsModalOpen(false)}>
                                        <MdOutlineClose size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form className="p-6 space-y-4">

                                    <div>
                                        <label className="text-sm font-medium">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={userName}
                                            onChange={(e) => {
                                                setUserName(e.target.value);
                                                validateUserName(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Họ tên</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value)
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                validateEmail(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Số điện thoại</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                validatePhone(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Mật khẩu</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                validatePassword(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Day */}
                                        <div>
                                            <label className="text-sm font-medium">Ngày</label>
                                            <select
                                                value={day}
                                                onChange={(e) => {
                                                    const d = Number(e.target.value);
                                                    setDay(d);
                                                    validateDay(d, month, Number(year));
                                                }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            >
                                                <option value={0}>Ngày</option>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Month */}
                                        <div>
                                            <label className="text-sm font-medium">Tháng</label>
                                            <select
                                                value={month}
                                                onChange={(e) => {
                                                    const m = Number(e.target.value);
                                                    setMonth(m);
                                                    validateMonth(m);
                                                    validateDay(day, m, Number(year));
                                                }}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            >
                                                <option value={0}>Tháng</option>
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Year */}
                                        <div>
                                            <label className="text-sm font-medium">Năm</label>
                                            <input
                                                type="text"
                                                value={year}
                                                onChange={(e) => {
                                                    const y = Number(e.target.value);
                                                    setYear(e.target.value);
                                                    validateYear(y);
                                                    validateDay(day, month, y);
                                                }}
                                                placeholder="Năm"
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                                            />
                                        </div>
                                    </div>


                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-400 rounded-lg"
                                        >
                                            Hủy
                                        </button>

                                        <div
                                            onClick={createUser}
                                            className="px-4 py-2 bg-blue-400 hover:bg-blue-600 text-white rounded-lg"
                                        >
                                            Lưu
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CreateUserForm;