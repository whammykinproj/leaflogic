import { getAllPlantHubs } from "@/lib/plants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indoor Plants A-Z",
  description:
    "Browse care guides, troubleshooting tips, and expert advice for every popular indoor plant.",
};

export default function PlantsPage() {
  const hubs = getAllPlantHubs();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground">Indoor Plants A-Z</h1>
        <p className="mt-2 text-foreground/50">
          {hubs.length} plants with dedicated care pages. Pick yours and find
          every guide, tip, and fix in one place.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <Link
            key={hub.slug}
            href={`/plants/${hub.slug}`}
            className="group flex items-center justify-between rounded-2xl border border-border bg-white p-5 transition-all duration-200 hover:border-green-light hover:shadow-lg hover:-translate-y-0.5"
          >
            <div>
              <h2 className="text-lg font-bold text-foreground group-hover:text-green-primary transition-colors">
                {hub.name}
              </h2>
              <p className="mt-0.5 text-sm text-foreground/40">
                {hub.articles.length}{" "}
                {hub.articles.length === 1 ? "guide" : "guides"}
              </p>
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-bg text-green-primary opacity-0 transition-all group-hover:opacity-100">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
