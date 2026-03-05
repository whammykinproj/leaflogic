import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      url: `https://leaflogic.app/articles/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: "LeafLogic",
      url: "https://leaflogic.app",
    },
    publisher: {
      "@type": "Organization",
      name: "LeafLogic",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://leaflogic.app/articles/${article.slug}`,
    },
    keywords: article.keywords.join(", "),
  };

  const faqLd = article.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-border bg-cream">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-foreground/40">
            <Link href="/" className="hover:text-green-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-green-primary transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-foreground/60 truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block rounded-full bg-green-bg px-3 py-1 text-xs font-semibold text-green-primary">
            {article.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-foreground/50">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-foreground/35">
            <span>Published {article.date}</span>
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            <span>LeafLogic Team</span>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-green-light/40 via-border to-transparent" />
        </div>

        <AdSlot slot="top-article" format="horizontal" />

        {/* Article content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <AdSlot slot="bottom-article" format="rectangle" />

        {/* Newsletter CTA */}
        <div className="mt-14">
          <NewsletterSignup />
        </div>
      </article>
    </>
  );
}
