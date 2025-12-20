"use client";

import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import BookList from "./_components/BookList";
import BooksHeader from "./_components/BooksHeader";
import useBooks from "./_hooks/useBooks";

export default function BooksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const {
        states: { pastBookList, isLoading },
    } = useBooks();

    const filteredBooks = pastBookList.filter(
        (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return (
        <div className="h-[calc(100dvh-4rem)] overflow-hidden">
            <div className="max-w-[1100px] mx-auto px-6 py-12 h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-[#FDFBF7] pt-6 pb-4">
                    <BooksHeader
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onClearSearch={() => setSearchQuery("")}
                    />
                </div>

                <div className="flex-1 overflow-y-auto lg:mx-30 pr-4 books-scrollbar">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center py-16">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <BookList books={filteredBooks} />
                    )}
                </div>
            </div>
        </div>
    );
}
