"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  tip: string;
  category: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Profile Setup
  {
    id: "linkedin-updated",
    label: "Update your LinkedIn headline and summary",
    tip: "Your headline shows up in search results and recruiter outreach. Make it specific: 'Senior PM | B2B SaaS | Growth + 0-to-1' beats 'Product Manager at Company X'.",
    category: "Profile Setup",
  },
  {
    id: "linkedin-photo",
    label: "Upload a professional, recent profile photo",
    tip: "Profiles with photos get 21x more views. Use a clear headshot with good lighting against a simple background.",
    category: "Profile Setup",
  },
  {
    id: "portfolio-live",
    label: "Create or update your portfolio / personal site",
    tip: "Even a simple one-page site with your bio, key projects, and contact info sets you apart. Use a free template if design isn't your thing.",
    category: "Profile Setup",
  },
  // Resume
  {
    id: "resume-quantified",
    label: "Add metrics and outcomes to every resume bullet",
    tip: "Replace 'managed a team' with 'managed a team of 8, shipping 3 products that drove $2M ARR.' Numbers make you memorable.",
    category: "Resume",
  },
  {
    id: "resume-tailored",
    label: "Create 2-3 resume variants for different role types",
    tip: "A PM resume, a strategy resume, and a generalist resume let you apply faster without rewriting each time. Swap the summary and reorder bullets.",
    category: "Resume",
  },
  {
    id: "resume-proofread",
    label: "Have someone else proofread your resume",
    tip: "You'll miss your own typos. Ask a friend or use a tool. One misspelling can cost you an interview at detail-oriented companies.",
    category: "Resume",
  },
  // Applications
  {
    id: "target-list",
    label: "Build a target company list (20-30 companies)",
    tip: "Research companies you'd want to work at before they post roles. Follow them, understand their products, and you'll write better applications when openings appear.",
    category: "Applications",
  },
  {
    id: "tracker-setup",
    label: "Set up an application tracker (spreadsheet or tool)",
    tip: "Track company, role, date applied, status, and follow-up dates. Without a system, applications slip through the cracks.",
    category: "Applications",
  },
  {
    id: "cover-letter-template",
    label: "Draft a customizable cover letter template",
    tip: "Write a strong base letter with placeholders for company name, specific role details, and why-this-company. Customizing should take 10 minutes, not 45.",
    category: "Applications",
  },
  // Networking
  {
    id: "reach-out-5",
    label: "Reach out to 5 people in your target industry",
    tip: "Don't ask for a job. Ask for 15 minutes of advice about their company, team, or career path. People love sharing what they know.",
    category: "Networking",
  },
  {
    id: "alumni-network",
    label: "Check your alumni network for connections at target companies",
    tip: "Shared alma maters create instant rapport. Search LinkedIn for your school + target company and send a warm note.",
    category: "Networking",
  },
  {
    id: "community-join",
    label: "Join 1-2 relevant Slack/Discord communities",
    tip: "Industry-specific communities often share roles before they're posted publicly. Participate genuinely and opportunities surface naturally.",
    category: "Networking",
  },
  // Interviews
  {
    id: "stories-prepped",
    label: "Prepare 5-7 STAR stories from your experience",
    tip: "Situation, Task, Action, Result. Cover: leadership, conflict, failure, data-driven decision, cross-functional work, tight deadline, and ambiguity.",
    category: "Interviews",
  },
  {
    id: "mock-interview",
    label: "Do at least one mock interview",
    tip: "Practice out loud with a friend, mentor, or recording. Thinking through answers is not the same as saying them. You'll be surprised what trips you up.",
    category: "Interviews",
  },
  {
    id: "questions-ready",
    label: "Prepare thoughtful questions to ask interviewers",
    tip: "Ask about the team's biggest challenge this quarter, how they measure success in the role, or what the last person in this role did well. Avoid questions you could Google.",
    category: "Interviews",
  },
];

const CATEGORIES = ["Profile Setup", "Resume", "Applications", "Networking", "Interviews"];

const STORAGE_KEY = "jobscout-checklist";

export default function JobSearchChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChecked(JSON.parse(saved));
      } catch {
        // ignore corrupt data
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }
  }, [checked, mounted]);

  const totalChecked = Object.values(checked).filter(Boolean).length;
  const totalItems = CHECKLIST_ITEMS.length;
  const progressPct = Math.round((totalChecked / totalItems) * 100);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <Link href="/scout" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/tools/salary-lookup"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Salary Lookup
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5">
            Free tool
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Job Search Checklist
          </h1>
          <p className="text-zinc-400 text-lg">
            Everything you need to do before, during, and after your job search. Check items off as you go — progress saves automatically.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10 p-5 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-300">
              {totalChecked} of {totalItems} complete
            </span>
            <span className="text-sm font-bold text-emerald-400">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {totalChecked === totalItems && (
            <p className="text-emerald-400 text-sm font-medium mt-3">
              You&apos;re fully prepped. Time to let AI do the heavy lifting.
            </p>
          )}
        </div>

        {/* Checklist by category */}
        {CATEGORIES.map((category) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.category === category);
          const catChecked = items.filter((i) => checked[i.id]).length;
          return (
            <div key={category} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-white">{category}</h2>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {catChecked}/{items.length}
                </span>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border px-5 py-4 transition-all duration-200 cursor-pointer ${
                      checked[item.id]
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                    onClick={() => toggle(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            checked[item.id]
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-zinc-600"
                          }`}
                        >
                          {checked[item.id] && (
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-sm font-medium block ${
                            checked[item.id] ? "text-zinc-500 line-through" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                          {item.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
          <h3 className="text-xl font-bold mb-2">
            Let AI handle the boring parts
          </h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            JobScout AI scans 6+ job boards daily, matches roles to your profile, and drafts personalized pitches — all delivered to your inbox.
          </p>
          <Link
            href="/scout/login?signup=true"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Try JobScout AI free
          </Link>
        </div>
      </div>
    </div>
  );
}
