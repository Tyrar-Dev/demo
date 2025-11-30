'use client';

import { RootState } from "@/redux/store";
import { getDeviceFingerprint as getCurrentFingerprint } from "@/utils/getDeviceFingerprint";
import getDeviceInfoFromFingerprint from "@/utils/deviceUtils";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { GetAccessToken } from "../shared/token/accessToken";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const DeviceIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
        case "mobile":
            return <FaMobileAlt className="text-blue-400 text-2xl" />;
        case "tablet":
            return <FaTabletAlt className="text-purple-400 text-2xl" />;
        default:
            return <FaDesktop className="text-green-400 text-2xl" />;
    }
};

const Devices = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [devices, setDevices] = useState<any[]>([]);
    const currentFingerprint = getCurrentFingerprint();
    const [accessToken, setAccessToken] = useState<string>('');
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isLogoutDevice, setIsLogoutDevice] = useState<boolean>(false);


    useEffect(() => {
        if (!userInfo?.Id) return;
        loadData();

        if (userInfo?.Id && accessToken) {
            fetchDevices();
        }
    }, [userInfo?.Id, accessToken]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    }

    const fetchDevices = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Device/GetDevices`, {
                userId: userInfo?.Id
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setDevices(res.data || []);
        } catch (error) {
            console.error("Lỗi khi tải danh sách thiết bị:", error);
        }
    };

    const handleLogoutOtherDevices = async () => {
        if (!currentFingerprint) {
            toast.error("Không thể xác định fingerprint của thiết bị hiện tại.");
            return;
        }
        if (!userInfo?.Id) return;

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Device/LogoutAllDevices`, {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            toast.success("Đã đăng xuất tất cả thiết bị khác.");
            setIsModal(false);
            fetchDevices();
        } catch (error) {
            toast.error("Lỗi khi đăng xuất thiết bị khác.");
        }
    };

    const handleLogoutOneDevice = async (deviceId: string) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}Device/LogoutDevice?deviceId=${deviceId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        ).then(res => {
            toast.success("Đăng xuất thành công");
            fetchDevices();
        }).catch(err => {
            toast.error("Đăng xuất thất bại");
        })
    }

    const currentDevice = devices.find(d => d.fingerprint === currentFingerprint);
    const otherDevices = devices.filter(d => d.fingerprint !== currentFingerprint);

    return (
        <div className="mt-10 text-white space-y-8">
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-xl text-black font-bold mb-3">Thiết bị hiện tại</h2>
                    <div>
                        <button
                            onClick={() => setIsModal(true)}
                            className="text-red-500 font-semibold w-full md:w-auto hover:underline transition cursor-pointer"
                        >
                            Đăng xuất tất cả thiết bị khác
                        </button>
                    </div>
                </div>
                {currentDevice ? (
                    (() => {
                        const info = getDeviceInfoFromFingerprint(currentDevice.fingerprint);
                        if (!info)
                            return <p>Không thể phân tích thông tin thiết bị hiện tại.</p>;
                        return (
                            <div className="p-4 bg-green-600 rounded-lg shadow-lg border border-green-500">
                                <div className="flex items-center justify-between">
                                    {/* Cột trái */}
                                    <div className="flex items-center gap-3">
                                        <DeviceIcon type={info.deviceType} />
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {info.browser} / {info.os}
                                            </p>
                                            <p className="text-sm opacity-80">{info.deviceType}</p>
                                        </div>
                                    </div>

                                    {/* Cột phải */}
                                    <span className="px-3 py-1 bg-black bg-opacity-20 rounded text-xs whitespace-nowrap">
                                        Thiết bị hiện tại
                                    </span>
                                </div>

                                {/* Dòng dưới */}
                                <p className="mt-2 text-sm">
                                    Hoạt động cuối: {" "}
                                    {currentDevice?.lastActive && (
                                        <span className="text-sm font-normal">
                                            {format(new Date(currentDevice.lastActive), "EEEE, dd/MM/yyyy HH:mm", { locale: vi })}
                                        </span>
                                    )}
                                </p>
                            </div>

                        );
                    })()
                ) : (
                    <p className="opacity-70">Không tìm thấy thiết bị hiện tại.</p>
                )}
            </div>

            <div>
                <h2 className="text-xl text-black font-bold mb-3">Thiết bị đã đăng nhập</h2>

                {otherDevices.length === 0 ? (
                    <p className="opacity-70 text-black">Không có thiết bị nào khác.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {otherDevices.map((d, i) => {
                            const info = getDeviceInfoFromFingerprint(d.fingerprint);
                            if (!info)
                                return <p>Không thể phân tích thông tin thiết bị hiện tại.</p>;
                            return (
                                <div key={i}>
                                    <div
                                        className="p-4 bg-gray-400 rounded-lg shadow-md hover:bg-gray-500 transition border border-gray-400"
                                    >
                                        <p className="font-semibold">
                                            {info.browser} / {info.os}
                                        </p>
                                        <div className="flex justify-between">
                                            <p className="text-sm opacity-80">{info.deviceType}</p>
                                            <div onClick={() => setIsLogoutDevice(true)}>
                                                <FaTrash className="hover:text-red-500 text-[1.5rem] cursor-pointer" />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-sm">
                                            Hoạt động cuối: {" "}
                                            {format(new Date(d.lastActive), "EEEE, dd/MM/yyyy HH:mm", { locale: vi })}
                                        </p>
                                    </div >
                                    <AnimatePresence>
                                        {isLogoutDevice && (
                                            <>
                                                <motion.div
                                                    className="fixed inset-0 bg-black bg-opacity-50 z-70"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.5 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setIsLogoutDevice(false)}
                                                />

                                                <motion.div
                                                    className="fixed inset-0 z-70 flex items-center justify-center"
                                                    initial={{ y: "100%", opacity: 0 }}
                                                    animate={{ y: "0%", opacity: 1 }}
                                                    exit={{ y: "100%", opacity: 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                >
                                                    <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md">
                                                        <h2 className="text-lg font-semibold mb-4">Xác nhận đăng xuất <br /> {info.browser} / {info.os}</h2>
                                                        <p className="mb-6">Bạn có chắc chắn muốn đăng xuất các thiết bị khác?</p>
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                className="px-4 py-2 rounded-md border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                                                                onClick={() => handleLogoutOneDevice(d.id)}
                                                            >
                                                                Đăng xuất
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white cursor-pointer transition-all duration-200"
                                                                onClick={() => setIsLogoutDevice(false)}
                                                            >
                                                                Không
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                )}

                <AnimatePresence>
                    {isModal && (
                        <>
                            <motion.div
                                className="fixed inset-0 bg-black bg-opacity-50 z-70"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsModal(false)}
                            />

                            <motion.div
                                className="fixed inset-0 z-70 flex items-center justify-center"
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                exit={{ y: "100%", opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <div className="bg-white text-black rounded-xl shadow-xl p-6 w-full max-w-md">
                                    <h2 className="text-lg font-semibold mb-4">Xác nhận đăng xuất các thiết bị khác</h2>
                                    <p className="mb-6">Bạn có chắc chắn muốn đăng xuất các thiết bị khác?</p>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            className="px-4 py-2 rounded-md border border-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-200"
                                            onClick={handleLogoutOtherDevices}
                                        >
                                            Đăng xuất
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white cursor-pointer transition-all duration-200"
                                            onClick={() => setIsModal(false)}
                                        >
                                            Không
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default Devices;
