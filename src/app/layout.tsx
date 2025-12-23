import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArticleHub - Read & Discover Amazing Articles",
  description: "Discover insightful articles on web development, technology, and more at ArticleHub",
  keywords: ["ArticleHub", "articles", "web development", "technology", "blog"],
  authors: [{ name: "ArticleHub Team" }],
  openGraph: {
    title: "ArticleHub",
    description: "Discover insightful articles on web development, technology, and more",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArticleHub",
    description: "Discover insightful articles on web development, technology, and more",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
