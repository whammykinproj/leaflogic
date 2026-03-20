import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getDigestByShareToken(shareToken: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );

  const { data: digest } = await supabase
    .from("scout_digests")
    .select("id, jobs_found, email_html, sent_at, share_token")
    .eq("share_token", shareToken)
    .single();

  return digest;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const digest = await getDigestByShareToken(id);
  if (!digest) return {};

  const sentDate = new Date(digest.sent_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    title: `Job Digest — ${sentDate} | JobScout AI`,
    description: `${digest.jobs_found} curated job matches found by JobScout AI on ${sentDate}. See what an AI job scout delivers daily.`,
    openGraph: {
      title: `${digest.jobs_found} Jobs Matched — ${sentDate}`,
      description:
        "See what an AI-powered job scout delivers to your inbox every morning. Curated matches with copy-paste pitches.",
      type: "article",
      siteName: "JobScout AI",
      url: `https://leaflogic.app/scout/digest/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${digest.jobs_found} Jobs Matched — ${sentDate}`,
      description:
        "See what an AI-powered job scout delivers to your inbox every morning.",
    },
  };
}

export default async function PublicDigestPage({ params }: PageProps) {
  const { id } = await params;
  const digest = await getDigestByShareToken(id);

  if (!digest) notFound();

  const sentDate = new Date(digest.sent_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Extract job sections from the HTML to show teasers
  // We show the first 2 job cards, blur the rest
  const emailHtml = digest.email_html || "";

  // Split on <h3> tags to identify individual jobs
  const jobSections = emailHtml.split(/<h3>/i);
  const headerSection = jobSections[0] || "";
  const jobCards = jobSections.slice(1);

  const visibleCount = 2;
  const visibleJobs = jobCards.slice(0, visibleCount);
  const hiddenCount = Math.max(0, jobCards.length - visibleCount);

  const teaserHtml =
    headerSection +
    visibleJobs.map((j: string) => `<h3>${j}`).join("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <Link href="/scout" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/login?signup=true"
          className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition"
        >
          Start free trial
        </Link>
      </nav>

      {/* Digest header */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Job Digest</h1>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{sentDate}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-emerald-400">
              <span className="text-xs font-semibold">
                {digest.jobs_found}
              </span>
              {digest.jobs_found === 1 ? "job" : "jobs"} found
            </span>
          </div>
        </div>
      </div>

      {/* Visible teaser content */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-white">
          <div
            className="prose prose-sm max-w-none p-6 text-zinc-900 sm:p-8"
            dangerouslySetInnerHTML={{ __html: teaserHtml }}
          />
        </div>
      </div>

      {/* Blurred section + CTA */}
      {hiddenCount > 0 && (
        <div className="mx-auto max-w-4xl px-4 mt-0 relative">
          <div className="overflow-hidden rounded-b-xl border border-t-0 border-zinc-800 bg-white">
            {/* Blurred placeholder */}
            <div className="relative p-6 sm:p-8">
              <div className="blur-sm select-none pointer-events-none opacity-50">
                <div className="space-y-4">
                  {Array.from({ length: Math.min(hiddenCount, 3) }).map(
                    (_, i) => (
                      <div key={i} className="border-b border-zinc-200 pb-4">
                        <div className="h-5 bg-zinc-300 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-zinc-200 rounded w-full mb-1" />
                        <div className="h-3 bg-zinc-200 rounded w-4/5 mb-1" />
                        <div className="h-3 bg-zinc-200 rounded w-1/3" />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
                <div className="text-center px-6">
                  <p className="text-zinc-900 font-semibold text-lg mb-2">
                    +{hiddenCount} more match{hiddenCount !== 1 ? "es" : ""}{" "}
                    hidden
                  </p>
                  <p className="text-zinc-500 text-sm mb-4">
                    Sign up to see all {digest.jobs_found} matches with
                    copy-paste pitches
                  </p>
                  <Link
                    href="/scout/login?signup=true"
                    className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition text-sm"
                  >
                    Get your own AI job scout — free for 7 days
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Get your own daily job digest
        </h2>
        <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
          JobScout AI scans 10+ job boards every morning, matches roles to your
          profile, and drafts personalized pitches — delivered to your inbox
          before coffee.
        </p>
        <Link
          href="/scout/login?signup=true"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition"
        >
          Start your free 7-day trial
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6">
        <div className="max-w-4xl mx-auto text-center text-xs text-zinc-600">
          Powered by{" "}
          <Link href="/scout" className="text-emerald-400 hover:underline">
            JobScout AI
          </Link>
        </div>
      </footer>
    </div>
  );
}
