"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import ShareBar from "@/components/scout/ShareBar";
import MobileNav from "@/components/scout/MobileNav";

export default function InterviewPrepPage() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setHtml("");
    setLoading(true);

    try {
      const res = await fetch("/scout/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, jobDescription }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setHtml(data.html);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!resultRef.current) return;
    try {
      // Copy the rendered text content (not raw HTML)
      const text = resultRef.current.innerText;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select + copy
      const range = document.createRange();
      range.selectNodeContents(resultRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/scout" className="text-xl font-bold">
            <span className="text-emerald-400">JobScout</span>{" "}
            <span className="text-zinc-400 font-normal">AI</span>
          </Link>
        </div>
        <Link
          href="/scout/dashboard"
          className="hidden md:inline text-sm text-zinc-400 hover:text-white transition"
        >
          Back to dashboard
        </Link>
        <MobileNav />
      </div>

      <h1 className="text-2xl font-bold mb-2">Interview Prep</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Paste a job description and get AI-generated interview prep tailored to
        your resume.
      </p>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Company name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Role title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Product Manager"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">
            Job description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            required
            rows={10}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition resize-y"
          />
          <p className="text-xs text-zinc-600 mt-1">
            {jobDescription.length.toLocaleString()} / 15,000 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !company || !role || !jobDescription}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-medium px-6 py-2.5 rounded-lg text-sm transition"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating prep...
            </span>
          ) : (
            "Generate prep"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {html && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Your prep for {role} at {company}
            </h2>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <div
            ref={resultRef}
            className="prose prose-invert prose-emerald max-w-none text-sm
              [&_h2]:text-emerald-400 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-zinc-800 [&_h2]:pb-2
              [&_h3]:text-white [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-1
              [&_p]:text-zinc-300 [&_p]:leading-relaxed [&_p]:mb-2
              [&_b]:text-emerald-300
              [&_ul]:text-zinc-300 [&_ul]:space-y-1 [&_ul]:list-disc [&_ul]:pl-5
              [&_li]:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <ShareBar action="prep for an interview" />
        </div>
      )}
    </div>
  );
}
