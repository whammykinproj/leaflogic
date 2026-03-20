"use client";

import Link from "next/link";
import { useState } from "react";
import ShareBar from "@/components/scout/ShareBar";
import MobileNav from "@/components/scout/MobileNav";

export default function ResumeReviewPage() {
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/scout/api/resume-review", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate review");
        return;
      }

      setHtml(data.html);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

      <h1 className="text-3xl font-bold mb-2">AI Resume Review</h1>
      <p className="text-zinc-400 mb-8">
        Get instant, actionable feedback on your resume from AI — tailored to
        your target roles.
      </p>

      {!html && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
          </div>
          <p className="text-zinc-300 mb-2 font-medium">
            We&apos;ll analyze the resume from your profile
          </p>
          <p className="text-zinc-500 text-sm mb-6">
            Uses your resume text, target roles, and skills to give personalized
            feedback.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleReview}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Analyzing your resume...
              </span>
            ) : (
              "Review my resume"
            )}
          </button>
        </div>
      )}

      {html && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Review</h2>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const text = document.getElementById("review-content")?.innerText;
                  if (text) navigator.clipboard.writeText(text);
                }}
                className="text-sm text-zinc-400 hover:text-emerald-400 transition"
              >
                Copy to clipboard
              </button>
              <button
                onClick={() => {
                  setHtml(null);
                  setError(null);
                }}
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Run again
              </button>
            </div>
          </div>
          <div
            id="review-content"
            className="bg-white rounded-xl p-8 text-zinc-900 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <ShareBar action="get an AI resume review" />
        </div>
      )}
    </div>
  );
}
