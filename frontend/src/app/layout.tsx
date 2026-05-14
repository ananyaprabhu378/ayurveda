import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Vaidya - Ayurvedic Knowledge Ecosystem",
  description: "An Immersive AI-Powered Ayurvedic Knowledge Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
