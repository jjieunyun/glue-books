"use client";

import Link from 'next/link';
import ImageLogo from '@image/logo.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { logout } from '@api/auth';
import IconLogout from '@image/ic-logout.svg'
import IcUser from '@image/ic-account.svg';
import { useUserInfoStore } from '../stores/useUserInfoStore';
import { useState, useRef } from 'react';

export default function Navbar() {
    const router = useRouter();
    const { setUserInfo, userInfo } = useUserInfoStore({ keys: ['setUserInfo', 'userInfo'] });

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            const response = await logout();

            if (response.ok) {
                setUserInfo(null);
                router.replace('/login');
                router.refresh();
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FDFBF7]/10 shadow-md transition-all duration-300">
            <div className="max-w-[1280px] mx-auto sm:px-6 px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Image src={ImageLogo} alt="GlueBooks Logo" width={80} height={80} />
                    </div>
                    <div className="hidden sm:flex space-x-8">
                        <NavLink href="/dashboard">Dashboard</NavLink>
                        <NavLink href="/books">Library</NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        <UserButton userInfo={userInfo} onLogout={handleSignOut} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-[#8D6E63] hover:text-[#4E342E] hover:border-[#6D4C41] transition-colors"
        >
            {children}
        </Link>
    );
}

const UserButton = ({ userInfo, onLogout }: { userInfo: any, onLogout: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="cursor-pointer flex items-center gap-x-2 rounded-full hover:bg-brand-50 transition-colors"
                onClick={handleClick}
            >
                <span className="text-brand-900 text-md font-bold">{userInfo?.name}</span>
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-200">
                    <Image
                        src={userInfo?.picture || IcUser}
                        alt="User"
                        fill
                        className="object-cover"
                    />
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[240px] rounded-2xl bg-white shadow-lg border border-brand-100 ring-1 ring-black/5 flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-brand-100 flex flex-col items-center gap-3 bg-brand-50/30">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-200 shadow-sm">
                            <Image
                                src={userInfo?.picture || IcUser}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center mt-1">
                            <p className="text-brand-950 font-bold text-lg leading-tight">{userInfo?.name || 'User'}</p>
                            <p className="text-brand-950 text-sm font-medium mt-1">{userInfo?.email}</p>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="p-2">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-x-2 px-4 py-2.5 text-sm font-medium text-brand-800 hover:bg-brand-50 hover:text-brand-950 rounded-xl transition-all cursor-pointer"
                        >
                            <Image src={IconLogout} alt="Logout" width={18} height={18} className="opacity-70" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}