'use client';

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import GoogleLoginButton from "./googlelogin";
import CryptoJS from "crypto-js";
import { encryptEmail } from "@/utils/cryptoEmail";
import { getDeviceFingerprint } from "@/utils/getDeviceFingerprint";
import { isEmailValid, isPasswordValid, isPhoneNumberValid, isUserNameValid } from "../shared/validator/checkform";

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

const Signin = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const fingerprint = getDeviceFingerprint();
    const [email, setEmail] = useState<string>('');
    const [errEmail, setErrEmail] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [agree, setAgree] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [errPhoneNumber, setErrPhoneNumber] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [errUserName, setErroUserName] = useState<boolean>(false);
    const [showRegion, setShowRegion] = useState<boolean>(false);


    useEffect(() => {
        if (/^[0-9]/.test(email)) {
            setShowRegion(true);
        } else if (/^[a-zA-Z]/.test(email)) {
            setShowRegion(false);
        } else if (email === "") {
            setShowRegion(false);
            setShowPassword(false);
        }
    }, [email]);

    const handleLogin = async () => {
        let hasError = false;

        !email
            ? (toast.error('Vui lòng nhập địa chỉ email hoặc số điện thoại'),
                setErrEmail(true),
                hasError = true)
            : isEmailValid(email)
                ? (setErrEmail(false),
                    setUserName(email),
                    setErroUserName(false),
                    setErrPhoneNumber(false))
                : isPhoneNumberValid(email)
                    ? (setPhoneNumber(email),
                        setErrEmail(false),
                        setErrPhoneNumber(false),
                        setErroUserName(false))
                    : isUserNameValid(email)
                        ? (setUserName(email),
                            setErroUserName(false),
                            setErrEmail(false),
                            setErrPhoneNumber(false))
                        : (toast.error('Địa chỉ email, số điện thoại hoặc tên đăng nhập không hợp lệ.'),
                            setErrEmail(true),
                            hasError = true);


        !password
            ? (toast.error('Vui lòng nhập mật khẩu'), setErrPassword(true), hasError = true)
            : !isPasswordValid(password)
                ? (toast.error('Mật khẩu phải có ít nhất 8 ký tự.'), setErrPassword(true), hasError = true)
                : setErrPassword(false);

        !agree && (toast.error('Vui lòng xác nhận đủ 18 tuổi và đồng ý điều khoản.'), hasError = true);

        if (hasError) return;
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/UserLogin`, {
                loginIdentifier: email,
                passWord: password,
                fingerprint
            });
            const result = res.data;
            if (result.status === 200) {
                const { accessToken, refreshToken } = result.data;
                const decoded: CustomJwtPayload = jwtDecode(accessToken);
                dispatch(setUser({
                    accessToken,
                    refreshToken,
                    userInfo: decoded
                }));

                let guestId = localStorage.getItem("guestId");
                if (!guestId) return;
                if (accessToken) {
                    handleSyncChat(guestId, accessToken);
                }

                decoded.role === "User" ? router.push("/") : router.push("/admin/dashboard");
            } else if (result.status === 401) {
                router.push(`/auth/active`);
            } else if (result.status === 412) {
                const encryptedEmail = encryptEmail(email);
                if (encryptedEmail) {
                    Cookies.set("resendEmail", encryptedEmail, { expires: 7 });
                }
                router.push(`/auth/twostep`);
            } else {
                toast.error("Đăng nhập thất bại.");
            }
        } catch (err) {
            console.log(err);
            toast.error('Tài khoản hoặc mật khẩu sai, vui lòng thử lại');
        }
    }

    const handleSyncChat = async (guestId: string, accessToken: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Chat/SyncChat`, {
                guestId,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
                console.log(res.data);
            })
        } catch (err) {
            console.log("SyncChat error:", err);
        }
    };

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
                        <div className="w-[100px] h-10 border flex items-center justify-center rounded-[30px]">
                            <Link className="text-white" href={"/"}>Trang chủ</Link>
                        </div>
                        <div className="text-white text-[2rem]">
                            Chào mừng bạn đến với AutoBot
                        </div>
                        <div className="text-white">
                            “Chứng khoán tự động, lợi nhuận chủ động”
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.4 }}
                        className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}>
                            <div>
                                <div className="py-12 pl-5 pr-10">
                                    <div className="text-2xl font-semibold">Đăng nhập</div>
                                    <div className="mt-5 space-y-4">
                                        <div>
                                            <label className="text-xs">Địa chỉ email, username hoặc số điện thoại</label>
                                            {showRegion ? (
                                                <div className="absolute top-[230px] right-[33%] flex items-center">
                                                    <div className="flex items-center justify-center gap-2 py-1.5 mt-1.5 px-5">
                                                        <Image
                                                            src={`/assets/images/signup/flagvn.webp`}
                                                            width={500}
                                                            height={500}
                                                            alt="Vietnam"
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <div className="text-[.8rem]">+84</div>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div></div>
                                            )}
                                            <div>
                                                <input
                                                    type="text"
                                                    value={email}
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (errEmail) setErrEmail(false);
                                                    }}
                                                    placeholder="Địa chỉ email, username hoặc số điện thoại"
                                                    className={`w-full mt-1 ${showRegion ? 'pl-17' : ''} py-2 px-3 text-sm border rounded-sm outline-none transition-all
  ${errEmail || errPhoneNumber
                                                            ? "border-red-400 focus:border-red-500"
                                                            : !email
                                                                ? "border-gray-500 focus:border-blue-500"
                                                                : isEmailValid(email) || (showRegion && isPhoneNumberValid(email)) || (isUserNameValid(email))
                                                                    ? "border-green-400 focus:border-green-500"
                                                                    : "border-red-400 focus:border-red-500"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs">Mật khẩu</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        if (errPassword) setErrPassword(false);
                                                    }}
                                                    placeholder="Mật khẩu"
                                                    className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${errPassword
                                                        ? "border-red-500 focus:border-red-500"
                                                        : !password
                                                            ? "border-gray-500 focus:border-blue-500"
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
                                            <div className="mt-1 text-right">
                                                <Link
                                                    href={"/auth/forgot"}
                                                    className="text-xs font-semibold text-blue-400 hover:text-blue-500 transition-all duration-300">Quên mật khẩu?</Link>
                                            </div>
                                        </div>
                                        <div className="mt-2 space-y-4">
                                            <div className="flex justify-center items-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={agree}
                                                    onChange={(e) => setAgree(e.target.checked)}
                                                    className="mt-1.5 cursor-pointer" />
                                                <label className="text-sm">Tôi đủ 18 tuổi và tôi đã đọc các <a href="" className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Thời hạn và Điều kiện</a> và <a href="" className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Chính sách bảo mật</a></label>
                                            </div>
                                        </div>
                                        <div onClick={handleLogin} className="w-full mt-8 py-1.5 px-3 font-semibold rounded-sm text-center text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-all duration-300">
                                            Đăng nhập
                                        </div>
                                        <div className="relative w-full flex items-center justify-center my-4 mt-8 ">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>

                                            <div className="px-3 bg-white dark:bg-black text-center z-10">
                                                hoặc
                                            </div>
                                        </div>
                                        <div className="mt-8 space-y-2">
                                            <div className="relative w-full mt-10">
                                                <div className="relative w-full mt-10 group cursor-pointer">
                                                    <div className="w-full flex py-2 px-[1.4rem] text-[.875rem] leading-5 font-semibold text-center items-center justify-center rounded-sm border border-[#ccc] gap-2 bg-white transition-all duration-300
                    group-hover:scale-105 group-hover:border-blue-500">
                                                        <svg className="h-6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                                                            <svg className="h-6" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                                                                <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                                                <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                                                <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                                                                <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                                                            </svg>
                                                        </svg>
                                                        <span>Tiếp tục với Google</span>
                                                    </div>

                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute top-0 left-0 w-full h-full opacity-0 z-10">
                                                        <GoogleLoginButton />
                                                    </div>
                                                </div>

                                            </div>
                                            <button className="w-full flex py-2 px-[1.4rem] text-[.875rem] leading-5 font-semibold text-center items-center justify-center rounded-sm border border-[#ccc] gap-2 bg-white cursor-pointer transition-all duration-300 hover:scale-105 hover:border-blue-500">
                                                <svg viewBox="0 0 16 16" className="bi bi-facebook" fill="#0163E0" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                                                </svg>
                                                <span>Tiếp tục với Facebook</span>
                                            </button>
                                        </div>
                                        <div className="mt-10 text-center">
                                            Bạn chưa có tài khoản? <Link href={'/auth/signup'} className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Đăng ký ngay</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}


export default Signin;