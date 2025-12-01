"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { IoIosClose, IoIosDocument } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { LuSendHorizontal } from "react-icons/lu";
import { FiPaperclip } from "react-icons/fi";
import { MdCollections } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import axios from "axios";
import handleUploadMessage from "../shared/cloudinary/upload-message";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAccessToken } from "../shared/token/accessToken";
import { createChatConnection } from "../shared/signalR/connection";

const Chat = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isFocused] = useState(false);
    const [showAttachModal, setShowAttachModal] = useState(false);
    const [listMessage, setListMessage] = useState<any>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [accessToken, setAccessToken] = useState<string>('');
    const [connection, setConnection] = useState<any>(null);

    useEffect(() => {
        const initSignalR = async () => {
            let guestId = localStorage.getItem("guestId");

            if (!guestId) {
                guestId = await generaStringGuest();
                localStorage.setItem("guestId", guestId);
            }

            const conn = createChatConnection(guestId);
            console.log("GUEST ID =", localStorage.getItem("guestId"));
            conn.start().then(() => {
                console.log("SignalR Connected Client");
                const guestId = localStorage.getItem("guestId");
                if(guestId) conn.invoke("JoinRoom", guestId);
            });

            conn.on("ReceiveMessage", (msg) => {
                setListMessage((prev: any) => {
                    if (prev.some((m: any) => m.id === msg.id)) return prev;
                    let parsedContent: any = msg.message;
                    try {
                        parsedContent = JSON.parse(msg.message); // parse nếu admin gửi image/file
                    } catch { }

                    return [
                        ...prev,
                        {
                            ...msg,
                            message: parsedContent, // nếu là object {url,name} giữ nguyên
                            typeMessage: msg.typeMessage, // "text" | "image" | "file"
                        },
                    ];
                });
            });

            setConnection(conn);
        };

        initSignalR();
    }, []);

    const sendToServer = async (value: string, typeMessage: string) => {
        let guestId = localStorage.getItem("guestId");
        if (!guestId) {
            guestId = await generaStringGuest();
            localStorage.setItem("guestId", guestId);
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Chat/SendMessage`, {
                message: value,
                targetId: "",
                guestId,
                typeMessage,
            });


            // await connection?.current.invoke("SendMessage", guestId, value, typeMessage);

            setMessage("");
            // handleGetMessage();
        } catch (err) {
            console.log(err);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        await sendToServer(message, "text");
    };

    const handleGetMessage = async () => {
        let guestId = localStorage.getItem("guestId");
        if (!guestId) return;

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_URL_API}Chat/GetHistory?GuestId=${guestId}`
            );
            setListMessage(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        handleGetMessage();
        if (userInfo?.Id) {
            loadData();
        }
    }, [userInfo]);

    const loadData = async () => {
        const token = await GetAccessToken(userInfo?.Id);
        if (token) setAccessToken(token);
    };

    const generaStringGuest = async () => {
        const chars =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
        const getRandomPart = (length: number) => {
            let str = "";
            for (let i = 0; i < length; i++) {
                const index = Math.floor(Math.random() * chars.length);
                str += chars[index];
            }
            return str;
        };

        return `${getRandomPart(36)}.${getRandomPart(216)}.${getRandomPart(43)}`;
    };

    const handleUploadImage = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setShowAttachModal(!showAttachModal);

        const url = await handleUploadMessage(file);
        if (!url) return;

        await sendToServer(JSON.stringify({
            url: url.url,
            name: url.originalName
        }), "image");

    };

    const handleUploadFile = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setShowAttachModal(false);

        const url = await handleUploadMessage(file);
        if (!url) return;

        await sendToServer(JSON.stringify({
            url: url.url,
            name: url.originalName
        }), "file");

    };

    const safeJSONParse = (value: string) => {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    return (
        <>
            {open && (
                <div className="fixed z-1000 bottom-20 right-5 w-[400px] h-[500px] bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                    <div className="flex items-center bg-blue-500 text-white p-3 font-semibold">
                        <div className="translate-y-1/6">
                            <Image
                                width={1000}
                                height={500}
                                src="/assets/images/chat-icon.png"
                                alt="Chat Icon"
                                className="w-10 h-10 object-cover"
                            />
                        </div>
                        <div>Hỗ trợ trực tuyến</div>
                    </div>

                    <div className="p-3 space-y-2 min-h-[380px] flex-1 overflow-auto">
                        <div className="flex items-start gap-1.5 p-2 max-w-full">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                <Image
                                    src="/assets/images/chat-icon.png"
                                    width={40}
                                    height={40}
                                    alt="Chat Icon"
                                    className="translate-y-1/6 w-9 h-9 object-contain"
                                />
                            </div>

                            <p className="bg-white px-4 py-[9px] text-sm rounded-md border border-gray-200 shadow wrap-break-word max-w-[calc(100%-48px)]">
                                Xin chào! Tôi có thể giúp gì cho bạn?
                            </p>
                        </div>

                        {listMessage?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className={`flex w-full ${item.isAdminSender ? "justify-start" : "justify-end"}`}
                            >
                                {item.isAdminSender && (
                                    <div className="flex items-end gap-1.5 max-w-[80%]">
                                        <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                                            <Image
                                                src="/assets/images/chat-icon.png"
                                                width={40}
                                                height={40}
                                                alt="Chat Icon"
                                                className="translate-y-1/6 w-8.5 h-8.5 object-contain"
                                            />
                                        </div>

                                        <div className={`${item.typeMessage !== "image" ? 'px-2 py-1' : ''} bg-white text-black border border-gray-200 shadow rounded-lg text-sm max-w-full wrap-break-word`}>
                                            {item.typeMessage === "text" && <p>{item.message}</p>}

                                            {item.typeMessage === "image" && (() => {
                                                const file = typeof item.message === "string" ? safeJSONParse(item.message) : item.message;
                                                if (!file?.url) return null;
                                                return (
                                                    <Image
                                                        width={1000}
                                                        height={500}
                                                        src={file.url}
                                                        alt={file.name || "image"}
                                                        className="w-[200px] h-[100px] object-cover rounded-md"
                                                    />
                                                );
                                            })()}

                                            {item.typeMessage === "file" && (() => {
                                                const file = typeof item.message === "string" ? safeJSONParse(item.message) : item.message;
                                                if (!file?.url) return null;
                                                return (
                                                    <div className="flex items-center gap-1 py-1 px-2 text-blue-600">
                                                        <IoIosDocument size={20} />
                                                        <a
                                                            href={file.url.replace("/upload/", "/upload/fl_attachment/")}
                                                            download={file.name || "file"}
                                                            className="truncate max-w-[150px]"
                                                        >
                                                            {file.name || "File"}
                                                        </a>
                                                    </div>
                                                );
                                            })()}

                                        </div>
                                    </div>
                                )}

                                {!item.isAdminSender && (
                                    <div className={`${item.typeMessage !== "image" ? 'bg-blue-400 px-2 py-1' : '' } text-white rounded-lg text-sm shadow max-w-[80%] wrap-break-word`}>
                                        {item.typeMessage === "text" && <p>{item.message}</p>}

                                        {item.typeMessage === "image" && (() => {
                                            const file = typeof item.message === "string" ? safeJSONParse(item.message) : item.message;
                                            if (!file?.url) return null;
                                            return (
                                                <Image
                                                    width={1000}
                                                    height={500}
                                                    src={file.url}
                                                    alt={file.name || "image"}
                                                    className="w-[200px] h-[100px] object-cover rounded-md"
                                                />
                                            );
                                        })()}

                                        {item.typeMessage === "file" && (() => {
                                            const file = typeof item.message === "string" ? safeJSONParse(item.message) : item.message;
                                            if (!file?.url) return null;
                                            return (
                                                <div className="flex items-center gap-1 py-1 px-2 text-white">
                                                    <IoIosDocument size={20} />
                                                    <a
                                                        href={file.url.replace("/upload/", "/upload/fl_attachment/")}
                                                        download={file.name || "file"}
                                                        className="truncate max-w-[150px]"
                                                    >
                                                        {file.name || "File"}
                                                    </a>
                                                </div>
                                            );
                                        })()}

                                    </div>
                                )}
                            </div>
                        ))}

                    </div>

                    <div className="p-2 border-t relative flex items-center gap-2">
                        {!isFocused && (
                            <div className="relative">
                                <button
                                    className="text-blue-500 hover:text-blue-700 rounded-md cursor-pointer mt-1.5"
                                    onClick={() =>
                                        setShowAttachModal(!showAttachModal)
                                    }
                                >
                                    <FaCirclePlus size={24} />
                                </button>

                                <AnimatePresence>
                                    {showAttachModal && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 10,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute bottom-full w-[120px] mb-2 left-0 flex flex-col bg-white border border-gray-300 rounded shadow-md py-2 px-2 space-y-2 z-9999"
                                        >
                                            <button
                                                className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-blue-500"
                                                onClick={() =>
                                                    imageInputRef.current?.click()
                                                }
                                            >
                                                <MdCollections size={24} /> Ảnh
                                            </button>

                                            <button
                                                className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded cursor-pointer text-blue-500"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <FiPaperclip size={24} /> Tệp
                                            </button>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                ref={imageInputRef}
                                                onChange={handleUploadImage}
                                            />

                                            <input
                                                type="file"
                                                hidden
                                                ref={fileInputRef}
                                                onChange={handleUploadFile}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="text-sm focus:outline-none border border-gray-200 rounded-full grow px-4 py-1.5"
                        />

                        <button
                            onClick={handleSendMessage}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                            <LuSendHorizontal size={24} />
                        </button>
                    </div>
                </div>
            )}

            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="fixed z-1000 bottom-5 right-5 
                    w-14 h-14 rounded-full bg-blue-400 
                    flex items-center justify-center
                    hover:bg-blue-500 transition cursor-pointer 
                    border-3 border-white shadow-md shadow-[rgba(2,1,1,.2)]"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <IoIosClose className="text-white w-10 h-10" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                width={100}
                                height={100}
                                src="/assets/images/chat-icon.png"
                                alt="Chat Icon"
                                className="absolute top-[62%] left-[52%] w-10 h-10 object-contain -translate-x-1/2 -translate-y-1/2 rounded-full"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </>
    );
};

export default Chat;
