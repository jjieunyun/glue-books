"use client";

import { useState } from 'react';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import { login } from '@api/auth';
import { useUserInfoStore } from '../../../stores/useUserInfoStore';

export default function useLogin() {
    const router = useRouter();
    const { setUserInfo } = useUserInfoStore({ keys: ['setUserInfo'] });

    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            const token = await user.getIdToken();

            // iron-session에 토큰 저장 요청
            const res = await login({ payload: { token, email: user.email || '' } });

            if (res?.ok) {
                setUserInfo({
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    picture: user.photoURL,
                });
                router.push('/dashboard');
            } else {
                alert('로그인에 실패했습니다.');
            }
        } catch (error: any) {
            if (error.code === 'auth/cancelled-popup-request') {
                console.log('Popup closed by user');
            } else {
                console.error("Google login error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handlers: {
            handleGoogleLogin
        },
        state: {
            isLoading
        }
    };
}