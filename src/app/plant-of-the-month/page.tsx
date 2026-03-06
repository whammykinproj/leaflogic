import type { Metadata } from "next";
import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Plant of the Month: Monstera Deliciosa - March 2026 | LeafLogic",
  description:
    "March 2026 Plant of the Month: Monstera Deliciosa. Discover care tips, common problems, and why this iconic tropical plant deserves a spot in your home.",
  openGraph: {
    title: "Plant of the Month: Monstera Deliciosa - March 2026",
    description:
      "Discover care tips, common problems, and why Monstera Deliciosa is our Plant of the Month for March 2026.",
  },
};

const careCard = [
  { label: "Light", value: "Bright indirect light", icon: "sun" },
  { label: "Water", value: "Every 1-2 weeks; let top inch dry", icon: "water" },
  { label: "Humidity", value: "50-60% (tolerates lower)", icon: "humidity" },
  { label: "Temperature", value: "65-85\u00b0F (18-29\u00b0C)", icon: "temp" },
  { label: "Difficulty", value: "Easy to moderate", icon: "difficulty" },
  { label: "Toxic to Pets?", value: "Yes \u2014 mildly toxic if ingested", icon: "pet" },
];

const commonProblems = [
  {
    problem: "Yellowing leaves",
    cause: "Overwatering, poor drainage, or insufficient light",
    fix: "Let soil dry between waterings and ensure the pot has drainage holes. Move to brighter indirect light.",
    link: "/articles/why-is-my-monstera-turning-yellow-8-causes-fixes",
  },
  {
    problem: "No fenestrations (holes in leaves)",
    cause: "Not enough light or the plant is still juvenile",
    fix: "Provide bright indirect light. Young Monsteras produce solid leaves \u2014 fenestrations develop as the plant matures.",
    link: "/articles/monstera-deliciosa-care-for-beginners-the-complete-guide",
  },
  {
    problem: "Brown leaf tips or edges",
    cause: "Low humidity, underwatering, or salt buildup",
    fix: "Increase humidity with a humidifier or pebble tray. Flush soil monthly to remove salt buildup from fertilizer.",
    link: "/articles/why-is-my-monstera-turning-yellow-and-brown",
  },
  {
    problem: "Leggy growth with small leaves",
    cause: "Insufficient light",
    fix: "Move to a spot with bright, filtered light. Consider adding a grow light in darker spaces.",
    link: "/articles/best-grow-lights-for-indoor-plants-in-2026",
  },
  {
    problem: "Root rot",
    cause: "Overwatering combined with poor drainage",
    fix: "Remove the plant from its pot, trim mushy roots, and repot in fresh well-draining soil.",
    link: "/articles/how-to-save-an-overwatered-plant-before-it-s-too-late",
  },
];

const relatedArticles = [
  {
    title: "Monstera Deliciosa Care for Beginners: The Complete Guide",
    slug: "monstera-deliciosa-care-for-beginners-the-complete-guide",
  },
  {
    title: "Why Is My Monstera Turning Yellow? 8 Causes & Fixes",
    slug: "why-is-my-monstera-turning-yellow-8-causes-fixes",
  },
  {
    title: "Why Is My Monstera Turning Yellow and Brown?",
    slug: "why-is-my-monstera-turning-yellow-and-brown",
  },
  {
    title: "Why Is My Monstera Turning Yellow After Repotting?",
    slug: "why-is-my-monstera-turning-yellow-after-repotting",
  },
  {
    title: "Best Soil for Indoor Plants in 2026: Top 5 Picks",
    slug: "best-soil-for-indoor-plants-in-2026-top-5-picks",
  },
  {
    title: "Best Fertilizer for Indoor Plants: A Complete Guide",
    slug: "best-fertilizer-for-indoor-plants-a-complete-guide",
  },
];

function CareIcon({ type }: { type: string }) {
  switch (type) {
    case "sun":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      );
    case "water":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8 8 0 008-8c0-4-4-9-8-13-4 4-8 9-8 13a8 8 0 008 8z" />
        </svg>
      );
    case "humidity":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      );
    case "temp":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "difficulty":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case "pet":
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PlantOfTheMonthPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-green-bg px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-green-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-primary">
            Plant of the Month &mdash; March 2026
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Monstera <span className="text-green-primary">Deliciosa</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/60">
            The Swiss Cheese Plant is one of the most iconic houseplants on the
            planet. With its dramatic fenestrated leaves and easygoing
            personality, it is the perfect statement plant for any indoor space.
          </p>
        </div>
      </section>

      {/* Care Card */}
      <section className="border-b border-border bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Quick Care Reference
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-foreground/50">
            Everything you need to know at a glance.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careCard.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-border bg-cream p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-bg text-green-primary">
                  <CareIcon type={item.icon} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Love It */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground">
          Why We Love Monstera Deliciosa
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/70">
          <p>
            There is a reason Monstera Deliciosa has dominated social media feeds
            and interior design magazines for years. Those giant, glossy,
            split-leaf fronds are instantly recognizable and bring an effortless
            tropical vibe to any room. But looks are just the beginning.
          </p>
          <p>
            What makes Monstera truly special is how forgiving it is. Unlike
            fussy plants that throw a tantrum over the slightest change in
            conditions, Monstera adapts. It tolerates a range of light levels
            (though it thrives in bright indirect light), bounces back from
            missed waterings, and grows at a pace that feels genuinely rewarding
            without being overwhelming.
          </p>
          <p>
            It is also an incredible air purifier, helping to filter common
            indoor pollutants. And if you give it a moss pole or trellis to climb,
            it will reward you with increasingly larger, more fenestrated leaves
            that look like living works of art.
          </p>
          <p>
            Whether you are a first-time plant parent or a seasoned collector,
            Monstera Deliciosa earns its spot in every indoor garden. Read our{" "}
            <Link
              href="/articles/monstera-deliciosa-care-for-beginners-the-complete-guide"
              className="font-medium text-green-primary underline underline-offset-2 hover:text-green-dark"
            >
              complete Monstera care guide
            </Link>{" "}
            for the full breakdown.
          </p>
        </div>
      </section>

      {/* Common Problems */}
      <section className="border-t border-border bg-cream px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground">
            Common Monstera Problems (And How to Fix Them)
          </h2>
          <p className="mt-2 text-sm text-foreground/50">
            Even easy plants have their moments. Here are the issues you are
            most likely to encounter.
          </p>
          <div className="mt-8 space-y-4">
            {commonProblems.map((item) => (
              <div
                key={item.problem}
                className="rounded-xl border border-border bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.problem}
                    </h3>
                    <p className="mt-1 text-sm text-foreground/50">
                      <strong className="text-foreground/70">Cause:</strong>{" "}
                      {item.cause}
                    </p>
                    <p className="mt-1 text-sm text-foreground/50">
                      <strong className="text-foreground/70">Fix:</strong>{" "}
                      {item.fix}
                    </p>
                  </div>
                  <Link
                    href={item.link}
                    className="shrink-0 rounded-lg bg-green-bg px-3 py-1.5 text-xs font-semibold text-green-primary transition-colors hover:bg-green-light/20"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-2xl font-bold text-foreground">
          Related Monstera Articles
        </h2>
        <p className="mt-2 text-sm text-foreground/50">
          Dive deeper into Monstera care with these guides from our library.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {relatedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group rounded-xl border border-border bg-white p-4 transition-all hover:border-green-light hover:shadow-sm"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-green-primary">
                {article.title}
              </p>
              <span className="mt-2 inline-block text-xs font-semibold text-green-primary">
                Read guide &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-cream px-6 py-16">
        <div className="mx-auto max-w-xl">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
