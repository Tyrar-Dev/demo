'use client';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { FC } from 'react';
import { toast } from 'sonner';
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

interface GoogleLoginButtonProps { }

const GoogleLoginButton: FC<GoogleLoginButtonProps> = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const { credential } = credentialResponse;
            if (!credential) return;

            const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/GoogleLogin`, { idToken: credential });
            if (res && res.data.status === 200) {
                const { accessToken, refreshToken } = res.data.data;
                const decoded: CustomJwtPayload = jwtDecode(accessToken);

                Cookies.set("accessToken", accessToken, { expires: 1 });
                Cookies.set("refreshToken", refreshToken, { expires: 7 });

                dispatch(setUser({
                    accessToken,
                    refreshToken,
                    userInfo: decoded
                }));
                router.push('/');
            }
        } catch (error) {
            console.error('Login error', error);
        }
    };


    const handleLoginError = () => {
        console.error('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId={'117306231770-1de02hun2vsshqi60sp9ki1aj83o8vtp.apps.googleusercontent.com'}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
