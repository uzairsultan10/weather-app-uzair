import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Effects } from "./components/icons/Effects";


export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Check the weather for cities around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-linear-to-b from-slate-900 to-slate-950 text-foreground`}
      >
          <Effects />

        <header className="fixed top-0 left-0 w-full z-10">
          <div className="max-w-xl mx-auto py-8 px-6">
            <h1 className="text-base font-semibold mb-6 text-muted-foreground text-shadow-sm ...">
              <Link href="/">Weather</Link>
            </h1>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}