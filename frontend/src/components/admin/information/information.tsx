"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { format } from "date-fns";
import { toast } from "sonner";
import Header from "@/components/admin/layouts/header";
import Sidebar from "../layouts/sidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { FaAngleRight } from "react-icons/fa";
import { vi } from "date-fns/locale";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { ChangeAvatar, ChangeBirthDay, ChangeInfor, ChangePassword, ChangeTwoStep } from "./change";

export default function AdminInformationPage() {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [user, setUser] = useState<any>(null);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("personalInfo");
    const [fullName, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [birthDay, setBirthDay] = useState<string>('');
    const [search, setSearch] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>('');
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [selectedField, setSelectedField] = useState<string>('');
    const [openBirthDay, setOperBirthDay] = useState<boolean>(false);
    const [identify, setIdentify] = useState<string>('');
    const [errInfo, setErrInfo] = useState<any>("");
    const [openTwoStep, setOpenTwoStep] = useState<boolean>(false);
    const [isTwoStep, setIsTwoStep] = useState<boolean>(false);
    const [openPassword, setOpenPassword] = useState<boolean>(false);
    const [openAvatar, setOpenAvatar] = useState<boolean>(false);
    const [errAvatar, setErrAvatar] = useState<any>("");

    const menu = [
        { key: "personalInfo", label: "Thông tin cá nhân" },
        { key: "security", label: "Mật khẩu & bảo mật" },
    ];

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        if (userInfo) {
            setUser(userInfo);
        }

        loadData();
        if (userInfo && accessToken) {
            handleGetInforUser();
        }
    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const InfoItem = ({ title, value, onClick, isFirst, isLast, onSelectDate }: any) => {
        const radiusClass = isFirst
            ? "rounded-t-md"
            : isLast
                ? "rounded-b-md"
                : "";

        return (
            <div
                onClick={onClick}
                className={`w-full h-[70px] py-2.5 px-4 border-b border-[#ccc] hover:bg-gray-200 transition-colors duration-200 cursor-pointer ${radiusClass}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{title}</p>
                        <div className="mt-1">
                            {value || (
                                <span className="text-gray-500">
                                    Bạn chưa cập nhật {title.toLowerCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <FaAngleRight />
                </div>
            </div>
        );
    };

    const formatBirthday = (date: string) => {
        if (!date) return null;
        try {
            return format(new Date(date), "'Ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
        } catch { return null; }
    };


    const handleGetInforUser = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setIsTwoStep(res.data.data.twoStep);
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 gap-6 p-4">
                {/* Menu con */}
                <aside className="w-72 shrink-0 bg-white rounded-2xl p-4 shadow sticky top-28">
                    <p className="text-lg font-semibold mb-4">Cài đặt tài khoản</p>
                    <nav className="flex flex-col gap-2">
                        {menu.map(item => (
                            <div
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeTab === item.key ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
                            >
                                {item.label}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Nội dung */}
                <main className="flex-1 bg-white rounded-2xl p-6 shadow">
                    {activeTab === "personalInfo" && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

                            {/* Avatar */}
                            <div onClick={() => setOpenAvatar(true)} className="py-3 px-4 rounded-b-md hover:bg-gray-200 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">Avatar</p>
                                    <FaAngleRight />
                                </div>

                                <div className="mt-2">
                                    {user?.urlAvatar ? (
                                        <Image
                                            width={50}
                                            height={50}
                                            alt="avatar"
                                            src={user.urlAvatar}
                                            className="w-[50px] h-[50px] rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500 text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Form thông tin */}

                            <InfoItem title="Họ và tên" value={user?.fullName?.trim()} onClick={() => { setSelectedTitle("Họ và tên"); setSelectedField("fullName"); setIdentify(user?.fullName || ""); setOpenInfo(true) }} isFirst />
                            <InfoItem title="Tên người dùng" value={user?.userName?.trim()} onClick={() => { setSelectedTitle("Tên người dùng"); setSelectedField("userName"); setIdentify(user?.userName || ""); setOpenInfo(true) }} />
                            <InfoItem title="Số điện thoại" value={user?.phoneNumber?.trim()} onClick={() => { setSelectedTitle("Số điện thoại"); setSelectedField("phoneNumber"); setIdentify(user?.phoneNumber || ""); setOpenInfo(true) }} />
                            <InfoItem
                                title="Ngày sinh"
                                value={user?.birthDay ? formatBirthday(user?.birthDay) : 'Chưa cập nhật'}
                                onClick={() => { setOperBirthDay(true); }}
                            />
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div>
                            <div
                                onClick={() => setOpenPassword(true)}
                                className="w-full h-[70px] py-2.5 px-4 border-b border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200 rounded-t-md cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Đổi mật khẩu</p>
                                        {user?.passWord ? (
                                            <div className="font-semibold">
                                                <sub>********</sub>
                                            </div>
                                        ) : (
                                            <p>Bạn chưa cập nhật mật khẩu</p>
                                        )}
                                    </div>
                                    <div>
                                        <FaAngleRight />
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => setOpenTwoStep(true)}
                                className="w-full h-[70px] py-2.5 px-4 border-b border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">Xác thực 2 bước</p>
                                        <p>{user.twoStep === true ? 'Đang bật' : 'Đang tắt'}</p>
                                    </div>
                                    <div>
                                        <FaAngleRight />
                                    </div>
                                </div>
                            </div>
                        </div>


                    )}
                </main>
                <sub>
                    {openInfo &&
                        <ChangeInfor
                            title={selectedTitle}
                            field={selectedField}
                            userId={userInfo?.Id}
                            user={user}
                            accessToken={accessToken}
                            identify={identify}
                            setUser={setUser}
                            setIdentify={setIdentify}
                            errIdentify={errInfo}
                            setOpenInfo={setOpenInfo}
                            setErrInfo={setErrInfo}
                        />
                    }
                    {openBirthDay &&
                        <ChangeBirthDay
                            title="Ngày sinh"
                            birthDay={user.birthDay}
                            userId={user.id}
                            user={user}
                            setUser={setUser}
                            accessToken={accessToken}
                            setOpenChangeBirthDay={setOperBirthDay}
                            setBirthDay={setBirthDay}
                        />
                    }
                    {openTwoStep &&
                        <ChangeTwoStep
                            title="Xác thực 2 bước"
                            isTwoStep={isTwoStep}
                            setIsTwoStep={setIsTwoStep}
                            userId={userInfo?.Id}
                            setOpenTwoStep={setOpenTwoStep}

                        />
                    }
                    {openPassword &&
                        <ChangePassword
                            title="Mật khẩu"
                            user={user}
                            setUser={setUser}
                            accessToken={accessToken}
                            isPassWord={user.passWord}
                            setOpenPassword={setOpenPassword}
                        />
                    }
                    {openAvatar &&
                        <ChangeAvatar
                            title="Ảnh đại diện"
                            selectedAvatar={user.urlAvatar}
                            setSelectedAvatar={(val: any) => setUser((prev: any) => ({ ...prev, urlAvatar: val }))}
                            user={user}
                            accessToken={accessToken}
                            setUser={setUser}
                            setOpenAvatar={setOpenAvatar}
                            setErrAvatar={setErrAvatar}
                        />
                    }
                </sub>
            </div>

        </div>
    );
}
