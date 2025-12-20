'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import folder from '@image/dashboard/folder.svg';
import calendar from '@image/dashboard/ic-calendar.png';

interface MonthlyBook {
    id: string;
    month: string;
    year: number;
    title: string;
    cover: string;
    slug: string;
}

const monthlyBooks: MonthlyBook[] = [
    { id: '1', month: '12월', year: 2024, title: '선량한 차별주의자', cover: '📘', slug: 'benevolent-discriminator' },
    { id: '2', month: '11월', year: 2024, title: '불편한 편의점 2', cover: '📗', slug: 'uncomfortable-convenience-store-2' },
    { id: '3', month: '10월', year: 2024, title: '아몬드', cover: '📙', slug: 'almond' },
    { id: '4', month: '9월', year: 2024, title: '죽고 싶지만 떡볶이는 먹고 싶어', cover: '📕', slug: 'i-want-to-die-but-i-want-to-eat-tteokbokki' },
    { id: '5', month: '8월', year: 2024, title: '미드나잇 라이브러리', cover: '📔', slug: 'midnight-library' },
    { id: '6', month: '7월', year: 2024, title: '파친코', cover: '📓', slug: 'pachinko' },
];

export default function MonthlyBooks() {
    return (
        <div className="w-full h-full flex flex-col py-4">
            {/* Horizontal Scrolling Monthly Books */}
            <div className="flex h-full items-end gap-6">
                <Link
                    href="/books/monthly"
                    className="shrink-0 w-40 px-2 text-glue-100 font-schoolbell font-bold text-3xl mb-4 hover:text-white transition-colors uppercase tracking-wider flex flex-col justify-start items-start gap-y-3 group gap-x-2"
                >
                    <Image src={calendar} alt="calendar" width={24} height={24} />
                    Monthly Picks
                </Link>
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-6 h-full items-end pb-2">
                        {monthlyBooks.map((book) => (
                            <Link
                                key={book.id}
                                href={`/books/${book.slug}`}
                                className="shrink-0 group/month cursor-pointer"
                            >
                                <div className="relative w-32 h-40 flex flex-col">
                                    {/* Month Label */}
                                    <div className="text-glue-400 text-xs font-medium mb-1 text-center">
                                        {book.year}년 {book.month}
                                    </div>

                                    {/* Book Cover */}
                                    <div className="flex-1 w-full bg-linear-to-br from-glue-400 to-glue-600 rounded shadow-lg flex items-center justify-center text-4xl transform group-hover/month:scale-105 transition-all duration-300 relative">
                                        {book.cover}

                                        {/* Dark Overlay with Title on Hover */}
                                        <div className="absolute inset-0 bg-black/70 rounded opacity-0 group-hover/month:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                                            <p className="text-white text-xs font-semibold text-center leading-snug">
                                                {book.title}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Book Spine Shadow */}
                                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-black/30 rounded-full blur-sm"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
