import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Titto's X Fashion Planet",
  description: "A premium black and white fashion destination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen overflow-x-hidden w-full`}>
        {/* Top Marquee */}
        <div className="bg-foreground text-background overflow-hidden py-2 border-b border-gray-800 flex whitespace-nowrap text-xs font-bold tracking-widest uppercase">
          <div className="animate-marquee">
            <span>✦ FREE SHIPPING ON PREPAID ORDERS ✦ PREMIUM OVERSIZED TEES ✦ 240 GSM HEAVYWEIGHT COTTON ✦ NO COMPROMISE ON QUALITY </span>
            <span>✦ FREE SHIPPING ON PREPAID ORDERS ✦ PREMIUM OVERSIZED TEES ✦ 240 GSM HEAVYWEIGHT COTTON ✦ NO COMPROMISE ON QUALITY </span>
          </div>
        </div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
