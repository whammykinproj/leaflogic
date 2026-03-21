import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Complete your profile",
    description:
      "Paste your resume, select target roles, add companies you're interested in, and set your location preferences. This takes about 5 minutes and powers everything else.",
    link: "/scout/onboarding",
    linkText: "Set up profile",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    number: "02",
    title: "Get your first digest",
    description:
      "Every morning, JobScout AI scans 11+ job boards, matches roles to your profile using AI, and emails you a curated digest with personalized pitches. Your first one arrives the day after you sign up.",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    number: "03",
    title: "Save jobs to your tracker",
    description:
      "When you see a match you like, save it to your application tracker. Track your pipeline from Saved to Applied to Interviewing to Offered — all in one place.",
    link: "/scout/tracker",
    linkText: "Open tracker",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    number: "04",
    title: "Use AI tools to apply",
    description:
      "Generate tailored cover letters, prep for interviews with AI-generated Q&A, get your resume reviewed, and research companies — all personalized to your background.",
    tools: [
      { href: "/scout/cover-letter", label: "Cover Letter" },
      { href: "/scout/interview-prep", label: "Interview Prep" },
      { href: "/scout/resume-review", label: "Resume Review" },
      { href: "/scout/company-research", label: "Company Research" },
    ],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    number: "05",
    title: "Compare offers and decide",
    description:
      "When offers start coming in, use the comparison tool to evaluate total comp, benefits, and remote policies side by side. Make the right choice with data.",
    link: "/scout/compare-offers",
    linkText: "Compare offers",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
];

export default function GettingStartedPage() {
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

      <h1 className="text-3xl font-bold mb-3">Getting Started</h1>
      <p className="text-zinc-400 mb-12 text-lg">
        Everything you need to land your next role, in 5 simple steps.
      </p>

      <div className="space-y-10">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="flex gap-6 group"
          >
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-200">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={step.icon}
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-emerald-400 font-mono mb-1">
                Step {step.number}
              </div>
              <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                {step.description}
              </p>
              {step.link && (
                <Link
                  href={step.link}
                  className="inline-block text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                  {step.linkText} &rarr;
                </Link>
              )}
              {step.tools && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {step.tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="text-xs px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/30 transition"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center border-t border-zinc-800 pt-10">
        <p className="text-zinc-500 text-sm mb-4">
          Questions? Feedback? We&apos;d love to hear from you.
        </p>
        <a
          href="mailto:support@jobscoutai.com"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition"
        >
          support@jobscoutai.com
        </a>
      </div>
    </div>
  );
}
