

export async function getPastBookThumbnails() {
    return fetch('/api/book/past-book-thumbnails', {
        method: 'GET',
    })
}

export async function getBookDetails({ id }: { id: string }) {
    return fetch(`/api/book/book-details?id=${encodeURIComponent(id)}`, {
        method: 'GET',
    })
}

export async function getPastBookList() {
    return fetch('/api/book/past-book-list', {
        method: 'GET',
    })
}

export async function getOneLineReviews({ id }: { id: string }) {
    return fetch(`/api/book/one-line-reviews?id=${encodeURIComponent(id)}`, {
        method: 'GET',
    })
}