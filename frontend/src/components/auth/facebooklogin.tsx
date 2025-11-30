'use client';
import React, { useState, useEffect } from 'react';
import FacebookLogin, { SuccessResponse } from '@greatsumini/react-facebook-login';
import axios from 'axios';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface CustomJwtPayload extends JwtPayload {
    role: string;
}

const FacebookLoginButton = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [message, setMessage] = useState<{ text: string, severity: 'error' | 'success' }>();
    const handleLoginSuccess = async (res: SuccessResponse) => {
        const credential = res;
        if (credential) {
            await axios.post(`${process.env.NEXT_PUBLIC_URL_API}Authen/FacebookLogin`, { idToken: credential.accessToken })
                .then(res => {
                    console.log(res.data);
                    if (res && res.data.status === 200) {
                        const { accessToken, refreshToken } = res.data;
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
                }).catch(err => {
                    const currentDate = new Date();
                    const formattedDate = formatDate(currentDate, "EEEE, MMMM dd, yyyy 'at' hh:mm a");
                    toast.success(`This is an admin account, you can\'t log in with Facebook with this email`, {
                        description: formattedDate,
                        action: {
                            label: `Undo`,
                            onClick: () => console.log(`Undo`),
                        },
                    });
                })
        }
    }
    return (
        <div>
            <FacebookLogin
                appId='3338324102972159'
                onSuccess={res => {
                    handleLoginSuccess(res);
                }}
                onFail={err => {
                    setMessage({ text: 'Error occured', severity: 'error' });
                }}
                onProfileSuccess={response => {

                }}
                render={({ onClick }) => (
                    <button className='w-full h-[42.6px]' onClick={onClick}>Login</button>
                )}
            />
        </div>
    )
}

export default FacebookLoginButton;