import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plant Quiz - Which Plant Is Right for You?",
  description:
    "Take our quick quiz to find the perfect houseplant for your space, lifestyle, and experience level. Get personalized plant recommendations in under a minute.",
  openGraph: {
    title: "Plant Quiz - Which Plant Is Right for You?",
    description:
      "Take our quick quiz to find the perfect houseplant for your space, lifestyle, and experience level.",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
