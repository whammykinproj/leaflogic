import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Range Lookup — Free Tool | JobScout AI",
  description:
    "Look up salary ranges by role and location. See 25th, 50th, and 90th percentile salaries for top tech roles across major US cities.",
  openGraph: {
    title: "Salary Range Lookup — Free Tool",
    description:
      "Look up salary ranges by role and location. Know your worth before you negotiate.",
    type: "website",
    siteName: "JobScout AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Range Lookup — Free Tool | JobScout AI",
    description:
      "Look up salary ranges by role and location. Know your worth before you negotiate.",
  },
};

export default function SalaryLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
