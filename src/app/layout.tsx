import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandingForYou Dashboard",
  description: "BrandingForYou Internal Research Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="flex-1 flex flex-col pl-64">
          {/* Note: In the attendance project, Navbar was at the top. Here we use a Sidebar for the dashboard, so we add left padding matching sidebar width. */}
          <div className="flex-1 p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
