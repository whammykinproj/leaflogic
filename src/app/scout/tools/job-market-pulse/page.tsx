import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Market Pulse — Trending Roles & Hot Companies | JobScout AI",
  description:
    "See which roles are trending and which companies are hiring the most right now. Free job market insights updated for 2026.",
  openGraph: {
    title: "Job Market Pulse — Trending Roles & Hot Companies",
    description:
      "See which roles are trending and which companies are hiring the most right now. Free job market insights.",
    type: "website",
    siteName: "JobScout AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Market Pulse — Trending Roles & Hot Companies",
    description:
      "See which roles are trending and which companies are hiring the most right now.",
  },
};

const TRENDING_ROLES = [
  {
    title: "AI/ML Engineer",
    growth: "+82%",
    avgSalary: "$185k",
    demand: "Very High",
    description:
      "Companies racing to ship AI products are desperate for engineers who can build and deploy ML systems.",
  },
  {
    title: "Platform Engineer",
    growth: "+54%",
    avgSalary: "$175k",
    demand: "High",
    description:
      "The DevOps-to-platform shift continues. Internal developer platforms are a top priority at mid-to-large companies.",
  },
  {
    title: "Product Manager (AI)",
    growth: "+47%",
    avgSalary: "$170k",
    demand: "High",
    description:
      "Every company building AI needs PMs who understand the tech. AI-native product management is its own discipline now.",
  },
  {
    title: "Solutions Engineer",
    growth: "+38%",
    avgSalary: "$155k",
    demand: "High",
    description:
      "B2B SaaS companies are investing heavily in pre-sales engineering as deal sizes grow and products get more complex.",
  },
  {
    title: "Data Engineer",
    growth: "+33%",
    avgSalary: "$165k",
    demand: "High",
    description:
      "AI needs data pipelines. The data engineering renaissance is real, especially for streaming and real-time systems.",
  },
  {
    title: "Growth Marketing Manager",
    growth: "+29%",
    avgSalary: "$130k",
    demand: "Moderate",
    description:
      "Startups want full-stack marketers who can run experiments, analyze data, and ship campaigns without a big team.",
  },
];

const HOT_COMPANIES = [
  {
    name: "Anthropic",
    sector: "AI Safety",
    roles: "120+",
    highlight: "Building the most capable and steerable AI systems",
  },
  {
    name: "OpenAI",
    sector: "AI Research",
    roles: "200+",
    highlight: "Scaling foundation models and enterprise products",
  },
  {
    name: "Stripe",
    sector: "Fintech",
    roles: "180+",
    highlight: "Expanding globally with new financial products",
  },
  {
    name: "Figma",
    sector: "Design Tools",
    roles: "90+",
    highlight: "Post-acquisition independence, shipping fast",
  },
  {
    name: "Databricks",
    sector: "Data/AI Platform",
    roles: "250+",
    highlight: "Unified analytics + AI platform momentum",
  },
  {
    name: "Vercel",
    sector: "Developer Tools",
    roles: "70+",
    highlight: "Frontend cloud leader, powering the modern web",
  },
  {
    name: "Scale AI",
    sector: "Data Infrastructure",
    roles: "150+",
    highlight: "Enterprise AI data annotation and evaluation",
  },
  {
    name: "Notion",
    sector: "Productivity",
    roles: "85+",
    highlight: "Expanding into enterprise with AI-powered workspace",
  },
];

function DemandBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    "Very High": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    High: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Moderate: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[level] || colors["Moderate"]}`}
    >
      {level} demand
    </span>
  );
}

export default function JobMarketPulsePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/scout" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/scout/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/scout/login?signup=true"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5">
          Free Tool
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Job Market Pulse
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Which roles are surging in demand? Which companies are hiring the
          hardest? A snapshot of the tech job market in 2026.
        </p>
      </div>

      {/* Trending Roles */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Trending Roles
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TRENDING_ROLES.map((role) => (
            <div
              key={role.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white">{role.title}</h3>
                <span className="text-emerald-400 text-sm font-mono font-bold">
                  {role.growth}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-3">{role.description}</p>
              <div className="flex items-center gap-3">
                <DemandBadge level={role.demand} />
                <span className="text-xs text-zinc-500">
                  Avg: {role.avgSalary}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hot Companies */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
            />
          </svg>
          Hot Companies Hiring
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {HOT_COMPANIES.map((company) => (
            <div
              key={company.name}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-lg font-bold text-emerald-400 shrink-0">
                {company.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{company.name}</h3>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                    {company.sector}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm mb-1">
                  {company.highlight}
                </p>
                <p className="text-xs text-emerald-400">
                  {company.roles} open roles
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-zinc-800">
        <h2 className="text-2xl font-bold mb-3">
          Get personalized matches delivered daily
        </h2>
        <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
          Stop scrolling job boards. JobScout AI scans 10+ sources every morning
          and delivers roles matched to your skills, experience, and
          preferences.
        </p>
        <Link
          href="/scout/login?signup=true"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition"
        >
          Start your free 7-day trial
        </Link>
        <p className="text-xs text-zinc-600 mt-3">
          No credit card required. Cancel anytime.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">
            <Link href="/scout" className="hover:text-zinc-300">
              JobScout AI
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link
              href="/scout/tools/salary-lookup"
              className="hover:text-zinc-300"
            >
              Salary Lookup
            </Link>
            <Link href="/scout/blog" className="hover:text-zinc-300">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
