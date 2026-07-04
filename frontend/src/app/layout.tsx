import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "ISS Overhead",
  description:
    "Track the International Space Station in real time and get a one-time email alert when it passes over your city.",
  keywords: ["ISS", "International Space Station", "tracker", "space", "overhead alert"],
  authors: [{ name: "Ahmed Rehman" }],
  openGraph: {
    title: "ISS Overhead",
    description: "Real-time ISS tracker with overhead email alerts.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <body className="bg-space-black text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
