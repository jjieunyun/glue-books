'use client';

import Image from "next/image";
import memoBg from '@image/dashboard/paper.png';
import Memo2 from '@image/dashboard/paper3.png'

interface MemoProps {
    children?: React.ReactNode;
    className?: string;
    title?: string;
    width?: number;
    height?: number;
    variant?: 1 | 2;
}

export default function Memo({
    children,
    className = "",
    title,
    width = 300,
    height = 300,
    variant = 1
}: MemoProps) {
    const bgImage = variant === 2 ? Memo2 : memoBg;

    return (
        <div
            className={`relative flex flex-col items-start justify-start ${className}`}
            style={{ width, height }}
        >
            {/* Background Paper Image */}
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-none select-none">
                <Image
                    src={bgImage}
                    alt="Memo Paper"
                    fill
                    className="object-contain drop-shadow-md"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                />
            </div>

            {/* Content Area - centered and padded to stay within the "paper" visual area */}
            <div className="relative z-10 w-full h-full p-12 flex flex-col font-schoolbell">
                {title && (
                    <div className=" text-center border-b-3 border-glue-200/50 pb-0 mx-4">
                        <h3 className="text-lg text-glue-900 tracking-tight">{title}</h3>
                    </div>
                )}

                <div className="flex-1 w-full overflow-y-auto scrollbar-hide text-sm text-glue-800 leading-relaxed px-2">
                    {children}
                </div>
            </div>
        </div>
    );
}