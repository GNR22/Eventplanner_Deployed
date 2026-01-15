import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Event Pub",
  description: "Draft your plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* 👇 Added 'text-white' to force all text white globally */}
      <body className={`${inter.className} h-full bg-pub-black bg-pub-texture bg-cover bg-fixed bg-center text-white selection:bg-pub-gold selection:text-pub-black`}>
        {children}
      </body>
    </html>
  );
}