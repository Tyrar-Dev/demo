'use client';
import Image from "next/image";
import { motion } from "framer-motion";
import { InputOTPPattern } from "../shared/otp/input-otp-pattern";
import { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { decryptEmail } from "@/utils/cryptoEmail";
import Cookies from "js-cookie";

const Active = () => {
    const router = useRouter();

    const [otpValue, setOtpValue] = useState<string>("");
    const [countdown, setCountdown] = useState(60);
    const SECRET = process.env.NEXT_PUBLIC_SECRET_KEY;

    useEffect(() => {
        if (otpValue.length === 6) {
            handleVerify();
        }
    }, [otpValue]);

    const handleVerify = async () => {
        const result = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/AccountVerification`, {
            code: otpValue,
        });
        console.log(result);
        if (result.data.status === 200) {
            toast.success(`${result.data.message}`);
            router.push("/auth/signin");
        } else {
            toast.error(`${result.data.message}`);
        }
    }

    const handleSendPass = async () => {
        if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
            console.error("Secret key is missing!");
            toast.error("Lỗi hệ thống, không thể gửi OTP!");
            return;
        }
        const encryptedEmail = Cookies.get("resendEmail");
        if (!encryptedEmail) {
            toast.error("Không tìm thấy email đã lưu!");
            return;
        }
        try {
            const decryptedEmail = decryptEmail(encryptedEmail);

            if (!decryptedEmail) {
                toast.error("Không tìm thấy email đã lưu!");
                return;
            }
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/ForgotPassword`, { identifier: decryptedEmail });

            if (res.status === 200) {
                toast.success("Đã gửi lại mã OTP.");
                setCountdown(60);
            }
        } catch (err) {
            console.log(err);
            toast.error("Gửi OTP thất bại!");
        }
    };


    useEffect(() => {
        if (countdown === 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div>
            <div className="relative w-full h-screen max-h-full py-5 flex">
                <Image
                    loading="lazy"
                    src="/assets/images/home/bg.jpg"
                    alt="Demo"
                    fill
                    className="object-cover"
                />
                <div className="relative z-10 flex items-center w-full h-full">
                    <div className="w-[50%] px-20">
                        <div className="text-white">
                            Chào mừng đến với autobot <br />
                            (Tự sửa ảnh với nội dung chỗ này đi mẹ)<br />
                            sáng tạo một tí, có nút quay về trang chủ ở đây<br />
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}

                        transition={{ duration: 0.4 }}
                        className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                    >
                        <div>
                            <div className="py-12 pl-5 pr-10">
                                <div className="text-2xl font-semibold">Kích hoạt tài khoản</div>
                                <div className="mt-5 space-y-4">
                                    <div className="text-xs">Mã xác thực đã được gửi qua địa chỉ Email bạn cung cấp trước đó, vui lòng đợi trong ít phút.</div>
                                    <div>
                                        <label className="text-xs">Mã xác thực</label>
                                        <div className="mt-1">
                                            <InputOTPPattern value={otpValue} onChange={setOtpValue} />
                                        </div>
                                        <div className="mt-3 text-xs text-center"> Mã bạn đã nhập: <span className="font-semibold">{otpValue}</span></div>
                                        <div className="text-center">
                                            <div className="mt-5 text-xs">Bạn không nhận được mã xác nhận?</div>
                                            <div onClick={handleSendPass}
                                                className={`text-sm font-semibold cursor-pointer ${countdown === 0
                                                    ? "text-blue-500"
                                                    : "text-black pointer-events-none"
                                                    }`}
                                            >
                                                Gửi lại mã
                                            </div>

                                            {countdown > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Bạn có thể gửi lại sau {countdown}s
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-20 w-full h-px bg-gray-500"></div>
                                    <div onClick={() => router.push('/auth/signin')} className="text-xs font-medium flex gap-1 items-center hover:underline cursor-pointer">
                                        <MdKeyboardBackspace />
                                        <div>Trở về trang trước</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Active;