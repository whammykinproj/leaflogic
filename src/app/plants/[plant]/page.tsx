import { getPlantHub, getAllPlantSlugs } from "@/lib/plants";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ plant: string }>;
}

export async function generateStaticParams() {
  return getAllPlantSlugs().map((plant) => ({ plant }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { plant } = await params;
  const hub = getPlantHub(plant);
  if (!hub) return {};
  return {
    title: `${hub.name} Care Guide — Tips, Troubleshooting & More`,
    description: `Everything you need to grow a healthy ${hub.name}. Care guides, troubleshooting, propagation tips, and expert advice.`,
    openGraph: {
      title: `${hub.name} — Complete Indoor Care Guide`,
      description: `${hub.articles.length} expert guides for ${hub.name} care.`,
      url: `https://leaflogic.app/plants/${hub.slug}`,
    },
  };
}

export default async function PlantHubPage({ params }: PageProps) {
  const { plant } = await params;
  const hub = getPlantHub(plant);
  if (!hub) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${hub.name} Care Guide`,
    description: `Complete indoor ${hub.name} care resource with ${hub.articles.length} expert guides.`,
    url: `https://leaflogic.app/plants/${hub.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: hub.articles.map((article, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://leaflogic.app/articles/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl bg-green-bg p-8">
          <h1 className="text-3xl font-bold text-green-primary">
            {hub.name} Care Guide
          </h1>
          <p className="mt-2 text-gray-600">
            Everything you need to grow a thriving {hub.name} indoors.{" "}
            {hub.articles.length} expert{" "}
            {hub.articles.length === 1 ? "guide" : "guides"} covering care,
            troubleshooting, and more.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hub.articles.map((article) => (
            <ArticleCard key={article.slug} {...article} />
          ))}
        </div>

        <div className="mt-12">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
