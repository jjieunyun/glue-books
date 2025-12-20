"use client";
import { getBookDetails, getOneLineReviews } from "@api/Book";
import apiClientHandler from "@lib/apiClientHandler";
import { useCallback, useEffect, useState } from "react";

export interface BookDetails {
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

export interface OneLineReviews {
    title: string;
    columns: string[];
    rows: string[][];
}

export default function useBookDetails({ id }: { id?: string }) {
    const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [oneLineReviews, setOneLineReviews] = useState<OneLineReviews | null>(
        null,
    );
    const [isOneLineReviewsLoading, setIsOneLineReviewsLoading] = useState(true);

    const fetchBookDetails = useCallback(async () => {
        if (!id) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const res = await apiClientHandler(getBookDetails({ id }));
        if (res?.result) {
            setBookDetails(res.data);
        }
        setIsLoading(false);
    }, [id]);

    const fetchOneLineReviews = useCallback(async () => {
        if (!id) {
            setIsOneLineReviewsLoading(false);
            return;
        }
        setIsOneLineReviewsLoading(true);
        const res = await apiClientHandler(getOneLineReviews({ id }));
        if (res?.result) {
            setOneLineReviews(res.data);
        }
        setIsOneLineReviewsLoading(false);
    }, [id]);

    useEffect(() => {
        void fetchBookDetails();
        void fetchOneLineReviews();
    }, [fetchBookDetails, fetchOneLineReviews]);

    return {
        states: {
            bookDetails,
            isLoading,
            oneLineReviews,
            isOneLineReviewsLoading,
        },
        actions: {
            fetchBookDetails,
            fetchOneLineReviews,
        },
    };
}
