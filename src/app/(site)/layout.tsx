import Navbar from "@components/Navbar";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
        </div>
    );
}
