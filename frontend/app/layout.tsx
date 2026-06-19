import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ConfirmProvider } from "@/context/ConfirmProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MLForge | Forge Your Intelligence",
  description: "Advanced Machine Learning Development Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
