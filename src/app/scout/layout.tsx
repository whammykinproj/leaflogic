import type { Metadata } from "next";
import { ToastProvider } from "@/lib/scout/toast";

export const metadata: Metadata = {
  title: {
    default: "JobScout AI — Your AI Job Search Agent",
    template: "%s | JobScout AI",
  },
  description:
    "AI-powered job hunting that works while you sleep. Daily curated matches + copy-paste pitches delivered to your inbox. $29/mo.",
  openGraph: {
    type: "website",
    siteName: "JobScout AI",
    title: "JobScout AI — Your AI Job Search Agent",
    description:
      "AI-powered job hunting that works while you sleep. Daily curated matches + copy-paste pitches delivered to your inbox.",
    url: "https://leaflogic.app/scout",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobScout AI — Your AI Job Search Agent",
    description:
      "AI-powered job hunting that works while you sleep. Daily curated matches + copy-paste pitches delivered to your inbox.",
  },
  alternates: {
    canonical: "https://leaflogic.app/scout",
  },
};

export default function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white scout-transitions">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
