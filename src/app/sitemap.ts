import { getAllArticles } from "@/lib/articles";
import type { MetadataRoute } from "next";

const SITE_URL = "https://leaflogic.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...articleEntries,
  ];
}
