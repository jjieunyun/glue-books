'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import movement from '@image/dashboard/ic-movement.svg';
import chevron from '@image/chevron.svg'

interface Member {
    id: string;
    username: string;
    displayName: string;
    emoji: string;
    bookCount: number;
}

const members: Member[] = [
    { id: '1', username: 'jane', displayName: 'Jane', emoji: '🦊', bookCount: 24 },
    { id: '2', username: 'cardi', displayName: 'Cardi', emoji: '🐰', bookCount: 18 },
    { id: '3', username: 'mihak', displayName: 'Mihak', emoji: '🐻', bookCount: 31 },
];

export default function MemberShelves() {
    return (
        <div className="w-full h-full flex flex-col py-4">
            {/* Member Cards */}
            <div className="flex-1 flex gap-8 items-center justify-start w-full">
                <Link
                    href="/members"
                    className="w-40 px-2 text-glue-100 font-schoolbell font-bold text-3xl mb-4 hover:text-white transition-colors uppercase tracking-wider flex flex-col justify-start items-start gap-y-3 group gap-x-2"
                >
                    <Image src={movement} alt="movement" width={24} height={24} />
                    Our Shelves
                </Link>
                {members.map((member) => (
                    <Link
                        key={member.id}
                        href={`/shelf/${member.username}`}
                        className="group/member cursor-pointer"
                    >
                        <div className="flex items-center gap-4 bg-glue-800/50 hover:bg-glue-700/60 rounded-xl px-6 py-4 transition-all duration-300 border border-glue-600/30 hover:border-glue-500/50 group-hover/member:scale-105 transform">
                            {/* Avatar */}
                            <div className="w-14 h-14 rounded-full bg-linear-to-br from-glue-300 to-glue-500 flex items-center justify-center text-3xl shadow-lg">
                                {member.emoji}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col">
                                <span className="text-glue-100 font-bold text-lg">
                                    {member.displayName}
                                </span>
                                <span className="text-glue-400 text-sm">
                                    @{member.username}
                                </span>
                                <span className="text-glue-500 text-xs mt-1">
                                    📚 {member.bookCount} books
                                </span>
                            </div>

                            {/* Arrow */}
                            <div className="ml-4 text-glue-400 group-hover/member:text-glue-200 group-hover/member:translate-x-1 transition-all">
                                <Image src={chevron} alt="chevron" width={20} height={20} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
