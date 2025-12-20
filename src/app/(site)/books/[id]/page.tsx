import BookDetailClient from "./_components/BookDetailClient";

export default function BookDetailPage({ params }: { params: { id: string } }) {
    return <BookDetailClient id={params.id} />;
}
