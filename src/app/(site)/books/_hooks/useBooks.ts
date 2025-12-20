"use client";
import { getPastBookList } from "@api/Book";
import apiClientHandler from "@lib/apiClientHandler";
import { useCallback, useEffect, useState } from "react";

export interface PastBook {
    id: string;
    title: string;
    cover: string | null;
    year: number | null;
    meetingDate: string | null;
    author: string;
    publisher: string;
    category: string | string[];
    pages: number | null;
    ratings: {
        jane: number | null;
        cardy: number | null;
        mihak: number | null;
    };
}

export default function useBooks() {
    const [pastBookList, setPastBookList] = useState<PastBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        const res = await apiClientHandler(getPastBookList());
        if (res?.result) {
            setPastBookList(res.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        void fetchBooks();
    }, [fetchBooks]);

    return {
        states: {
            pastBookList,
            isLoading,
        },
        actions: {
        },
    };
}
