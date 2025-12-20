"use client";
import apiClientHandler from "@lib/apiClientHandler";
import { getPastBookThumbnails } from "@api/Book";
import { useEffect, useState } from "react";

export function useDashboard() {

    const [pastBookList, setPastBookList] = useState([]);
    const [isPastBooksLoading, setIsPastBooksLoading] = useState(true);

    const fetchBooks = async () => {
        setIsPastBooksLoading(true);
        const res = await apiClientHandler(getPastBookThumbnails());

        if (res?.result) {
            setPastBookList(res.data);
        } else {
            alert("Failed to fetch books");
        }
        setIsPastBooksLoading(false);
    };


    useEffect(() => {
        fetchBooks();
    }, [])

    return {
        states: {
            pastBookList,
            isPastBooksLoading,
        },
        actions: {

        }
    }


}
