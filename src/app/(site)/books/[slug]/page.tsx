import Link from 'next/link';

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    await params;

    const book = {
        title: '선량한 차별주의자', // Hardcoded for demo matching screenshot
        subtitle: 'Confessions of a Benevolent Mainstreamer',
        author: 'Kim Ji-hye',
        publisher: 'Changbi',
        date: '2025/12/20',
        category: 'Social/Politics',
        pages: 243,
        year: 2025,
        cover: '📖',
        ratings: {
            jane: 4,
            cardy: 3,
            mihak: 4
        },
        // The members who wrote something about this book
        writings: [
            {
                user: 'Jane',
                icon: '✤',
                color: 'bg-[#EFEBE9] border-[#D7CCC8]',
                oneLiner: 'I am a benevolent discriminator.',
                sentence: `Before reading this book, when asked "Are you someone who discriminates?", I would ponder for a few seconds. But after reading, I can now answer clearly: "I am definitely a discriminator." It was a moment of realization that even good intentions can have discriminatory effects.`
            },
            {
                user: 'Cardy',
                icon: '🍷',
                color: 'bg-[#EFEBE9] border-[#D7CCC8]',
                oneLiner: 'A must-read for the entire nation.',
                sentence: `I was ashamed enough to want to hide myself. Especially the preface made my heart sting. I usually use the expression "decidophobia" without thinking, but I realized ittrivializes the struggles of those who really have limited choices.`
            },
            {
                user: 'Mihak',
                icon: '🦋',
                color: 'bg-[#EFEBE9] border-[#D7CCC8]',
                oneLiner: 'Ditto.',
                sentence: `Same here. It allows us to reflect on our position in society and how our privileges might be invisible to us. A very necessary book for our times.`
            }
        ]
    };

    return (
        <div className="max-w-[900px] mx-auto px-6 py-12">
            <Link href="/books" className="text-[#8D6E63] hover:text-[#5D4037] text-sm mb-6 inline-block">
                &larr; Back to Library
            </Link>

            {/* Book Cover & Title Area */}
            <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
                <div className="w-32 h-40 bg-[#F7F6F3] rounded-lg border border-[#EFEBE9] flex items-center justify-center text-6xl shadow-sm flex-shrink-0">
                    {book.cover}
                </div>
                <div className="flex-1">
                    <h1 className="latte-h1 mb-2">{book.title}</h1>
                    <p className="text-xl text-[#6D4C41] mb-6">{book.subtitle}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-[#8D6E63]">
                        <div>
                            <span className="block text-[#D7CCC8] uppercase text-xs font-bold">Author</span>
                            {book.author}
                        </div>
                        <div>
                            <span className="block text-[#D7CCC8] uppercase text-xs font-bold">Publisher</span>
                            {book.publisher}
                        </div>
                        <div>
                            <span className="block text-[#D7CCC8] uppercase text-xs font-bold">Date</span>
                            {book.date}
                        </div>
                        <div>
                            <span className="block text-[#D7CCC8] uppercase text-xs font-bold">Category</span>
                            {book.category}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3 Members' Writings Section */}
            <section>
                <div className="flex items-center justify-between mb-8 border-b border-[#EFEBE9] pb-4">
                    <h2 className="latte-h2 mb-0">Members' Thoughts</h2>
                    <div className="flex gap-2">
                        {/* Avatars of who wrote */}
                        {['Jane', 'Cardy', 'Mihak'].map(name => (
                            <div key={name} className="w-8 h-8 rounded-full bg-[#D7CCC8] flex items-center justify-center text-xs text-[#3E2723] font-bold" title={name}>
                                {name[0]}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {book.writings.map((writing, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="flex-shrink-0 flex flex-col items-center gap-2 w-12 pt-2">
                                <div className="w-10 h-10 rounded-full bg-[#8D6E63] text-white flex items-center justify-center text-lg shadow-sm">
                                    {writing.icon}
                                </div>
                                <span className="text-xs font-bold text-[#6D4C41]">{writing.user}</span>
                            </div>

                            <div className="flex-1 latte-card relative">
                                <div className="absolute top-4 right-4 text-[#D7CCC8] text-4xl leading-none opacity-50">”</div>

                                <div className="mb-4">
                                    <span className="text-[#8D6E63] text-xs uppercase tracking-widest font-bold">One Liner</span>
                                    <p className="font-bold text-[#3E2723] text-lg">"{writing.oneLiner}"</p>
                                </div>

                                <div>
                                    <span className="text-[#8D6E63] text-xs uppercase tracking-widest font-bold">My Sentence</span>
                                    <p className="text-[#4A3728] leading-relaxed mt-1">
                                        {writing.sentence}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button type="button" className="latte-button-outline w-full py-4 border-dashed">
                        + Add Your Thoughts
                    </button>
                </div>
            </section>

        </div>
    );
}
