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

export const metadata = {
  title: "Renoweb News Intelligence",
  description: "Modern News Intelligence Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} text-slate-800 antialiased`}>
        <div className="min-h-screen bg-[var(--background)]">
          {children}
        </div>
      </body>
    </html>
  );
}
