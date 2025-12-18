import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import "./globals.css";
import UserInitializer from "./components/UserInitializer";

const nanumGothic = Nanum_Gothic({
  weight: ["400", "800", "700"],
  subsets: ["latin"], // 한글 폰트지만 next/font 옵션상 보통 latin 지정 + display swap로 사용
  display: "swap",
  variable: "--font-nanum-gothic", // Tailwind에서 쓰기 좋게
});

export const metadata: Metadata = {
  title: "Glue - Share Your Reading Journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nanumGothic.variable} font-sans`} suppressHydrationWarning={true}>
        <UserInitializer />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
