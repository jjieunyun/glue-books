"use client"

import React, { Component } from 'react'
import Link from 'next/link'
import Bookshelf from './Bookshelf'


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


export default class DashboardClient extends Component {
    render() {
        return (
            <div className="max-w-[800px] mx-auto px-6 py-12 ">
                {/* Greeting */}
                <h1 className="latte-h1 text-center mb-12">
                    Welcome to GlueBooks ☕️
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Next Meeting Card */}
                    <div className="latte-card flex flex-col items-center text-center justify-center min-h-[250px] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#8D6E63]"></div>
                        <h2 className="text-[#8D6E63] font-medium uppercase tracking-wider text-sm mb-2">Next Meeting</h2>
                        <div className="text-6xl font-bold text-[#3E2723] mb-4">
                            D-{nextMeeting.dDay}
                        </div>
                        <p className="text-[#6D4C41] font-medium">{nextMeeting.date} (Sat)</p>
                        <p className="text-[#8D6E63] text-sm">{nextMeeting.time} @ {nextMeeting.location}</p>
                    </div>

                    {/* This Month's Book Card */}
                    <Link
                        href={`/books/${currentMonthBook.slug}`}
                        className="latte-card flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer min-h-[250px]"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#D7CCC8]"></div>
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
                    </Link>
                </div>

                <Bookshelf>
                    ㅇㄹㄴㅇㄹ
                </Bookshelf>


                {/* Quick Actions (Optional but helpful) */}
                <div className="mt-12 flex justify-center gap-4">
                    <Link href="/books" className="latte-button-outline">
                        Browse Library
                    </Link>
                </div>
            </div>
        )
    }
}
