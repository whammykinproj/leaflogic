"use client";

import Link from "next/link";
import { useState } from "react";

export default function CompanyResearchPage() {
  const [company, setCompany] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleResearch = async () => {
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/scout/api/company-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, context }),
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <Link href="/scout/dashboard" className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <Link
          href="/scout/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          Back to dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Company Research</h1>
      <p className="text-zinc-400 mb-8">
        Get an AI-generated brief on any company — culture, interview intel,
        talking points, and red flags. Perfect for interview prep.
      </p>

      {!html && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">
              Company name *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Anthropic"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">
              Additional context (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., I'm applying for a PM role on their API team..."
              className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleResearch}
            disabled={loading || !company}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-3 rounded-lg transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Researching {company}...
              </span>
            ) : (
              "Research this company"
            )}
          </button>
        </div>
      )}

      {html && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Research Brief: {company}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="text-sm text-zinc-400 hover:text-emerald-400 transition"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
              <button
                onClick={() => {
                  setHtml(null);
                  setCompany("");
                  setContext("");
                  setError(null);
                }}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Research another
              </button>
            </div>
          </div>
          <div
            id="research-content"
            className="bg-white rounded-xl p-8 text-zinc-900 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}
