import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    title: "PabloVG - CheapSearch",
    description: "Buscador de juegos baratos a traves de plataformas como instangaming o g2a",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-cover bg-center `}
                style={{ backgroundImage: "url('/pattern.png')" }}
            >
                {children}
            </body>
        </html>
    );
}
