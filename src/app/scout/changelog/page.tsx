import Link from "next/link";

const CHANGELOG = [
  {
    date: "March 2026",
    tag: "Launch",
    items: [
      "Daily AI-curated job digests from 11+ sources",
      "Personalized pitch drafts for every match",
      "AI cover letter generator",
      "AI interview prep with tailored Q&A",
      "AI resume review with actionable feedback",
      "Company research briefs",
      "Application tracker with Kanban board",
      "Offer comparison tool",
      "7-day free trial with Google OAuth signup",
      "Referral program: +7 days free for both parties",
      "Weekly progress emails with streak tracking",
      "Job fit scoring on matched roles",
      "Shareable digest pages for social sharing",
      "3 SEO blog posts on AI job searching",
      "Free salary lookup and job market pulse tools",
      "Mobile-responsive design with hamburger nav",
      "Data export (JSON) for account portability",
      "Admin dashboard for metrics and user management",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <Link href="/scout" className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Changelog</h1>
      <p className="text-zinc-400 mb-12">
        What&apos;s new in JobScout AI. We ship fast.
      </p>

      <div className="space-y-12">
        {CHANGELOG.map((release) => (
          <div key={release.date}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold">{release.date}</h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-medium">
                {release.tag}
              </span>
            </div>
            <ul className="space-y-3">
              {release.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <svg
                    className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
