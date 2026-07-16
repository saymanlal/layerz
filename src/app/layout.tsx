import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CinematicLoader from "@/components/CinematicLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Layerz | Global Innovation Ecosystem",
  description: "A premium hub for builders prototyping open infrastructure and launching decentralized solutions layer by layer.",
  icons: {
    icon: "/logo-org.jpg",
    shortcut: "/logo-org.jpg",
    apple: "/logo-org.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111111] selection:bg-[#8B88F8]/30 selection:text-black">
        <CinematicLoader />
        <Header />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
