"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import ProtectedRoute from "../auth/protechRoute";

interface Props {
    children: React.ReactNode;
    pathname: string;
}

export default function LayoutContent({ children, pathname }: Props) {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const isAdminRoute = pathname.startsWith("/admin");
    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/information") ||
        pathname.startsWith("/introduction") ||
        pathname.startsWith("/price") ||
        pathname.startsWith("/success") ||
        pathname.startsWith("/fail") ||
        pathname.startsWith("/notfound");

    // Public pages
    if (isPublicRoute) return <AnimatePresence mode="wait"><div key={pathname}><Header />{children}<Footer /></div></AnimatePresence>;

    // Admin pages
    if (isAdminRoute) return <ProtectedRoute roleAllowed="Admin"><AnimatePresence mode="wait"><div key={pathname}>{children}</div></AnimatePresence></ProtectedRoute>;

    // User pages (cho cả chưa login)
    if (!isAdminRoute) {
        if (userInfo?.role === "Admin") return null; // Admin không xem public
        return (
            <>
                <Header />
                <AnimatePresence mode="wait">
                    <div key={pathname}>{children}</div>
                </AnimatePresence>
                <Footer />
            </>
        );
    }

    return null;
}
