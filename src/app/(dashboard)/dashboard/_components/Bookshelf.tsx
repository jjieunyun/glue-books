'use client';

import React from 'react';

interface BookshelfProps {
    children?: React.ReactNode;
    bottomSection?: React.ReactNode;
}

export default function Bookshelf() {
    return (
        <div className="w-full max-w-[1280px] mx-auto">
            {/* 책장 전체 틀 */}
            <div className="relative bg-[#3d2b1f] border-t-8 border-x-8 border-[#2c1e16] shadow-2xl rounded-sm">

                {/* 선반 반복 (3단 예시) */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="relative group">
                        {/* 책이 들어갈 빈 공간 (높이 조절 가능) */}
                        <div className="h-48 w-full bg-gradient-to-b from-[#1a120b] to-[#2c1e16] overflow-hidden">
                            {/* 여기에 나중에 <Book /> 컴포넌트를 배치할 수 있습니다 */}
                        </div>

                        {/* 선반 나무 판자 (입체감 효과) */}
                        <div className="relative h-6 w-full bg-[#4e3629] shadow-inner">
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
