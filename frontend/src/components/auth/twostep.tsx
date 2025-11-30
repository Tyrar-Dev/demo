'use client';
import { MdKeyboardBackspace } from "react-icons/md";
import { InputOTPPattern } from "../shared/otp/input-otp-pattern";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TfiEmail } from "react-icons/tfi";
import axios from "axios";
import { toast } from "sonner";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { decryptEmail } from "@/utils/cryptoEmail";
import { maskEmail } from "../shared/maskemail/mask-email";
import { getDeviceFingerprint } from "@/utils/getDeviceFingerprint";

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

const TwoStep = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const fingerprint = getDeviceFingerprint();
    const [email, setEmail] = useState<string>('');
    const [emailUser, setEmailUser] = useState<any>('');
    const [infoUser, setInfoUser] = useState<any>('');
    const [changeStep, setChangeStep] = useState<boolean>(false);
    const [otpValue, setOtpValue] = useState<string>("");
    const [countdown, setCountdown] = useState<number>(60);

    useEffect(() => {
        handleChangeEmailByIdentifier();
    }, []);

    const handleVerifyOTP = async () => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/VerifyTwoStep`,
            {
                otp: otpValue,
                fingerprint
            });
        try {
            if (res.data.data) {
                const { accessToken, refreshToken } = res.data.data;
                const decoded: CustomJwtPayload = jwtDecode(accessToken);
                dispatch(setUser({
                    accessToken,
                    refreshToken,
                    userInfo: decoded
                }));
                router.push(decoded.role === "User" ? "/" : "/admin/dashboard");
                return;
            }
            setChangeStep(true);
        } catch (err) {
            toast.error('Mã OTP không đúng, vui lòng thử lại.');
        }
    }

    const handleChangeEmailByIdentifier = async () => {
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
        const decryptedEmail = decryptEmail(encryptedEmail);
        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetEmailByIdentifier`, {
            identifier: decryptedEmail
        }).then(res => {
            setEmailUser(res.data.data.email);
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        if (otpValue.length === 6) {
            handleVerifyOTP();
        }
    }, [otpValue]);

    const handleSendCode = async () => {
        if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
            console.error("Secret key is missing!");
            toast.error("Lỗi hệ thống, không thể gửi OTP!");
            return;
        }

        try {
            const encryptedEmail = Cookies.get("resendEmail");
            if (!encryptedEmail) {
                toast.error("Không tìm thấy email đã lưu!");
                return;
            }
            const decryptedEmail = await decryptEmail(encryptedEmail);

            if (!decryptedEmail) {
                toast.error("Không tìm thấy email đã lưu!");
                return;
            }
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/ResendOtpForTwoStep`, { identifier: decryptedEmail });

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
                        key={'key2'}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.4 }}
                        className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                    >
                        <div>
                            <div className="py-12 pl-5 pr-10">
                                <TfiEmail className="text-4xl text-gray-400" />
                                <div className="mt-5 text-2xl font-semibold">Xác minh danh tính của bạn</div>
                                <div className="mt-2 space-y-4">
                                    <div className="text-sm">Nhập mã chúng tôi vừa gửi đến</div>
                                    <div className="mt-10 font-semibold">{
                                        emailUser ? maskEmail(emailUser) : infoUser ? maskEmail(infoUser.email) : email}</div>
                                    <div>
                                        <div className="mt-1">
                                            <InputOTPPattern value={otpValue} onChange={setOtpValue} />
                                        </div>
                                        <div className="mt-3 text-xs text-center"> Mã bạn đã nhập: <span className="font-semibold">{otpValue}</span></div>
                                        <div className="text-center">
                                            <div className="mt-5 text-xs">Bạn không nhận được mã xác nhận?</div>
                                            <div onClick={handleSendCode}
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
                                        <div onClick={() => router.back()}>Trở về trang trước</div>
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


export default TwoStep;