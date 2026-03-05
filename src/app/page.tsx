import { getAllArticles } from "@/lib/articles";
import { getAllPlantHubs } from "@/lib/plants";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";

export default function Home() {
  const articles = getAllArticles().slice(0, 6);
  const plants = getAllPlantHubs().slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-green-dark px-6 py-24 sm:py-32">
        {/* Botanical SVG pattern overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 10c-8 0-20 12-20 30s12 30 20 30 20-12 20-30-12-30-20-30z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M40 10v60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" className="text-green-light"/>
          </svg>
        </div>
        {/* Gradient overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-green-dark/50 via-transparent to-green-dark/80" />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-light">
            {articles.length}+ Expert Guides
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Keep Your Plants
            <br />
            <span className="text-green-light">Thriving</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Simple, actionable care guides for every indoor plant. Diagnose
            problems, learn proper care, and watch your collection flourish.
          </p>

          {/* Search-style prompt */}
          <Link
            href="/articles"
            className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white/40 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
          >
            <svg className="h-4 w-4 shrink-0 text-green-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            What plant needs help?
          </Link>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-green-light px-6 py-3 text-sm font-semibold text-green-dark transition-all hover:bg-white hover:shadow-lg"
            >
              Browse Guides
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/plants"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Plants A-Z
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs font-medium tracking-wide text-white/30">
            Trusted by 10,000+ plant parents
          </p>
        </div>
      </section>

      {/* Popular Plants Quick Links */}
      {plants.length > 0 && (
        <section className="border-b border-border bg-cream px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                Popular Plants
              </h2>
              <Link
                href="/plants"
                className="text-xs font-medium text-green-primary hover:text-green-light transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {plants.map((plant) => (
                <Link
                  key={plant.slug}
                  href={`/plants/${plant.slug}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:border-green-light hover:bg-green-bg hover:text-green-primary"
                >
                  {plant.name}
                  <span className="ml-1.5 text-xs text-foreground/30">
                    {plant.articles.length}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Latest Guides</h2>
            <p className="mt-1 text-sm text-foreground/50">
              Fresh tips to keep your green friends happy
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden text-sm font-medium text-green-primary hover:text-green-light transition-colors sm:block"
          >
            View all &rarr;
          </Link>
        </div>

        {articles.length === 0 ? (
          <p className="mt-8 text-gray-500">
            Articles coming soon!
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/articles"
            className="text-sm font-medium text-green-primary hover:text-green-light transition-colors"
          >
            View all guides &rarr;
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-2xl px-6 pb-20">
        <NewsletterSignup />
      </section>
    </div>
  );
}
