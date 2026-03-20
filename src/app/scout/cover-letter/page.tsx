"use client";

import Link from "next/link";
import { useState } from "react";
import ShareBar from "@/components/scout/ShareBar";
import MobileNav from "@/components/scout/MobileNav";

export default function CoverLetterPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/scout/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jobDescription }),
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
    const el = document.getElementById("cover-letter-content");
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          Back to dashboard
        </Link>
        <MobileNav />
      </div>

      <h1 className="text-3xl font-bold mb-2">AI Cover Letter Generator</h1>
      <p className="text-zinc-400 mb-8">
        Generate a personalized cover letter in seconds — tailored to the role
        and your resume.
      </p>

      {!html && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-2">
                Company *
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
                Role *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Product Manager"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-300 mb-2">
              Job description (optional, improves quality)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={loading || !company || !role}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold py-3 rounded-lg transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Writing your cover letter...
              </span>
            ) : (
              "Generate cover letter"
            )}
          </button>
        </div>
      )}

      {html && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Cover Letter for {role} at {company}
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
                  setError(null);
                }}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Generate another
              </button>
            </div>
          </div>
          <div
            id="cover-letter-content"
            className="bg-white rounded-xl p-8 text-zinc-900 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <ShareBar action="generate a cover letter" />
        </div>
      )}
    </div>
  );
}
