"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import MobileNav from "@/components/scout/MobileNav";

export default function NegotiatePage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [equity, setEquity] = useState("");
  const [signingBonus, setSigningBonus] = useState("");
  const [benefits, setBenefits] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setHtml(null);

    const salaryNum = Number(baseSalary.replace(/[^0-9]/g, ""));
    const bonusNum = signingBonus
      ? Number(signingBonus.replace(/[^0-9]/g, ""))
      : undefined;

    try {
      const res = await fetch("/scout/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          baseSalary: salaryNum,
          equity: equity || undefined,
          signingBonus: bonusNum,
          benefits: benefits || undefined,
          experience,
          location,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to analyze offer.");
        return;
      }

      setHtml(data.html);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmail = useCallback((index: number) => {
    const templates = document.querySelectorAll(".email-template");
    if (templates[index]) {
      navigator.clipboard.writeText(
        (templates[index] as HTMLElement).innerText
      );
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  }, []);

  const handleReset = () => {
    setHtml(null);
    setError(null);
    setCompany("");
    setRole("");
    setBaseSalary("");
    setEquity("");
    setSigningBonus("");
    setBenefits("");
    setExperience("");
    setLocation("");
  };

  const formatSalaryInput = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return Number(digits).toLocaleString();
  };

  const isFormValid = company && role && baseSalary && experience && location;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link href="/scout/dashboard" className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/dashboard"
          className="hidden md:inline text-sm text-zinc-400 hover:text-white transition"
        >
          Dashboard
        </Link>
        <MobileNav />
      </div>

      <h1 className="text-3xl font-bold mb-2 animate-fade-in">
        Salary Negotiation Coach
      </h1>
      <p className="text-zinc-400 mb-8 animate-fade-in">
        Get AI-powered negotiation strategy, counter-offer numbers, and
        ready-to-send email templates.
      </p>

      {/* Step 1: Form */}
      {!html && (
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
                placeholder="Stripe"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Role title *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Software Engineer"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Base salary offered *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={baseSalary}
                  onChange={(e) =>
                    setBaseSalary(formatSalaryInput(e.target.value))
                  }
                  placeholder="150,000"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Equity / RSUs{" "}
                <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="text"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="$50k/yr RSUs over 4 years"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Signing bonus{" "}
                <span className="text-zinc-500">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={signingBonus}
                  onChange={(e) =>
                    setSigningBonus(formatSalaryInput(e.target.value))
                  }
                  placeholder="25,000"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Experience level *
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="" disabled>
                  Select level
                </option>
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid">Mid (3-5 years)</option>
                <option value="Senior">Senior (5-8 years)</option>
                <option value="Staff">Staff (8-12 years)</option>
                <option value="Principal">Principal (12+ years)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-zinc-300 mb-2">
              Other benefits / perks{" "}
              <span className="text-zinc-500">(optional)</span>
            </label>
            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Remote work, 401k match, unlimited PTO, health insurance..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading || !isFormValid}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-3 rounded-lg transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Analyzing your offer...
              </span>
            ) : (
              "Analyze My Offer"
            )}
          </button>
        </div>
      )}

      {/* Step 2: Results */}
      {html && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Negotiation Strategy for{" "}
              <span className="text-emerald-400">{role}</span> at{" "}
              <span className="text-emerald-400">{company}</span>
            </h2>
            <button
              onClick={handleReset}
              className="text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition"
            >
              Reset
            </button>
          </div>

          {/* Copy buttons for email templates */}
          <div className="mb-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleCopyEmail(0)}
              className="text-sm text-zinc-400 hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {copiedIdx === 0 ? "Copied!" : "Copy counter-offer email"}
            </button>
            <button
              onClick={() => handleCopyEmail(1)}
              className="text-sm text-zinc-400 hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {copiedIdx === 1 ? "Copied!" : "Copy follow-up email"}
            </button>
          </div>

          {/* AI Output */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div
              className="prose prose-sm prose-invert max-w-none
                [&_h2]:text-emerald-400 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-white [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                [&_p]:text-zinc-300 [&_p]:text-sm [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-zinc-300 [&_li]:text-sm
                [&_strong]:text-white [&_em]:text-zinc-400
                [&_.email-template]:bg-zinc-800 [&_.email-template]:border [&_.email-template]:border-zinc-700 [&_.email-template]:rounded-lg [&_.email-template]:p-4 [&_.email-template]:my-4
                [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:text-zinc-400 [&_th]:pb-2 [&_th]:border-b [&_th]:border-zinc-700 [&_td]:py-2 [&_td]:text-zinc-300 [&_td]:border-b [&_td]:border-zinc-800
                [&_hr]:border-zinc-800 [&_hr]:my-6"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              ← Analyze another offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
