import { getAllArticles } from "@/lib/articles";
import type { Metadata } from "next";
import ArticlesListingClient from "@/components/ArticlesListingClient";

export const metadata: Metadata = {
  title: "Plant Care Guides",
  description:
    "Browse all indoor plant care guides, tips, and troubleshooting articles.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return <ArticlesListingClient articles={articles} />;
}
