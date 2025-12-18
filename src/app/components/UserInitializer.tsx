'use client';

import { useUserInfoStore } from '@stores/useUserInfoStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const UserInitializer = () => {
    const { getUserInfo } = useUserInfoStore({ keys: ['getUserInfo'] });
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        if (pathname === '/login' || pathname.startsWith('/auth')) {
            return;
        }

        getUserInfo();
    }, [pathname, getUserInfo]);

    return null;
};

export default UserInitializer;
