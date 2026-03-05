import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";

export default function Home() {
  const articles = getAllArticles().slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-green-bg py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-green-primary sm:text-5xl">
            Keep Your Plants Thriving
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Simple, actionable guides for every indoor plant. From beginners to
            green thumbs — we&apos;ve got you covered.
          </p>
          <Link
            href="/articles"
            className="mt-6 inline-block rounded-full bg-green-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-light"
          >
            Browse Plant Guides
          </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900">Latest Guides</h2>
        {articles.length === 0 ? (
          <p className="mt-4 text-gray-500">
            Articles coming soon! Run the agents to generate content.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        )}
        {articles.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className="text-sm font-medium text-green-primary hover:text-green-light transition-colors"
            >
              View all guides &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
