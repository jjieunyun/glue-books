"use client";

import IconHeart from "@image/books/icon-heart.svg";
import IcArrow from "@image/ic-arrow.svg";
import Image from "next/image";
import Link from "next/link";
import type { PastBook } from "../_hooks/useBooks";

interface BookCardProps {
    book: PastBook;
}

const formatMeetingDate = (value: string | null) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${year}-${month}`;
};

function RatingRow({
    label,
    count,
    bookId,
}: {
    label: string;
    count: number | null;
    bookId: string;
}) {
    const heartKeys = Array.from(
        { length: count ?? 0 },
        (_, i) => `${bookId}-${label}-heart-${i}`,
    );

    return (
        <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 font-schoolbell rounded-full bg-[#EFEBE9] text-[#6D4C41] flex items-center justify-center font-bold text-[12px]">
                {label}
            </span>
            <span className="flex items-center gap-0.5">
                {heartKeys.map((heartKey) => (
                    <Image
                        key={heartKey}
                        src={IconHeart}
                        alt="Heart"
                        width={12}
                        height={12}
                    />
                ))}
            </span>
        </div>
    );
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <Link
            href={`/books/${book.id}`}
            className="latte-card  flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden"
        >
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-glue-800 group-hover:bg-[#8D6E63] transition-colors"></div>

            <div className="flex-shrink-0 w-16 h-23 bg-[#FDFBF7] rounded-lg border border-[#EFEBE9] flex items-center justify-center text-3xl overflow-hidden">
                {book.cover ? (
                    <Image
                        src={book.cover}
                        alt={book.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                        unoptimized
                    />
                ) : (
                    "📚"
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-xl font-bold text-[#3E2723] truncate group-hover:text-[#6D4C41] transition-colors">
                        {book.title}
                    </h3>
                    {(book.meetingDate || book.year) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#EFEBE9] text-[#6D4C41]">
                            {book.meetingDate
                                ? formatMeetingDate(book.meetingDate)
                                : book.year}
                        </span>
                    )}
                </div>
                <p className="text-sm text-[#8D6E63] truncate">
                    {book.author || "저자 미상"} · {book.publisher || "출판사 미상"}
                </p>
            </div>

            <div className="hidden sm:flex items-center justify-between gap-4 text-xs w-30">
                <div className="flex flex-col items-start gap-1">
                    <RatingRow label="J" count={book.ratings.jane} bookId={book.id} />
                    <RatingRow label="C" count={book.ratings.cardy} bookId={book.id} />
                    <RatingRow label="M" count={book.ratings.mihak} bookId={book.id} />
                </div>
                <div className="text-[#D7CCC8] text-2xl">
                    <Image src={IcArrow} alt="Arrow" width={20} height={20} />
                </div>
            </div>
        </Link>
    );
}
