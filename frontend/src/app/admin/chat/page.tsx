import ChatAdmin from "@/components/admin/chat/chat";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Trang tin nhắn Admin - AutoBot Phái Sinh',
    description: 'Trang tin nhắn Admin AutoBot - Cho thuê bot chứng khoán phái sinh'
}

const ChatPage = () => {
    return (
        <div>
            <ChatAdmin />
        </div>
    )
}

export default ChatPage;