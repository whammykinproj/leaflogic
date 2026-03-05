import { getAllArticles } from "@/lib/articles";
import { getAllPlantHubs } from "@/lib/plants";
import type { MetadataRoute } from "next";

const SITE_URL = "https://leaflogic.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const plantHubs = getAllPlantHubs();

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const plantEntries = plantHubs.map((hub) => ({
    url: `${SITE_URL}/plants/${hub.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
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
    {
      url: `${SITE_URL}/plants`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...plantEntries,
    ...articleEntries,
  ];
}
