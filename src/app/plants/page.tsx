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
      <h1 className="text-3xl font-bold text-gray-900">Indoor Plants A-Z</h1>
      <p className="mt-2 text-gray-600">
        Find everything you need for your specific plant. Each page collects all
        our care guides, troubleshooting tips, and expert advice in one place.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((hub) => (
          <Link
            key={hub.slug}
            href={`/plants/${hub.slug}`}
            className="group flex items-center justify-between rounded-xl border border-gray-100 p-5 transition-all hover:border-green-light hover:shadow-md"
          >
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-primary transition-colors">
                {hub.name}
              </h2>
              <p className="text-sm text-gray-500">
                {hub.articles.length} {hub.articles.length === 1 ? "guide" : "guides"}
              </p>
            </div>
            <span className="text-green-light text-xl">&rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
