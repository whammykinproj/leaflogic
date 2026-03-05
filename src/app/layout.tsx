import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LeafLogic - Indoor Plant Care Guide",
    template: "%s | LeafLogic",
  },
  description:
    "Expert tips and guides for keeping your indoor plants healthy and thriving. Care guides, troubleshooting, and more.",
  metadataBase: new URL("https://leaflogic.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "LeafLogic",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
