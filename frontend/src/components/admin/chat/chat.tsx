"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search, Send, Paperclip, MoreVertical, Phone, Video,
  Smile, Image as ImageIcon, Search as SearchIcon, CheckCheck,
} from "lucide-react";
import axios from "axios";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { addHours, format, parseISO } from "date-fns";
import { FaCirclePlus } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import * as signalR from "@microsoft/signalr";
import { createChatConnection } from "@/components/shared/signalR/connection";
import { handleDownload } from "@/components/shared/cloudinary/download";
import handleUploadMessage from "@/components/shared/cloudinary/upload-message";

const INITIAL_MESSAGES = [
  { id: 1, sender: "user", text: "Chào admin, tôi cần hỗ trợ chút.", time: "10:28" },
  { id: 2, sender: "me", text: "Chào bạn, tôi có thể giúp gì?", time: "10:29" },
  { id: 3, sender: "user", text: "Tôi muốn rút tiền nhưng hệ thống báo lỗi.", time: "10:30" },
  { id: 4, sender: "user", text: "Bạn kiểm tra giúp tôi với.", time: "10:30" },
];

const ChatAdmin = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [selectedContact, setSelectedContact] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);
  const [inputMsg, setInputMsg] = useState("");
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [chatRooms, setChatRooms] = useState<any>([]);
  const connection = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!userInfo?.Id) return;
    loadData();
    if (accessToken) {
      handleGetAllRooms();
    }
  }, [userInfo?.Id, accessToken]);

  const loadData = async () => {
    const token = await GetAccessToken(userInfo?.Id);
    if (token) setAccessToken(token);
  }

  const handleSendMessage = async (
    e?: React.FormEvent,
    content?: string | { url: string; name?: string },
    typeMessage?: "text" | "image" | "file"
  ) => {
    if (e) e.preventDefault();
    if (!connection.current) return;

    let messageToSend;
    let type: "text" | "image" | "file" = typeMessage || "text";

    if (typeof content === "string") {
      if (!content.trim()) return;
      messageToSend = content;
    } else if (content && typeof content === "object") {
      messageToSend = JSON.stringify(content);
      if (!typeMessage) {
        type = content.url?.match(/\.(jpeg|jpg|gif|png|webp)$/i)
          ? "image"
          : "file";
      }
    } else if (!inputMsg.trim()) {
      return;
    }

    try {
      const payload = {
        message: messageToSend || inputMsg,
        targetId: selectedContact.isGuest
          ? selectedContact.id
          : selectedContact.guestId,
        guestId: selectedContact.isGuest ? selectedContact.guestId : "",
        typeMessage: type,
        sender: "me",
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_URL_API}Chat/SendMessage`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      connection.current?.invoke(
        "SendMessage",
        selectedContact.id,
        payload.message,
        type
      );

      if (!content) setInputMsg("");
    } catch (err) {
      console.log("Send message error:", err);
    }
  };


  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
    handleGetChatByRoomId(contact);
  };

  const handleGetAllRooms = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_URL_API}ChatRoom/GetChatRooms`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(res => {
        setChatRooms(res.data.data);
      }).catch(err => {
        console.log(err);
      })
  }

  const handleGetChatByRoomId = async (contact: any) => {
    try {
      let url = "";
      if (contact.isGuest) {
        url = `${process.env.NEXT_PUBLIC_URL_API}Chat/GetHistory?GuestId=${contact.id}`;
      } else {
        url = `${process.env.NEXT_PUBLIC_URL_API}Chat/GetHistory?TargetId=${contact.id}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const chatData = res.data.data || [];
      const messagesFormatted = chatData.map((msg: any) => {
        let parsedContent;
        try {
          parsedContent = JSON.parse(msg.message);
        } catch {
          parsedContent = msg.message; // nếu không phải JSON thì giữ nguyên text
        }
        return {
          id: msg.id,
          sender: msg.isAdminSender ? "me" : "user",
          text: parsedContent.url ? parsedContent.url : parsedContent,
          url: parsedContent.url, // lấy url nếu là object
          fileName: parsedContent.name || "", // nếu là file
          type: msg.typeMessage,
          time: format(addHours(msg.timestamp, 7), 'HH:mm')
        };
      });

      setMessages(messagesFormatted);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!userInfo?.Id && !selectedContact) return;

    const init = async () => {
      const token = await GetAccessToken(userInfo.Id);
      setAccessToken(token);

      if (selectedContact) {
        // console.log(selectedContact?.guestId);
        const conn = createChatConnection(selectedContact?.guestId);
        await conn.start();
        conn.on("ReceiveMessage", (msg) => {
          setMessages((prev: any) => {
            if (msg.id && prev.some((m: any) => m.id === msg.id)) {
              return prev;
            }
            let parsedContent;
            try {
              parsedContent = JSON.parse(msg.message);
            } catch {
              parsedContent = msg.message;
            }


            if (!msg.id && prev.some((m: any) =>
              m.text === parsedContent.url ? parsedContent.url : parsedContent &&
                m.url === (msg.type === 'image' ? JSON.parse(msg.message).url : '') &&
                m.time === msg.timestamp ? format(addHours(new Date(msg.timestamp), 7), "HH:mm") : format(addHours(new Date(), 7), "HH:mm") &&
              m.sender === (msg.isAdminSender ? "me" : "user")
            )) {
              return prev;
            }
            return [...prev, {
              id: msg.id || Date.now(),
              sender: msg.isAdminSender ? "me" : "user",
              text: parsedContent.url ? parsedContent.url : parsedContent,
              url: parsedContent.url || "",
              fileName: parsedContent.name || "",
              type: msg.typeMessage,
              time: msg.timestamp ? format(addHours(new Date(msg.timestamp), 7), "HH:mm") : format(addHours(new Date(), 7), "HH:mm")
            }];
          });
        });
        connection.current = conn;
      }
    };
    init();
    return () => {

    };
  }, [selectedContact]);

  useEffect(() => {
    if (!selectedContact?.guestId || !connection.current) return;
    // console.log("ADMIN JOIN GROUP", selectedContact.guestId);
    connection.current.invoke("JoinRoom", selectedContact.guestId);
  }, [selectedContact]);

  return (
    <div className="flex h-[725px] font-sans overflow-hidden">
      <main className="flex-1 flex h-full">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đoạn chat</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm trên Messenger..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatRooms.map((contact: any) => (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={`flex items-center gap-3 p-3 mx-2 mt-1 rounded-lg cursor-pointer transition-colors ${selectedContact.id === contact.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
                  }`}
              >
                <div className="relative">
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    width={48} height={48}
                    className="rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`text-sm truncate ${selectedContact.id === contact.id ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-400">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${contact.unread > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                      {contact.msg}
                    </p>
                    {contact.unread > 0 && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {selectedContact ? (
          <div className="flex-1 flex flex-col bg-white h-full relative">
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={selectedContact?.avatar}
                    alt={selectedContact?.name}
                    width={40} height={40}
                    className="rounded-full object-cover"
                  />
                  {selectedContact?.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{selectedContact.name}</h3>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    {selectedContact.online ? "Đang hoạt động" : "Hoạt động 5 phút trước"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-blue-600">
                <button className="p-2 hover:bg-blue-50 rounded-full transition"><Phone size={20} /></button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition"><Video size={22} /></button>
                <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-full transition"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-200">
              <div className="text-center text-xs text-gray-400 my-4">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center mt-20">Chưa có tin nhắn</div>
                ) : (
                  messages.map((msg: any, index: number) => {
                    const isMe = msg.sender === "me";
                    const nextMsg = messages[index + 1];
                    const isLastFromSender = !nextMsg || nextMsg.sender !== msg.sender;

                    let messageContent;

                    switch (msg.type) {
                      case "image":
                        messageContent = (
                          <Image
                            width={1000}
                            height={500}
                            src={msg.text}
                            alt="image"
                            className="max-w-xs max-h-40 rounded-xl object-cover"
                          />
                        );
                        break;
                      case "file":
                        messageContent = (
                          <button
                            onClick={() => handleDownload(msg.text, msg.fileName || msg.text.split("/").pop()!)}
                            className="flex items-center gap-2 rounded-lg cursor-pointer"
                          >
                            <Paperclip size={16} /> {msg.fileName || msg.text.split("/").pop()}
                          </button>
                        );
                        break;
                      default:
                        messageContent = msg.text;
                    }


                    return (
                      <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start items-center"}`}>
                        {!isMe && (
                          <div className={`mr-3 ${!isLastFromSender ? "invisible" : ""}`}>
                            <Image
                              src={selectedContact.avatar}
                              width={32}
                              height={32}
                              alt="avatar"
                              className="w-full h-full max-h-50 rounded-full mb-2 border border-gray-300"
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-start">
                          <div className={`${msg.type !== "image" && 'px-3 py-2'} rounded-2xl text-sm leading-relaxed shadow-sm 
                            ${msg.type === "image"
                              ? ""
                              : isMe
                                ? "bg-blue-600 text-white rounded-tr-sm self-end"
                                : "bg-gray-100 text-gray-800 rounded-tl-sm"
                            }`}
                          >
                            {messageContent}
                          </div>
                          {isLastFromSender && (
                            <div className={`w-full flex mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })

                )}
              </div>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition"><FaCirclePlus size={20} /></button>
                  <input
                    type="file"
                    accept="image/*"
                    id="imageInput"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploaded = await handleUploadMessage(file);
                      if (!uploaded) return;

                      handleSendMessage(undefined, { url: uploaded.url, name: uploaded.originalName }, "image");
                    }}
                  />
                  <label htmlFor="imageInput" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                    <ImageIcon size={20} />
                  </label>

                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const uploaded = await handleUploadMessage(file);
                      if (!uploaded) return;

                      handleSendMessage(undefined, { url: uploaded.url, name: uploaded.originalName }, "file");
                    }}
                  />
                  <label htmlFor="fileInput" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                    <Paperclip size={20} />
                  </label>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-100 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition">
                    <Smile size={20} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-200"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 text-2xl font-medium font-mono">
            <IoChatboxEllipsesOutline />
            Đoạn chat AutoBot</div>
        )}
      </main>
    </div>
  );
};

export default ChatAdmin;