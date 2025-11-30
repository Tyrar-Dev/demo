'use client';

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import { differenceInYears } from 'date-fns';
import { isEmailValid, isPasswordValid, isUserNameValid } from "../shared/validator/checkform";
const SignupOne = () => {

    const [email, setEmail] = useState<string>('');
    const [errEmail, setErrEmail] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [errUserName, setErrUserName] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [errPassword, setErrPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [continueStep, setContinueStep] = useState<boolean>(false);
    const [isLengthValid, setIsLengthValid] = useState<boolean>(false);
    const [hasUpperLower, setHasUpperLower] = useState<boolean>(false);
    const [hasNumberOrSymbol, setHasNumberOrSymbol] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [errFirstName, setErrFirstName] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>('');
    const [errLastName, setErrLastName] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [errPhone, setErrPhone] = useState<boolean>(false);
    const [day, setDay] = useState<number>(0);
    const [errDay, setErrDay] = useState<boolean>(false);
    const [month, setMonth] = useState<number>(0);
    const [errMonth, setErrMonth] = useState<boolean>(false);
    const [year, setYear] = useState<string>('');
    const [errYear, setErrYear] = useState<boolean>(false);

    const router = useRouter();
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

    const handleCheckValid = async () => {
        if (email.length === 0 || userName.length === 0 || password.length === 0) {
            if (email.length === 0) toast.error("Email không được để trống");
            if (userName.length === 0) toast.error("Username không được để trống");
            if (password.length === 0) toast.error("Mật khẩu không được để trống");
            return;
        }

        const isEmailOk = isEmailValid(email);
        const isPasswordOk =
            password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /[0-9!@#$%^&*]/.test(password);
        const isUserNameOk = isUserNameValid(userName);

        if (isEmailOk && isPasswordOk && isUserNameOk) {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/ValidateAccountStepOne`, {
                userName: userName,
                email: email
            });
            if (result.data.status === 400) {
                if (result.data.message === "Tên đăng nhập đã tồn tại") {
                    setErrUserName(true);
                }
                if (result.data.message === "Email đã có quá 1 tài khoản đăng ký. Vui lòng chọn email khác !") {
                    setErrEmail(true);
                }
                toast.error(`${result.data.message}`);
            } else {
                setContinueStep(true);
            }
        } else {
            !isEmailOk && toast.error("Email không hợp lệ");
            !isPasswordOk && toast.error("Mật khẩu chưa đúng định dạng");
            !isUserNameOk && toast.error("Username đã được sử dụng")
        }
    }


    const handleFirstNameChange = (value: string) => {
        setFirstName(value);
        if (value.trim() === '') {
            setErrFirstName(true);
        } else {
            setErrFirstName(false);
        }
    };

    const handleLastNameChange = (value: string) => {
        setLastName(value);
        if (value.trim() === '') {
            setErrLastName(true);
        } else {
            setErrLastName(false);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        if (!/^\d{0,10}$/.test(value)) return;
        if (value.length === 10) {
            setErrPhone(false);
        } else {
            setErrPhone(true);
        }
    };

    const isDateOk = (day: number, month: number, year: number): boolean => {
        if (!day || !month || !year) return false;
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age = differenceInYears(today, birthDate);
        return age >= 18;
    };

    const handleSignup = () => {
        const isFirstNameOk = firstName.trim() !== '';
        const isLastNameOk = lastName.trim() !== '';
        const isPhoneOk = /^\d{10}$/.test(phoneNumber);
        const isBirthday = isDateOk(day, month, Number(year));

        if (firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || !isBirthday) {
            if (firstName.length === 0) toast.error("Họ không được để trống");
            if (lastName.length === 0) toast.error("Tên không được để trống");
            if (phoneNumber.length === 0) toast.error("Số điện thoại không được để trống");
            if (!isBirthday) toast.error("Bạn chưa chọn ngày sinh");
            return;
        }

        setErrFirstName(!isFirstNameOk);
        setErrLastName(!isLastNameOk);
        setErrPhone(!isPhoneOk);

        if (!isFirstNameOk) toast.error('Họ không được rỗng');
        if (!isLastNameOk) toast.error('Tên không được rỗng');
        if (!isPhoneOk) toast.error('Số điện thoại phải là 10 số');
        if (!isBirthday) toast.error('Bạn chưa đủ 18 tuổi');

        if (isFirstNameOk && isLastNameOk && isPhoneOk && isBirthday) {
            axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/CreateUser`, {
                UserName: userName,
                PassWord: password,
                FullName: firstName + " " + lastName,
                Email: email,
                PhoneNumber: phoneNumber,
                BirthDay: `${Number(year)}-${month}-${day}`,
                UrlAvatar: ''
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
            ).then(res => {
                if (res.data.status === 400) {
                    toast.error(`${res.data.message}`)
                } else {
                    router.push('/auth/active');
                }
            }).catch(err => {
                console.log(err);
            })
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
                        <div>
                            <Link className="text-white" href={"/"}>Trang chủ</Link>
                        </div>
                        <div className="text-white text-[2rem]">
                            Chào mừng bạn đến với AutoBot
                        </div>
                        <div className="text-white">
                            “Chứng khoán tự động, lợi nhuận chủ động”
                        </div>
                    </div>
                    {!continueStep ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -80 }}
                            transition={{ duration: 0.4 }}
                            className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                        >
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleCheckValid();
                            }}>
                                <div>
                                    <div className="py-12 pl-5 pr-10">
                                        <div className="text-xs text-gray-400 font-semibold">Bước 1 trên 2</div>
                                        <div className="text-2xl font-semibold">Đăng ký</div>
                                        <div className="flex flex-wrap gap-2 mt-5 space-y-2">
                                            <div className="w-3/12 px-1 flex-0">
                                                <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75">
                                                    <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                                                        <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                                                            <g fillRule="nonzero" transform="translate(3.000000, 2.000000)">
                                                                <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"></path>
                                                                <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"></path>
                                                                <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"></path>
                                                                <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div className="w-3/12 px-1 flex-0">
                                                <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75">
                                                    <svg xmlnsXlink="http://www.w3.org/1999/xlink32" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                                                        <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                                                            <g fillRule="nonzero" transform="translate(3.000000, 3.000000)">
                                                                <circle r="29.4882047" cy="29.4927506" cx="29.5091719" fill="#3C5A9A"></circle>
                                                                <path fill="#FFFFFF" d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="relative w-full flex items-center justify-center mb-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="px-3 bg-white dark:bg-black text-center z-10">
                                                hoặc
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold">
                                            Đăng ký bằng email
                                        </div>
                                        <div className="mt-2 text-xs">
                                            Bạn đã có tài khoản? <Link href={`/auth/signin`} className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Đăng nhập ngay</Link>
                                        </div>
                                        <div className="mt-5 space-y-4">
                                            <div>
                                                <label className="text-xs">Địa chỉ email</label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={email}
                                                        autoFocus
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                            if (errEmail) setErrEmail(false);
                                                        }}
                                                        placeholder="Địa chỉ email"
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${errEmail
                                                            ? "border-red-400 focus:border-red-500"
                                                            : !email
                                                                ? "border-gray-400 focus:border-blue-500"
                                                                : isEmailValid(email)
                                                                    ? "border-green-400 focus:border-green-500"
                                                                    : "border-red-400 focus:border-red-500"
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs">Tên đăng nhập</label>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={userName}
                                                        onChange={(e) => {
                                                            setUserName(e.target.value);
                                                            if (errUserName) setErrUserName(false);
                                                        }}
                                                        placeholder="Tên đăng nhập"
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all ${errUserName
                                                            ? "border-red-400 focus:border-red-500"
                                                            : !userName
                                                                ? "border-gray-400 focus:border-blue-500"
                                                                : isUserNameValid(userName)
                                                                    ? "border-green-400 focus:border-green-500"
                                                                    : "border-red-400 focus:border-red-500"
                                                            }`}
                                                    />
                                                </div>
                                                {userName.length > 0 && !isUserNameValid(userName) && (
                                                    <div className="mt-5 text-xs">
                                                        <div className="font-semibold">Tạo tên đăng nhập:</div>
                                                        <div className="mt-3 font-medium space-y-1.5">
                                                            {userName.trim() === "" && (
                                                                <div className="flex gap-2 items-center">
                                                                    <IoClose className="text-red-500" />
                                                                    <div className="text-red-500">Tên đăng nhập không được để trống</div>
                                                                </div>
                                                            )}
                                                            {/\s/.test(userName) && (
                                                                <div className="flex gap-2 items-center">
                                                                    <IoClose className="text-red-500" />
                                                                    <div className="text-red-500">Không chứa khoảng cách</div>
                                                                </div>
                                                            )}
                                                            {(userName.length < 4 || userName.length > 20) && (
                                                                <div className="flex gap-2 items-center">
                                                                    <IoClose className="text-red-500" />
                                                                    <div className="text-red-500">Tên đăng nhập phải từ 4 đến 20 ký tự</div>
                                                                </div>
                                                            )}
                                                            {!/^[a-zA-Z0-9_.]+$/.test(userName) && (
                                                                <div className="flex gap-2 items-center">
                                                                    <IoClose className="text-red-500" />
                                                                    <div className="text-red-500">Không được chứa ký tự đặc biệt</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                            <div>
                                                <label className="text-xs">Mật khẩu</label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
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
                                            <button type="submit" className="w-full mt-8 py-1.5 px-3 font-semibold rounded-sm text-center text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-all duration-300">
                                                Tiếp tục
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -80 }}
                            transition={{ duration: 0.4 }}
                            className="w-[30%] bg-white rounded-2xl mx-auto py-3 p-8"
                        >
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSignup();
                            }}>
                                <div>
                                    <div className="py-12 pl-5 pr-10">
                                        <div className="text-xs text-gray-400 font-semibold">Bước 2 trên 2</div>
                                        <div className="text-2xl font-semibold">Đăng ký</div>
                                        <div className="flex flex-wrap mt-5 space-y-2">
                                            <div className="w-3/12 px-1 flex-0">
                                                <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all duration-300 bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-105 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75 hover:border-blue-500">
                                                    <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                                                        <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                                                            <g fillRule="nonzero" transform="translate(3.000000, 2.000000)">
                                                                <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"></path>
                                                                <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"></path>
                                                                <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"></path>
                                                                <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </div>
                                            <div className="w-3/12 px-1 flex-0">
                                                <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all duration-300 bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-105 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75 hover:border-blue-500">
                                                    <svg xmlnsXlink="http://www.w3.org/1999/xlink32" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                                                        <g fillRule="evenodd" fill="none" strokeWidth="1" stroke="none">
                                                            <g fillRule="nonzero" transform="translate(3.000000, 3.000000)">
                                                                <circle r="29.4882047" cy="29.4927506" cx="29.5091719" fill="#3C5A9A"></circle>
                                                                <path fill="#FFFFFF" d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z"></path>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="relative w-full flex items-center justify-center mb-2">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="px-3 bg-white dark:bg-black text-center z-10">
                                                hoặc
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs">
                                            Bạn đã có tài khoản? <Link href={`/auth/signin`} className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Đăng nhập ngay</Link>
                                        </div>
                                        <div className="mt-5 space-y-4">
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="text-xs">
                                                    <label>Họ</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Họ"
                                                        autoFocus
                                                        value={firstName}
                                                        onChange={(e) => handleFirstNameChange(e.target.value)}
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all 
                                                        ${errFirstName ? 'border-red-400 focus:border-red-500'
                                                                : !firstName ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}
                                                    />
                                                </div>
                                                <div className="text-xs">
                                                    <label>Tên đệm & tên</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Tên"
                                                        value={lastName}
                                                        onChange={(e) => handleLastNameChange(e.target.value)}
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all border-blue-400 focus:border-blue-500 
                                                        ${errLastName ? 'border-red-400 focus:border-red-500'
                                                                : !lastName ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs grid grid-cols-3 gap-3">
                                                <div className="flex flex-col">
                                                    <label>Ngày</label>
                                                    <select value={day}
                                                        onChange={(e) => setDay(Number(e.target.value))}
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all border-blue-400 focus:border-blue-500 
                                                        ${errDay ? 'border-red-400 focus:border-red-500'
                                                                : !day ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}>
                                                        <option value={0}>Ngày</option>
                                                        {Array.from({ length: 31 }, (_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex flex-col">
                                                    <label>Tháng</label>
                                                    <select value={month}
                                                        onChange={(e) => setMonth(Number(e.target.value))}
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all border-blue-400 focus:border-blue-500 
                                                        ${errMonth ? 'border-red-400 focus:border-red-500'
                                                                : !month ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}>
                                                        <option value={0}>Tháng</option>
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex flex-col">
                                                    <label>Năm</label>
                                                    <input
                                                        type="text"
                                                        value={year}
                                                        onChange={(e) => setYear(e.target.value)}
                                                        placeholder="Nhập năm"
                                                        className={`w-full mt-1 py-2 px-3 text-sm border rounded-sm outline-none transition-all border-blue-400 focus:border-blue-500 
                                                        ${errYear ? 'border-red-400 focus:border-red-500'
                                                                : !year ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}
                                                        min={1900}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs mt-5">
                                                <label>Số điện thoại</label>
                                                <div className="relative mt-1">
                                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 gap-1">
                                                        <img src="/assets/images/signup/flagvn.webp" alt="VN" className="w-4 h-4 rounded-sm" />
                                                        <span className="text-gray-600 text-sm">+84</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Số điện thoại"
                                                        value={phoneNumber}
                                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                                        className={`w-full pl-16 py-2 px-3 text-sm border rounded-sm outline-none transition-all border-blue-400 focus:border-blue-500 
                                                        ${errPhone ? 'border-red-400 focus:border-red-500'
                                                                : !phoneNumber ? 'border-gray-400 focus:border-blue-500'
                                                                    : 'border-green-400 focus:border-green-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-5 space-y-2 text-xs">
                                                <div><span className="text-blue-400 font-semibold">AutoBot</span> có thể thông báo cho tôi bằng email được cá nhân hóa về các sản phẩm và dịch vụ.</div>
                                                <div>
                                                    Bằng cách nhấp vào Tạo tài khoản, tôi đồng ý rằng tôi đã đọc và chấp nhận <a href="" className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Điều khoản sử dụng</a> và <a href="" className="text-blue-400 hover:text-blue-500 transition-all duration-300 font-semibold underline">Chính sách quyền riêng tư</a>.
                                                </div>
                                            </div>
                                            <button type="submit" className="w-full mt-8 py-1.5 px-3 font-semibold rounded-sm text-center text-white bg-blue-400 cursor-pointer hover:bg-blue-500 transition-all duration-300">
                                                Đăng ký tài khoản
                                            </button>
                                            <div className="mt-20 w-full h-px bg-gray-500"></div>
                                            <div onClick={() => setContinueStep(false)} className="text-xs font-medium flex gap-1 items-center hover:underline cursor-pointer">
                                                <MdKeyboardBackspace />
                                                <div>Trở về bước 1</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>

            </div>
        </div >
    )
}

export default SignupOne;