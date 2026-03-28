import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import Sidebar from "./components/Sidebar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AromaAI - Comfort-First Personalized Perfume",
  description: "Personalized fragrances designed for people with scent sensitivities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased transition-colors duration-300`}>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 w-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
