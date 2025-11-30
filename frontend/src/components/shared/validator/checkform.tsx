import { toast } from "sonner";

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPhoneNumberValid = (value: string): boolean => {
    if (!/^\d{10}$/.test(value)) return false;
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return regex.test(value);
};

export const isUserNameValid = (username: string): boolean => {
    if (!username || username.trim() === "") return false;
    const regex = /^[a-zA-Z0-9_.]+$/;
    if (!regex.test(username)) {
        toast.error("Tên đăng nhập không được chứa ký tự đặc biệt!");
        return false;
    }
    return true;
};

export const isPasswordValid = (password: string) => password.length >= 8;