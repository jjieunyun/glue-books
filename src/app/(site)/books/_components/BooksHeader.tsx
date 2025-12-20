"use client";

import BookCat from "@image/books/cat_cup.svg";
import IconX from "@image/ic-close.svg";
import IcSearch from "@image/ic-search.svg";
import Image from "next/image";

interface BooksHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onClearSearch: () => void;
}

export default function BooksHeader({
    searchQuery,
    onSearchChange,
    onClearSearch,
}: BooksHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
                <Image src={BookCat} alt="Book Cat" width={80} height={80} className="mb-4" />
                <h1 className=" text-glue-950 font-schoolbell text-5xl mb-1">
                    GlueBooks Library
                </h1>
                <p className="text-glue-400 font-schoolbell text-md">
                    Our shared reading history since 2024.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        placeholder="제목이나 저자를 검색하세요"
                        className="w-full rounded-full border border-glue-200 bg-white px-11 py-2.5 text-glue-950 font-schoolbell text-sm shadow-sm outline-none transition focus:border-glue-500 focus:bg-white focus:ring-2 focus:ring-glue-200"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        aria-label="도서 검색"
                    />
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-glue-500 text-base">
                        <Image src={IcSearch} alt="Search" width={20} height={20} />
                    </span>
                    {searchQuery.length > 0 && (
                        <button
                            type="button"
                            onClick={onClearSearch}
                            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-full bg-glue-100 px-2 py-1 text-xs font-schoolbell text-glue-700 hover:bg-glue-200 transition focus:outline-none focus-visible:outline-none"
                            aria-label="검색어 지우기"
                        >
                            <Image src={IconX} alt="Close" width={18} height={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
