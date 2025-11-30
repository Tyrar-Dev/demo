'use client';
import { RootState } from "@/redux/store";
import axios from "axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleRight, FaUser } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaCircleCheck, FaCircleXmark, FaShield } from "react-icons/fa6";
import { ChangeAvatar, ChangeBirthDay, ChangeInfor, ChangePassword, ChangePinCode, ChangeTwoStep } from "./change";
import { MdOutlineDevices } from "react-icons/md";
import Devices from "../auth/devices";
import { GetAccessToken } from "../shared/token/accessToken";

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


const DefaultItem = ({ title, value }: any) => (
    <div
        className="w-full h-[70px] py-2.5 px-4 border-b border-[#ccc] transition-colors duration-200"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="font-semibold">{title}</p>
                <div className="mt-1">
                    {value || <span className="text-gray-500">Bạn chưa cập nhật {title.toLowerCase()}</span>}
                </div>
            </div>
        </div>
    </div>
);

const Information = () => {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [activeTab, setActiveTab] = useState<any>("personalInfo");
    const [user, setUser] = useState<any>(null);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [openAvatar, setOpenAvatar] = useState<boolean>(false);
    const [openPassword, setOpenPassword] = useState<boolean>(false);
    const [openTwoStep, setOpenTwoStep] = useState<boolean>(false);
    const [openBirthDay, setOperBirthDay] = useState<boolean>(false);
    const [openChangePinCode, setOpenChangePinCode] = useState<boolean>(false);
    const [birthDay, setBirthDay] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [errInfo, setErrInfo] = useState<any>("");
    const [errAvatar, setErrAvatar] = useState<any>("");
    const [selectedTitle, setSelectedTitle] = useState<string>('');
    const [day, setDay] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [selectedField, setSelectedField] = useState<string>('');
    const [isTwoStep, setIsTwoStep] = useState<boolean>(false);
    const [identify, setIdentify] = useState<string>('');
    const [accessToken, setAccessToken] = useState<string>('');

    const menu =
        [
            { key: "personalInfo", label: "Thông tin cá nhân", icon: <FaUser /> },
            { key: "security", label: "Mật khẩu & bảo mật", icon: <FaShield /> },
            { key: "devices", label: "Quản lý thiết bị", icon: <MdOutlineDevices /> },
        ]

    useEffect(() => {
        if (!userInfo?.Id && !accessToken) return;
        loadData();
        if (userInfo?.Id && accessToken) {
            if (user?.twoStep !== undefined) {
                setIsTwoStep(user.twoStep);
            }
            if (user?.birthday !== undefined) {
                setBirthDay(user.birthday);
            }
            if (user?.urlAvatar !== undefined) {
                setAvatar(user?.urlAvatar)
            }
            handleGetInforUser();
        }

    }, [userInfo, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo.Id);
        if (token) setAccessToken(token);
    };

    const handleGetInforUser = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}Authen/GetUserById?userId=${userInfo?.Id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setUser(res.data.data);
            }).catch(err => {
                console.log(err);
            })
    }

    const formatBirthday = (date: string) => {
        if (!date) return null;
        try {
            return format(new Date(date), "'Ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
        } catch { return null; }
    };



    if (!user) return null;

    return (
        <div>
            <div className="bg-[#edf6fe] min-h-screen p-6 shadow-lg relative overflow-hidden">
                <div className="flex gap-20 px-28">

                    <aside className="w-[30%] fixed left-24 top-5 h-screen overflow-hidden">
                        <div className="flex gap-2 items-center">
                            <Image
                                loading="lazy"
                                width={80}
                                height={80}
                                alt="Logo"
                                src="/assets/images/logo.png"
                                className="w-20 h-20"
                            />
                            <p className="text-[1.6rem] font-semibold">AutoBot</p>
                        </div>
                        <p className="mt-5 text-[1.4rem] font-semibold">Cài đặt tài khoản</p>
                        <p className="mt-2 text-[#3c3c3c]">
                            Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, bảo mật, thông báo,...
                        </p>

                        <nav className="mt-8 space-y-2">
                            {menu.map((item) => (
                                <div
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key)}
                                    className={`py-3 px-4 flex items-center gap-3 font-semibold rounded-lg cursor-pointer transition-colors ${activeTab === item.key
                                        ? "bg-[#344854] text-white"
                                        : "hover:bg-gray-300"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </div>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1 ml-[40%] pr-3 mt-14">
                        {activeTab === "personalInfo" && user && (
                            <>
                                <h3 className="text-2xl font-semibold">Thông tin cá nhân</h3>
                                <p className="mt-2 text-xs">
                                    Quản lý các thông tin như tên, ngày sinh, tài khoản...
                                </p>

                                <h4 className="mt-8 text-xl font-semibold">Thông tin cơ bản</h4>
                                <div className="mt-2 text-xs">
                                    Tên hiển thị, tên người dùng, số điện thoại, ngày sinh và ảnh đại diện.
                                </div>

                                <div className="w-full mt-4 bg-white rounded-md shadow text-sm">
                                    <InfoItem title="Họ và tên" value={user.fullName?.trim()} onClick={() => { setSelectedTitle("Họ và tên"); setSelectedField("fullName"); setIdentify(user.fullName || ""); setOpenInfo(true) }} isFirst />
                                    <InfoItem title="Tên người dùng" value={user.userName?.trim()} onClick={() => { setSelectedTitle("Tên người dùng"); setSelectedField("userName"); setIdentify(user.userName || ""); setOpenInfo(true) }} />
                                    <InfoItem title="Số điện thoại" value={user.phoneNumber?.trim()} onClick={() => { setSelectedTitle("Số điện thoại"); setSelectedField("phoneNumber"); setIdentify(user.phoneNumber || ""); setOpenInfo(true) }} />
                                    <InfoItem
                                        title="Ngày sinh"
                                        value={user.birthDay ? formatBirthday(user.birthDay) : 'Chưa cập nhật'}
                                        onClick={() => { setOperBirthDay(true); }}
                                    />
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

                                </div>

                                <h4 className="mt-8 text-xl font-semibold">Thông tin mặc định</h4>
                                <div className="mt-2 text-xs">
                                    Đây là các thông tin mặc định của bạn, không thể thay đổi.
                                </div>
                                <div className="w-full mt-4 bg-white rounded-md shadow text-sm">
                                    <DefaultItem title="Địa chỉ email" value={user.email?.trim()} />
                                    <DefaultItem title="Ngày tham gia" value={formatBirthday(user.createdDate?.trim())} />
                                    <div className="py-3 px-4 rounded-b-md transition-colors">
                                        <p className="font-semibold">Xác thực tài khoản</p>
                                        <div>
                                            {user?.isActive === true ? (
                                                <div className="flex items-center gap-1 mt-1 text-green-500 font-semibold">
                                                    <FaCircleCheck />
                                                    <div>Đã xác thực</div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 mt-1 text-red-500 font-semibold">
                                                    <FaCircleXmark />
                                                    <div>Chưa xác thực</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "security" && user && (
                            <div>
                                <p className="text-2xl font-semibold">Mật khẩu và bảo mật</p>
                                <p className="mt-2 text-xs">Quản lý mật khẩu và cài đặt bảo mật.</p>
                                <p className="mt-8 text-xl font-semibold">Đăng nhập và khôi phục</p>
                                <div className="w-full h-full mt-4 bg-white rounded-md shadow-md">

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
                                        onClick={() => setOpenChangePinCode(true)}
                                        className="w-full h-[70px] py-2.5 px-4 border-b border-solid border-[#ccc] hover:bg-gray-200 transition-colors duration-200 rounded-t-md cursor-pointer">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">Đổi mã pin</p>
                                                <div className="font-semibold">
                                                    <sub>********</sub>
                                                </div>
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
                                                <p>{user?.twoStep === true ? 'Đang bật' : 'Đang tắt'}</p>
                                            </div>
                                            <div>
                                                <FaAngleRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "devices" && user && (
                            <div>
                                <p className="text-2xl font-semibold">Quản lý thiết bị</p>
                                <p className="mt-2 text-xs">Quản lý thiết bị đăng nhập và cài đặt bảo mật.</p>
                                <Devices />
                            </div>
                        )}
                    </main>
                </div>
                <sub>
                    {openInfo &&
                        <ChangeInfor
                            title={selectedTitle}
                            field={selectedField}
                            userId={userInfo?.id}
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
                    {openTwoStep &&
                        <ChangeTwoStep
                            title="Xác thực 2 bước"
                            isTwoStep={isTwoStep}
                            setIsTwoStep={setIsTwoStep}
                            userId={user.id}
                            setOpenTwoStep={setOpenTwoStep}
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
                    {openChangePinCode &&
                        <ChangePinCode
                            title="Đổi mã pin"
                            userId={user.id}
                            accessToken={accessToken}
                            setOpenChangePinCode={setOpenChangePinCode}

                        />
                    }

                </sub>
                <button
                    onClick={() => router.push('/')}
                    className="absolute right-10 top-10"
                >
                    <IoCloseCircle className="text-[2.5rem] text-[#ccc] hover:text-[#777] transition-colors cursor-pointer" />
                </button>
            </div>
        </div>
    )
}
export default Information;