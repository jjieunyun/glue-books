"use client";

import type { PastBook } from "../_hooks/useBooks";
import BookCard from "./BookCard";

interface BookListProps {
    books: PastBook[];
}

export default function BookList({ books }: BookListProps) {
    return (
        <div className="grid grid-cols-1 gap-4">
            {books.length === 0 ? (
                <div className="text-center py-20 text-[#8D6E63] border border-dashed border-[#EFEBE9] rounded-xl">
                    No books found.
                </div>
            ) : (
                books.map((book) => <BookCard key={book.id} book={book} />)
            )}
        </div>
    );
}
