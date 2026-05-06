import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandingForYou | Dashboard",
  description: "BrandingForYou 통합 리서치 및 관리 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${outfit.variable}`} style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
