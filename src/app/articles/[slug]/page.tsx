import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import NewsletterSignup from "@/components/NewsletterSignup";

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
      <article className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-wide text-green-light">
          {article.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">{article.date}</p>
        <AdSlot slot="top-article" format="horizontal" />
        <div
          className="prose mt-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <AdSlot slot="bottom-article" format="rectangle" />
        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </article>
    </>
  );
}
