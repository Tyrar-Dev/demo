import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { GetAccessToken } from "@/components/shared/token/accessToken";
import { RootState } from "@/redux/store";

export const useAutoLogin = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [accessToken, setAccessToken] = useState<string>('');

    const loadData = async () => {
            const token = await GetAccessToken(userInfo?.Id);
            if (token) setAccessToken(token);
        };

    useEffect(() => {
        const refreshToken = Cookies.get("refreshToken");

        if (accessToken && refreshToken) {
            try {
                const decoded = jwtDecode(accessToken);
                dispatch(
                    setUser({
                        accessToken,
                        refreshToken,
                        userInfo: decoded,
                    })
                );
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                dispatch(clearUser());
            }
        }
        loadData();
    }, [dispatch]);
};
