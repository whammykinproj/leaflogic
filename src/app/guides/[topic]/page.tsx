import {
  getAllTopicHubs,
  getTopicHub,
  getArticlesForTopic,
} from "@/lib/guides";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

interface PageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return getAllTopicHubs().map((hub) => ({ topic: hub.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const hub = getTopicHub(topic);
  if (!hub) return {};
  return {
    title: hub.title,
    description: hub.description,
    alternates: {
      canonical: `https://leaflogic.app/guides/${hub.slug}`,
    },
    openGraph: {
      title: hub.title,
      description: hub.description,
      type: "website",
      url: `https://leaflogic.app/guides/${hub.slug}`,
    },
  };
}

export default async function TopicHubPage({ params }: PageProps) {
  const { topic } = await params;
  const hub = getTopicHub(topic);
  if (!hub) notFound();

  const articles = getArticlesForTopic(hub);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.title,
    description: hub.description,
    url: `https://leaflogic.app/guides/${hub.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://leaflogic.app/articles/${article.slug}`,
        name: article.title,
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://leaflogic.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://leaflogic.app/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hub.title,
        item: `https://leaflogic.app/guides/${hub.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-cream">
        <div className="mx-auto max-w-5xl px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-foreground/40">
            <Link
              href="/"
              className="hover:text-green-primary transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/articles"
              className="hover:text-green-primary transition-colors"
            >
              Guides
            </Link>
            <span>/</span>
            <span className="text-foreground/60">{hub.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-green-bg">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h1 className="text-3xl font-bold text-green-dark sm:text-4xl">
            {hub.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/60">
            {hub.description}
          </p>
          <p className="mt-3 text-sm text-foreground/40">
            {articles.length} article{articles.length !== 1 ? "s" : ""} in this
            collection
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Tips */}
        <div className="mb-12 rounded-xl border border-border bg-cream p-6">
          <h2 className="text-lg font-bold text-green-primary">Quick Tips</h2>
          <ul className="mt-3 space-y-2">
            {hub.tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground/70"
              >
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Articles grid */}
        <h2 className="mb-6 text-xl font-bold text-foreground">All Articles</h2>
        {articles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                date={article.date}
                category={article.category}
                wordCount={article.wordCount}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/50">
            No articles found for this topic yet.
          </p>
        )}
      </div>
    </>
  );
}
