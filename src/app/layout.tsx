import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Titto's X Fashion Planet",
  description: "Oversized streetwear - anime, mythology and graphic culture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen overflow-x-hidden w-full`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
