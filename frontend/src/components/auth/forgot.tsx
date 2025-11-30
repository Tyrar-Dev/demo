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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { generateKey } from "crypto";
import { decryptEmail, encryptEmail } from "@/utils/cryptoEmail";
import { maskEmail } from "../shared/maskemail/mask-email";
import { isEmailValid, isPasswordValid, isPhoneNumberValid, isUserNameValid } from "../shared/validator/checkform";


const Forgot = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [continueStep, setContinueStep] = useState<boolean>(false);
    const [changeStep, setChangeStep] = useState<boolean>(false);
    const [otpValue, setOtpValue] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [hasUpperLower, setHasUpperLower] = useState<boolean>(false);
    const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errConfirmPassword, setErrConfirmPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [identifier, setIdentifier] = useState<string>('');

    const isPasswordMatch = (confirmPassword: string) => confirmPassword === password;

    const [countdown, setCountdown] = useState(60);

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (!value) {
            setIsLengthValid(false);
            setHasUpperLower(false);
            setHasNumberOrSymbol(false);
            return;
        }
        setIsLengthValid(value.length >= 8);
        setHasUpperLower(/[a-z]/.test(value) && /[A-Z]/.test(value));
        setHasNumberOrSymbol(/[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value));
    };

    const handleCheckIdentifier = async () => {
        if (!identifier) {
            toast.error("Email, SĐT hoặc Tên đăng nhập không được để trống");
            return;
        }

        if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
            console.error("Secret key is missing!");
            toast.error("Lỗi hệ thống, không thể tiếp tục.");
            return;
        }

        if (!isEmailValid(identifier) && !isPhoneNumberValid(identifier) && !isUserNameValid(identifier)) {
            toast.error("Vui lòng nhập đúng Email, SĐT hoặc Tên đăng nhập hợp lệ");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_URL_API}Authen/ForgotPassword`,
                { identifier: identifier }
            );
            const userEmail = res.data.data.email;
            if (!userEmail) {
                toast.error("Lỗi: Máy chủ không trả về email.");
                return;
            }
            const encryptedEmail = await encryptEmail(userEmail);
            if (encryptedEmail) {
                Cookies.set("userEmail", encryptedEmail, { expires: 1 });
            }
            setContinueStep(true);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Email, SĐT hoặc Tên đăng nhập không tồn tại");
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/VerifyResetOtp`, { otp: otpValue });
            if (res.data) {
                setUserId(res.data.message);
            }
            setChangeStep(true);
        } catch (err) {
            toast.error('Mã OTP không đúng, vui lòng thử lại.');
        }
    }

    useEffect(() => {
        if (otpValue.length === 6) {
            handleVerifyOTP();
        }
    }, [otpValue]);

    const handleChange = async () => {
        if (!userId) {
            toast.error('Tài khoản không tồn tại.');
            return;
        }

        if (!password || !confirmPassword) {
            !password && toast.error('Mật khẩu không được để trống');
            !confirmPassword && toast.error('Mật khẩu xác nhận không dược để trống');
            return;
        }

        const isPassValid = isPasswordValid(password);
        const isMatchValid = isPasswordMatch(confirmPassword);

        if (!isPassValid) {
            toast.error('Mật khẩu không hợp lệ');
        }

        if (!isMatchValid) {
            toast.error('Mật khẩu không khớp.');
        }

        await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/UpdatePassAfterOtp`, {
            id: userId,
            newPassword: password,
            confirmPassword: confirmPassword
        }).then(res => {
            const result = res.data;
            result.status === 200
                ? (toast.success('Đổi mật khẩu thành công!'), router.push('/auth/signin'))
                : result.message === 'Mật khẩu không được để trống !'
                    ? toast.error('Mật khẩu không được để trống !')
                    : result.message === 'Xác nhận mật khẩu sai !'
                        ? toast.error('Xác nhận mật khẩu sai !')
                        : toast.error('Không có user nào được tìm thấy!');
        }).catch(err => {
            console.log(err.response?.data);
        })
    }

    const handleSendPass = async () => {
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
                    {!continueStep ? (
                        <motion.div
                            key={'key1'}
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -80 }}
                            transition={{ duration: 0.4 }}
                            className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                        >
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleCheckIdentifier();
                            }}>
                                <div>
                                    <div className="py-12 pl-5 pr-10">
                                        <TfiEmail className="text-4xl text-gray-400" />
                                        <div className="mt-4 text-2xl font-semibold">Xác minh danh tính của bạn</div>
                                        <div className="mt-2 space-y-4">
                                            <div className="text-sm">Chúng tôi sẽ gửi mã xác thực đến Email hoặc SĐT liên kết với tài khoản của bạn.</div>
                                            <div className="mt-10">
                                                <label className="text-xs">Email, SĐT hoặc Tên đăng nhập</label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={identifier}
                                                        autoFocus
                                                        onChange={(e) => {
                                                            setIdentifier(e.target.value);
                                                        }}
                                                        placeholder="Email, SĐT hoặc Tên đăng nhập"
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${!identifier
                                                            ? "border-gray-500 focus:border-blue-500"
                                                            : (isEmailValid(identifier) || isPhoneNumberValid(identifier) || isUserNameValid(identifier))
                                                                ? "border-green-400 focus:border-green-500"
                                                                : "border-red-400 focus:border-red-500"
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full mt-8 py-1.5 px-3 font-semibold rounded-sm text-center text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-all duration-300">
                                                Tiếp tục
                                            </button>
                                            <div className="mt-20 w-full h-px bg-gray-500"></div>
                                            <div onClick={() => router.push('/auth/signin')} className="text-xs font-medium flex gap-1 items-center hover:underline cursor-pointer">
                                                <MdKeyboardBackspace />
                                                <div onClick={() => router.back()}>Trở về trang trước</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        !changeStep ? (
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
                                            <div className="text-sm">Nhập mã chúng tôi vừa gửi đến Email:</div>
                                            <div className="mt-10 font-semibold">{maskEmail(email)}</div>
                                            <div>
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
                                            <div onClick={() => router.push('/auth/fotgot')} className="text-xs font-medium flex gap-1 items-center hover:underline cursor-pointer">
                                                <MdKeyboardBackspace />
                                                <div onClick={() => router.back()}>Trở về trang trước</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={'key3'}
                                initial={{ opacity: 0, x: 80 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -80 }}
                                transition={{ duration: 0.4 }}
                                className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                            >
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleChange();
                                }}>
                                    <div>
                                        <div className="py-12 pl-5 pr-10">
                                            <TfiEmail className="text-4xl text-gray-400" />
                                            <div className="mt-5 text-2xl font-semibold">Đổi mật khẩu</div>
                                            <div className="mt-2 space-y-4">
                                                <div className="text-sm">Nhập mật khẩu mới mà bạn muốn đổi</div>
                                                <div>
                                                    <label className="text-xs">Mật khẩu</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            value={password}
                                                            autoFocus
                                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                                            placeholder="Mật khẩu"
                                                            className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${errPassword
                                                                ? "border-red-400 focus:border-red-500"
                                                                : !password
                                                                    ? "border-gray-400 focus:border-blue-500"
                                                                    : isPasswordValid(password)
                                                                        ? "border-green-400 focus:border-green-500"
                                                                        : "border-red-400 focus:border-red-500"
                                                                }`}
                                                        />
                                                        <div
                                                            className="absolute top-4 right-3 cursor-pointer"
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                    {password.length > 0 && (
                                                        <div className="mt-5 text-xs">
                                                            <div className="font-semibold">Tạo mật khẩu phải:</div>
                                                            <div className="mt-3 font-medium space-y-1.5">
                                                                <div className="flex gap-2 items-center">
                                                                    {isLengthValid ? <IoCheckmark className="text-green-500" /> : <IoClose className="text-red-500" />}
                                                                    <div className={`${isLengthValid ? 'text-green-500' : 'text-red-500'}`}>chứa ít nhất 8 ký tự</div>
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    {hasUpperLower ? <IoCheckmark className="text-green-500" /> : <IoClose className="text-red-500" />}
                                                                    <div className={`${hasUpperLower ? 'text-green-500' : 'text-red-500'}`}>chứa cả chữ thường (a-z) và chữ in hoa (A-Z)</div>
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    {hasNumberOrSymbol ? <IoCheckmark className="text-green-500" /> : <IoClose className="text-red-500" />}
                                                                    <div className={`${hasNumberOrSymbol ? 'text-green-500' : 'text-red-500'}`}>chứa ít nhất một số (0-9) hoặc một ký hiệu</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-xs">Xác nhận mật khẩu</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            placeholder="Xác nhận mật khẩu"
                                                            className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${errConfirmPassword
                                                                ? "border-red-400 focus:border-red-500"
                                                                : !confirmPassword
                                                                    ? "border-gray-400 focus:border-blue-500"
                                                                    : isPasswordMatch(confirmPassword)
                                                                        ? "border-green-400 focus:border-green-500"
                                                                        : "border-red-400 focus:border-red-500"
                                                                }`}
                                                        />
                                                        <div
                                                            className="absolute top-4 right-3 cursor-pointer"
                                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                        >
                                                            {confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                    {confirmPassword.length > 0 && (
                                                        <div className="mt-5 text-xs">
                                                            <div className="font-semibold">Tạo mật khẩu phải:</div>
                                                            <div className="mt-3 font-medium space-y-1.5">
                                                                <div className="flex gap-2 items-center">
                                                                    {isPasswordMatch(confirmPassword) ? <IoCheckmark className="text-green-500" /> : <IoClose className="text-red-500" />}
                                                                    <div className={`${isPasswordMatch(confirmPassword) ? 'text-green-500' : 'text-red-500'}`}>trùng với mật khẩu</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <button type="submit" className="w-full mt-8 py-1.5 px-3 font-semibold rounded-sm text-center text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-all duration-300">
                                                    Đổi mật khẩu
                                                </button>
                                                <div className="mt-20 w-full h-px bg-gray-500"></div>
                                                <div onClick={() => router.push('/auth/forgot')} className="text-xs font-medium flex gap-1 items-center hover:underline cursor-pointer">
                                                    <MdKeyboardBackspace />
                                                    <div onClick={() => router.back()}>Trở về trang trước</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}


export default Forgot;