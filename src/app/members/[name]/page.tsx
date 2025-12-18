export default async function MemberPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const member = {
        name: decodedName,
        icon: '👤',
        joinDate: 'Jan 2024',
        booksRead: 15,
        pagesRead: 4250,
        bio: "Loves Sci-Fi and biographies. Always looking for the next great space opera.",
        sentences: [
            { id: 1, text: "We accept the love we think we deserve.", book: "The Perks of Being a Wallflower", date: "2 days ago" },
            { id: 2, text: "So it goes.", book: "Slaughterhouse-Five", date: "1 week ago" },
            { id: 3, text: "All happy families are alike; each unhappy family is unhappy in its own way.", book: "Anna Karenina", date: "2 weeks ago" },
            { id: 4, text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", book: "Pride and Prejudice", date: "1 month ago" },
        ]
    };

    return (
        <div className="max-w-[900px] mx-auto px-6 py-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
                <div className="w-32 h-32 rounded-full bg-[#EFEBE9] border border-[#D7CCC8] flex items-center justify-center text-5xl shadow-sm text-[#4E342E]">
                    {member.icon}
                </div>
                <div className="text-center md:text-left space-y-2">
                    <h1 className="latte-h1 mb-1">{member.name}</h1>
                    <p className="text-[#8D6E63] text-sm">Member since {member.joinDate}</p>
                    <p className="max-w-md text-[#4A3728] leading-relaxed">{member.bio}</p>

                    <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#3E2723]">{member.booksRead}</div>
                            <div className="text-xs text-[#8D6E63] uppercase tracking-widest">Books</div>
                        </div>
                        <div className="w-px h-8 bg-[#EFEBE9]"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-[#3E2723]">{((member.pagesRead) / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-[#8D6E63] uppercase tracking-widest">Pages</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collection of Sentences */}
            <div>
                <h2 className="latte-h2 mb-8 flex items-center gap-2 border-b border-[#EFEBE9] pb-4">
                    <span className="text-[#6D4C41]">❝</span> Collected Sentences
                </h2>

                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {member.sentences.map((item) => (
                        <div key={item.id} className="break-inside-avoid latte-card group hover:shadow-md transition-shadow">
                            <p className="font-serif text-lg leading-relaxed text-[#4A3728] mb-4 italic">
                                "{item.text}"
                            </p>
                            <div className="flex items-center justify-between text-xs text-[#8D6E63] border-t border-[#EFEBE9] pt-4">
                                <span className="font-medium text-[#6D4C41]">{item.book}</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
