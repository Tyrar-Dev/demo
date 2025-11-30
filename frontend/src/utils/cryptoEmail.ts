import CryptoJS from "crypto-js";
import { toast } from "sonner";

export const encryptEmail = (email: string) => {
    if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
        toast.error("Lỗi hệ thống, không thể gửi OTP!");
        return;
    }
    return CryptoJS.AES.encrypt(email, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
};

export const decryptEmail = (cipher: string) => {
    if (!process.env.NEXT_PUBLIC_SECRET_KEY) {
        toast.error("Lỗi hệ thống, không thể gửi OTP!");
        return;
    }
    const bytes = CryptoJS.AES.decrypt(cipher, process.env.NEXT_PUBLIC_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};