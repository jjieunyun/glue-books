"use client";

import bag from "@image/dashboard/ic-bag.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface Book {
    id: string;
    title: string;
    cover: string;
    meetingDate: string;
}

export default function PastBooks({
    pastBookList,
    isLoading = false,
}: {
    pastBookList: Book[];
    isLoading?: boolean;
}) {
    return (
        <div className="w-full h-full flex flex-col py-4">
            {/* Horizontal Scrolling Book Covers */}
            <div className="flex h-full items-end gap-6">
                <div className="shrink-0 w-[160px] h-full">
                    <Link
                        href="/books"
                        className="px-2 text-glue-100 font-schoolbell font-bold text-3xl mb-4 hover:text-white transition-colors uppercase tracking-wider flex flex-col justify-start items-start gap-y-3 group gap-x-2"
                    >
                        <Image src={bag} alt="folder" width={25} height={25} />
                        Past Books
                    </Link>
                </div>
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    {isLoading ? (
                        <div className="h-full w-full flex items-center justify-center mb-15">
                            <LoadingSpinner size="sm" />
                        </div>
                    ) : (
                        <div className="flex gap-6 h-full items-end pb-2">
                            {pastBookList.map((book) => (
                                <Link
                                    key={book.id}
                                    href={`/books/${book?.id}`}
                                    className="shrink-0 group/book cursor-pointer"
                                >
                                    <div className="relative w-28 h-40">
                                        <div className="w-full h-full rounded shadow-lg overflow-hidden transform group-hover/book:scale-105 transition-all duration-300">
                                            {book.cover ? (
                                                <Image
                                                    src={book.cover}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="112px"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-linear-to-br from-glue-300 to-glue-500 flex items-center justify-center text-3xl">
                                                    📖
                                                </div>
                                            )}

                                            {/* Dark Overlay with Title on Hover */}
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/book:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                                                <p className="text-white text-sm font-semibold text-center leading-snug">
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
                    )}
                </div>
            </div>
        </div>
    );
}
