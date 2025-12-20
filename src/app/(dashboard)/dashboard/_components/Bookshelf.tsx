'use client';

import React from 'react';

interface BookshelfProps {
    children?: React.ReactNode;
    className?: string;
    rows?: number;
    shelfHeights?: (number | string)[];
    shelfContents?: React.ReactNode[];
}

export default function Bookshelf({
    rows = 3,
    shelfHeights,
    shelfContents,
    className = ""
}: BookshelfProps) {
    // shelves configuration
    const shelves = React.useMemo(() => {
        if (shelfHeights && shelfHeights.length > 0) {
            return shelfHeights;
        }
        return Array(rows).fill('192px'); // Default h-48 equivalent
    }, [rows, shelfHeights]);

    return (
        <div className={`w-full max-w-[1280px] mx-auto ${className}`}>
            {/* 책장 전체 틀 */}
            <div className="relative bg-[#3d2b1f] border-t-8 border-x-8 border-[#2c1e16] shadow-2xl rounded-2xl">

                {/* 선반 반복 */}
                {shelves.map((height, i) => (
                    <div key={i} className="relative group">
                        {/* 책이 들어갈 빈 공간 (높이 조절 가능) */}
                        <div
                            className="w-full bg-gradient-to-b from-[#1a120b] to-[#2c1e16] overflow-hidden transition-all duration-300 ease-in-out flex items-center px-4"
                            style={{ height: typeof height === 'number' ? `${height}px` : height }}
                        >
                            {shelfContents && shelfContents[i] ? shelfContents[i] : null}
                        </div>

                        {/* 선반 나무 판자 (입체감 효과) */}
                        <div className="relative h-6 w-full bg-[#4e3629] shadow-inner z-10">
                            {/* 선반의 두께감과 그림자 표현 */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10" />
                            <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/20" />

                            {/* 나무 나뭇결 느낌을 위한 미세한 패턴 (선택사항) */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                        </div>
                    </div>
                ))}

                {/* 바닥 지지대 */}
                <div className="h-4 w-full bg-[#1a120b]" />
            </div>
        </div>
    );
}
