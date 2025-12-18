'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock Data
const BOOKS = [
    { id: 1, slug: 'benevolent-discriminator', title: '선량한 차별주의자', cover: '📖', year: 2024, date: 'June', author: 'Kim Ji-hye', publisher: 'Changbi', category: 'Social/Politics', ratings: { jane: 4, cardy: 3, mihak: 3 } },
    { id: 2, slug: 'youtube-reading', title: '유튜브는 책을 집어삼킬 것인가', cover: '📚', year: 2024, date: 'July', author: 'Kim Seong-woo', publisher: 'Ttabi', category: 'Liberal Arts', ratings: { jane: 3, cardy: 3, mihak: 3 } },
    { id: 3, slug: 'good-discrimination', title: '좋은 불평등', cover: '⚖️', year: 2024, date: 'August', author: 'Choi Byung-hyun', publisher: 'Medici', category: 'Economy', ratings: { jane: 4, cardy: 3, mihak: 2 } },
    { id: 4, slug: 'librarian-work', title: '아무도 알려주지 않은 도서관 사서 실무', cover: '📕', year: 2024, date: 'September', author: 'Kang Min-sun', publisher: 'Imosi', category: 'Essay', ratings: { jane: 3, cardy: 3, mihak: 3 } },
    { id: 5, slug: 'long-night', title: '긴긴밤', cover: '🌙', year: 2024, date: 'October', author: 'Luri', publisher: 'Moonhak', category: 'Children', ratings: { jane: 5, cardy: 3, mihak: 3 } },
];

export default function BooksPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = BOOKS.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[900px] mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                    <div className="text-5xl mb-2">📚</div>
                    <h1 className="latte-h1">GlueBooks Library</h1>
                    <p className="text-[#8D6E63]">
                        Our shared reading history since 2024.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="latte-input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute left-3 top-2.5 text-[#8D6E63] text-sm">🔍</span>
                    </div>
                    <button type="button" className="latte-button flex items-center justify-center gap-2 whitespace-nowrap">
                        <span>➕</span> Add New Book
                    </button>
                </div>
            </div>

            {/* Book List (Grid) */}
            <div className="grid grid-cols-1 gap-4">
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-20 text-[#8D6E63] border border-dashed border-[#EFEBE9] rounded-xl">
                        No books found. Why not add one?
                    </div>
                ) : (
                    filteredBooks.map((book) => (
                        <Link
                            href={`/books/${book.slug}`}
                            key={book.id}
                            className="latte-card flex items-center gap-4 hover:shadow-md transition-shadow group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EFEBE9] group-hover:bg-[#8D6E63] transition-colors"></div>

                            <div className="flex-shrink-0 w-16 h-16 bg-[#FDFBF7] rounded-lg border border-[#EFEBE9] flex items-center justify-center text-3xl">
                                {book.cover}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-[#3E2723] truncate group-hover:text-[#6D4C41] transition-colors">
                                        {book.title}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#EFEBE9] text-[#6D4C41]">
                                        {book.date}
                                    </span>
                                </div>
                                <p className="text-sm text-[#8D6E63] truncate">
                                    {book.author} · {book.publisher}
                                </p>
                            </div>

                            <div className="hidden sm:flex items-center gap-4 text-xs">
                                {/* Ratings Preview */}
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1">
                                        <span className="w-4 h-4 rounded-full bg-[#EFEBE9] text-[#6D4C41] flex items-center justify-center font-bold text-[10px]">J</span>
                                        <span className="text-[#FFB74D]">{'★'.repeat(book.ratings.jane)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="w-4 h-4 rounded-full bg-[#EFEBE9] text-[#6D4C41] flex items-center justify-center font-bold text-[10px]">C</span>
                                        <span className="text-[#FFB74D]">{'★'.repeat(book.ratings.cardy)}</span>
                                    </div>
                                </div>
                                <div className="text-[#D7CCC8] text-2xl">›</div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
