"use client";

import Link from "next/link";
import { useState } from "react";
import MobileNav from "@/components/scout/MobileNav";

const INDUSTRIES = [
  "Tech / Software",
  "Finance / Fintech",
  "Healthcare / Biotech",
  "E-commerce / Retail",
  "AI / Machine Learning",
  "Media / Entertainment",
  "Enterprise / SaaS",
  "Consulting / Professional Services",
  "Energy / Climate",
  "Education / EdTech",
];

const FOCUS_AREAS = [
  { id: "culture", label: "Culture & Values" },
  { id: "compensation", label: "Compensation Intel" },
  { id: "growth", label: "Growth & Trajectory" },
  { id: "interview", label: "Interview Process" },
  { id: "news", label: "Recent News" },
  { id: "redflags", label: "Red Flags" },
];

export default function CompanyResearchPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleFocus = (id: string) => {
    setFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleResearch = async () => {
    if (!company || !role) return;
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/scout/api/company-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, industry, focusAreas }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate");
        return;
      }
      setHtml(data.html);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const el = document.getElementById("research-content");
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => window.print();

  const handleReset = () => {
    setHtml(null);
    setCompany("");
    setRole("");
    setIndustry("");
    setFocusAreas([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <Link href="/scout/dashboard" className="text-xl font-bold">
            <span className="text-emerald-400">JobScout</span>{" "}
            <span className="text-zinc-400 font-normal">AI</span>
          </Link>
          <div className="hidden md:block">
            <Link
              href="/scout/dashboard"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Dashboard
            </Link>
          </div>
          <MobileNav />
        </div>

        <h1 className="text-3xl font-bold mb-2 animate-fade-in">
          Company Intelligence Brief
        </h1>
        <p className="text-zinc-400 mb-8 animate-fade-in">
          Get an AI-generated deep-dive on any company — culture, compensation
          intel, interview process, red flags, and personalized talking points.
        </p>

        {/* Form */}
        {!html && !loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Company name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Anthropic"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-2">
                  Role you&apos;re targeting *
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Product Manager"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-zinc-300 mb-2">
                Industry <span className="text-zinc-600">(optional)</span>
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Auto-detect</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-zinc-300 mb-2">
                Focus areas{" "}
                <span className="text-zinc-600">(optional — select any)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => toggleFocus(area.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      focusAreas.includes(area.id)
                        ? "bg-emerald-500 text-black"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={handleResearch}
              disabled={!company || !role}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-3 rounded-lg transition"
            >
              Generate Intelligence Brief
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center animate-fade-in">
            <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-300 font-medium">
              Researching {company}...
            </p>
            <p className="text-zinc-500 text-sm mt-1">
              Analyzing culture, compensation, interview process, and more
            </p>
          </div>
        )}

        {/* Results */}
        {html && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold">
                Intelligence Brief:{" "}
                <span className="text-emerald-400">{company}</span>
                <span className="text-zinc-500 text-sm font-normal ml-2">
                  ({role})
                </span>
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-emerald-400 transition print:hidden"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  Print / PDF
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  New Research
                </button>
              </div>
            </div>
            <div
              id="research-content"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 prose prose-sm prose-invert max-w-none
                [&_h2]:text-emerald-400 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:first:mt-0
                [&_h3]:text-white [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                [&_p]:text-zinc-300 [&_p]:text-sm [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-zinc-300 [&_li]:text-sm
                [&_strong]:text-white [&_em]:text-zinc-400
                [&_.section-card]:bg-zinc-800/50 [&_.section-card]:border [&_.section-card]:border-zinc-700/50 [&_.section-card]:rounded-lg [&_.section-card]:p-5 [&_.section-card]:my-4
                print:bg-white print:text-black print:[&_h2]:text-emerald-700 print:[&_p]:text-gray-700 print:[&_li]:text-gray-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
