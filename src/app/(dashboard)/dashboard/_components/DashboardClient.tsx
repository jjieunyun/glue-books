"use client"

import React from 'react'
import Link from 'next/link'
import Bookshelf from './Bookshelf'
import Image from 'next/image'
import logo from '@image/logo.svg';
import Memo from './Memo'
import Card from '../../../components/Card';
import { useUserInfoStore } from '../../../stores/useUserInfoStore';


const currentMonthBook = {
    slug: 'benevolent-discriminator',
    title: '선량한 차별주의자',
    author: 'Kim Ji-hye',
    cover: '📖', // Placeholder for actual image
    description: 'When we believe we are just, we might be discriminating. A sharp critique of the "benevolent" discrimination hidden in our daily lives.'
};

const nextMeeting = {
    date: '2024-06-15',
    dDay: 12,
    location: 'Seochon',
    time: '14:00'
};

export default function DashboardClient() {
    const { userInfo } = useUserInfoStore({ keys: ['userInfo'] });

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-12 ">
            {/* Greeting Area with Memos */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 md:gap-0">

                {/* Left Memo: User Info */}
                <div className="order-2 md:order-1 transform -rotate-2">
                    <Memo title="My Glue" width={320} height={240}>
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="font-bold text-glue-900 text-lg mb-1">{userInfo?.name || 'User'}</p>
                            <p className="text-glue-600 text-sm break-all">{userInfo?.email}</p>
                            <div className="mt-4 text-xs text-glue-500 font-medium bg-glue-100 px-3 py-1 rounded-full">
                                Level 1. Glue Starter
                            </div>
                        </div>
                    </Memo>
                </div>

                {/* Center Logo */}
                <div className="order-1 md:order-2 flex justify-center py-4 md:py-0">
                    <Image src={logo} alt="GlueBooks Logo" width={420} height={420} priority />
                </div>

                {/* Right Memo: Quote */}
                <div className="order-3 md:order-3 transform rotate-2">
                    <Memo title="Today's Glue" width={280} height={180} variant={2}>
                        <div className="flex items-center justify-center h-full p-4 text-center italic text-glue-800 font-bold text-2xl mt-3">
                            "Be Hope!"
                        </div>
                    </Memo>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Next Meeting Card */}
                <Card className="flex flex-col items-center text-center justify-center min-h-[250px]" topBarColor="bg-glue-800">
                    <h2 className="text-[#8D6E63] font-medium uppercase tracking-wider text-xl mb-4">이날에 만나!</h2>
                    <div className="text-6xl font-bold text-[#3E2723] mb-4">
                        D-{nextMeeting.dDay}
                    </div>
                    <p className="text-[#6D4C41] font-medium">{nextMeeting.date} (Sat)</p>
                    {/* <p className="text-[#8D6E63] text-sm">{nextMeeting.time} @ {nextMeeting.location}</p> */}
                </Card>

                {/* This Month's Book Card */}
                <Link
                    href={`/books/${currentMonthBook.slug}`}
                    className="block group hover:shadow-md transition-shadow cursor-pointer"
                >
                    <Card className="flex flex-col min-h-[250px]" topBarColor="bg-glue-200">
                        <h2 className="text-[#8D6E63] font-medium uppercase tracking-wider text-sm mb-4">This Month's Book</h2>

                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {currentMonthBook.cover}
                            </div>
                            <h3 className="text-xl font-bold text-[#3E2723] mb-1 group-hover:text-[#6D4C41] transition-colors">
                                {currentMonthBook.title}
                            </h3>
                            <p className="text-[#8D6E63] text-sm mb-4">{currentMonthBook.author}</p>
                            <p className="text-[#6D4C41] text-sm line-clamp-2 px-4 opacity-80">
                                {currentMonthBook.description}
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <span className="text-xs font-medium text-[#8D6E63] border-b border-[#8D6E63] pb-0.5">View & Write Reviews &rarr;</span>
                        </div>
                    </Card>
                </Link>
            </div>

            <Bookshelf />

            {/* Quick Actions (Optional but helpful) */}
            <div className="mt-12 flex justify-center gap-4">
                <Link href="/books" className="latte-button-outline">
                    Browse Library
                </Link>
            </div>
        </div >
    )
}
