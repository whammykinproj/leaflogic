"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  wordCount: number;
}

export default function ArticlesListingClient({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(articles.map((a) => a.category))];
  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = articles.filter((a) => a.category === cat).length;
    return acc;
  }, {});

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Plant Care Guides</h1>
        <p className="mt-2 text-foreground/50">
          {articles.length} expert guides to keep your indoor plants happy and
          healthy.
        </p>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === null
                ? "border-green-primary bg-green-primary text-white"
                : "border-border bg-white text-foreground/60 hover:border-green-light hover:text-green-primary"
            }`}
          >
            All ({articles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "border-green-primary bg-green-primary text-white"
                  : "border-border bg-white text-foreground/60 hover:border-green-light hover:text-green-primary"
              }`}
            >
              {cat} ({categoryCounts[cat]})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-8 text-foreground/40">
          No articles yet. Run the content agents to generate your first batch!
        </p>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <Link
              href={`/articles/${featured.slug}`}
              className="group mt-8 block rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:border-green-light hover:shadow-lg sm:flex sm:items-center sm:gap-8 sm:p-8"
            >
              <div className="flex-1">
                <span className="inline-block rounded-full bg-green-bg px-3 py-1 text-xs font-semibold text-green-primary">
                  {featured.category}
                </span>
                <h2 className="mt-3 text-xl font-bold leading-snug text-foreground group-hover:text-green-primary transition-colors sm:text-2xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60 line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-foreground/35">
                  <span>{featured.date}</span>
                  {featured.wordCount > 0 && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-foreground/20" />
                      <span>{Math.max(1, Math.round(featured.wordCount / 200))} min read</span>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end sm:mt-0">
                <span className="text-sm font-medium text-green-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read &rarr;
                </span>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.slug} {...article} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
