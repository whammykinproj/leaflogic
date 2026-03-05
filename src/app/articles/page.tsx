import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plant Care Guides",
  description: "Browse all indoor plant care guides, tips, and troubleshooting articles.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Plant Care Guides</h1>
      <p className="mt-2 text-gray-600">
        Everything you need to keep your indoor plants happy and healthy.
      </p>

      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full bg-green-bg px-3 py-1 text-xs font-semibold text-green-primary"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <p className="mt-8 text-gray-500">
          No articles yet. Run the content agents to generate your first batch!
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>
      )}
    </div>
  );
}
