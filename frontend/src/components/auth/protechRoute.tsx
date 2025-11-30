"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { toast } from "sonner";

interface Props {
    roleAllowed: "User" | "Admin";
    allowGuest?: boolean;
    children: React.ReactNode;
}

export default function ProtectedRoute({ roleAllowed, allowGuest = false, children }: Props) {
    const router = useRouter();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    useEffect(() => {
        if (!userInfo && !allowGuest) {
            // chưa login và không cho guest → redirect login
            router.push("/auth/signin");
            return;
        }

        if (userInfo && userInfo.role !== roleAllowed) {
            // role không đúng → show thông báo
            toast.error(`Bạn không thể vào trang này vì bạn là ${userInfo.role}`);
            if (userInfo.role === "Admin") router.push("/admin/dashboard");
            else router.push("/");
        }
    }, [userInfo, allowGuest]);

    // Nếu cho guest, vẫn render children
    if (userInfo && userInfo.role !== roleAllowed) return null;
    return <>{children}</>;
}
