"use client";

import IconHeart from "@image/books/icon-heart.svg";
import IcArrow from "@image/ic-arrow.svg";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import useBookDetails, {
    type BookDetails,
    type OneLineReviews,
} from "../_hooks/useBookDetails";

const formatMeetingDate = (value: string | null) => {
    if (!value) return "";
    const [year, month] = value.split("-");
    if (!year || !month) return value;
    return `${year}-${month}`;
};

export default function BookDetailClient({ id }: { id?: string }) {
    const params = useParams<{ id: string }>();
    const bookId = id ?? params?.id;
    const {
        states: { bookDetails, isLoading, oneLineReviews, isOneLineReviewsLoading },
    } = useBookDetails({ id: bookId });

    const book = bookDetails as BookDetails | null;
    const reviews = oneLineReviews as OneLineReviews | null;

    return (
        <section
            className="max-w-[1100px] mx-auto px-6 py-12"
            data-book-id={bookId}
        >
            <Link
                href="/books"
                className="text-glue-950 flex gap-x-2 items-center hover:text-[#5D4037] mb-6 font-schoolbell text-xl font-bold"
            >
                <Image src={IcArrow} alt="Arrow" width={20} height={20} className="rotate-180" />
                <span>Back to Library</span>
            </Link>

            {isLoading ? (
                <div className="py-20 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            ) : !book ? (
                <div className="text-center py-20 text-[#8D6E63] border border-dashed border-[#EFEBE9] rounded-xl">
                    책 정보를 불러오지 못했어요.
                </div>
            ) : (
                <>
                    <BookInfo book={book} />
                    <OneLineReviewBlock
                        reviews={reviews}
                        isOneLineReviewsLoading={isOneLineReviewsLoading}
                    />
                </>
            )}
        </section>
    );
}

function BookInfo({ book }: { book: BookDetails }) {
    return (
        <div className="flex flex-col md:flex-row gap-12 mb-16 items-center py-8">
            <BookCover cover={book.cover} title={book.title} />
            <div className="flex-1">
                <h1 className="latte-h1 mb-2">{book.title}</h1>
                <p className="text-xl text-[#6D4C41] mb-6">
                    {book.author || "저자 미상"}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-[#8D6E63]">
                    <InfoItem label="Author" value={book.author || "-"} />
                    <InfoItem label="Publisher" value={book.publisher || "-"} />
                    <InfoItem
                        label="Date"
                        value={
                            book.meetingDate
                                ? formatMeetingDate(book.meetingDate)
                                : (book.year ?? "-")
                        }
                    />
                    <InfoItem
                        label="Category"
                        value={
                            Array.isArray(book.category)
                                ? book.category.join(", ")
                                : book.category || "-"
                        }
                    />
                    <InfoItem label="Pages" value={book.pages ?? "-"} />
                    <RatingsBlock ratings={book.ratings} bookId={book.id} />
                </div>
            </div>
        </div>
    );
}

function OneLineReviewBlock({
    reviews,
    isOneLineReviewsLoading,
}: {
    reviews: OneLineReviews | null;
    isOneLineReviewsLoading: boolean;
}) {
    const writerColumnIndex = reviews?.columns.findIndex((column) =>
        ["작성자", "멤버", "writer"].some((key) =>
            column.toLowerCase().includes(key.toLowerCase()),
        ),
    );

    return (
        <div className="border border-[#EFEBE9] rounded-xl p-6 bg-white">
            <h2 className="text-xl font-bold text-[#5D4037] mb-4">
                {reviews?.title ?? "한 마디로 설명하자면,"}
            </h2>
            {isOneLineReviewsLoading ? (
                <div className="py-6 flex items-center justify-center">
                    <LoadingSpinner size="sm" />
                </div>
            ) : !reviews || reviews.rows.length === 0 ? (
                <div className="text-[#8D6E63]">아직 등록된 한 줄 평이 없어요.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#5D4037] border-collapse table-auto">
                        {reviews.columns.length > 0 && (
                            <colgroup>
                                {reviews.columns.map((column, columnIndex) => (
                                    <col
                                        key={column || `col-${columnIndex}`}
                                        className={writerColumnIndex === columnIndex ? "w-24" : ""}
                                    />
                                ))}
                            </colgroup>
                        )}
                        {reviews.columns.length > 0 && (
                            <thead>
                                <tr className="bg-[#F7F6F3]">
                                    {reviews.columns.map((column, columnIndex) => (
                                        <th
                                            key={column || "column"}
                                            className="text-left px-4 py-2 font-semibold border-b border-[#EFEBE9]"
                                        >
                                            {column || "-"}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {reviews.rows.map((row) => {
                                const rowKey = row.join("\u241F") || "row";
                                return (
                                    <tr key={rowKey} className="border-b">
                                        {row.map((cell, i) => {
                                            const columnName = reviews.columns[i] ?? "column";
                                            return (
                                                <td
                                                    key={`${rowKey}-${columnName}`}
                                                    className={`px-4 py-2 ${writerColumnIndex === i ? "whitespace-nowrap" : ""
                                                        }`}
                                                >
                                                    {cell || "-"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function RatingHearts({
    count,
    label,
    bookId,
}: {
    count: number | null;
    label: string;
    bookId: string;
}) {
    const heartKeys = Array.from(
        { length: count ?? 0 },
        (_, i) => `${bookId}-${label}-heart-${i}`,
    );

    return (
        <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#EFEBE9] text-[#6D4C41] flex items-center justify-center font-bold text-[10px]">
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

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <span className="block text-glue-400 uppercase text-xs font-bold">
                {label}
            </span>
            {value}
        </div>
    );
}

function RatingsBlock({
    ratings,
    bookId,
}: {
    ratings: BookDetails["ratings"];
    bookId: string;
}) {
    return (
        <div className="col-span-2 sm:col-span-2">
            <span className="block text-glue-400 uppercase text-xs font-bold">
                Ratings
            </span>
            <div className="flex flex-col gap-1 mt-1">
                <RatingHearts count={ratings.jane} label="J" bookId={bookId} />
                <RatingHearts count={ratings.cardy} label="C" bookId={bookId} />
                <RatingHearts count={ratings.mihak} label="M" bookId={bookId} />
            </div>
        </div>
    );
}

function BookCover({ cover, title }: { cover: string | null; title: string }) {
    return (
        <div className="w-44 bg-[#F7F6F3] rounded-lg border border-[#EFEBE9] flex items-center justify-center text-6xl shadow-sm flex-shrink-0 overflow-hidden">
            {cover ? (
                <Image
                    src={cover}
                    alt={title}
                    width={128}
                    height={180}
                    className="h-full w-full object-cover"
                    unoptimized
                />
            ) : (
                "📖"
            )}
        </div>
    );
}
