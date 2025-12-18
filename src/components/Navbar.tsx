import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#EFEBE9] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-[#4E342E]">
                            GlueBooks
                        </Link>
                    </div>
                    <div className="hidden sm:flex space-x-8">
                        <NavLink href="/dashboard">Dashboard</NavLink>
                        <NavLink href="/books">Library</NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#6D4C41] hover:bg-[#5D4037] transition-opacity shadow-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-[#8D6E63] hover:text-[#4E342E] hover:border-[#6D4C41] transition-colors"
        >
            {children}
        </Link>
    );
}
