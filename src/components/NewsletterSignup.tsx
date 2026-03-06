"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-light/30 bg-green-bg p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-light/20 text-2xl">
          &#10003;
        </div>
        <p className="mt-4 text-lg font-semibold text-green-primary">
          Welcome to the plant fam!
        </p>
        <p className="mt-1 text-sm text-foreground/50">
          Check your inbox for your first tip.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-green-bg p-8 sm:p-10">
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <svg className="h-6 w-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7.5-8-11a8 8 0 0116 0c0 3.5-4 7-8 11z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10" />
          </svg>
          <h3 className="text-xl font-bold text-green-dark">
            Get Weekly Plant Tips
          </h3>
        </div>
        <p className="mt-2 text-sm text-foreground/50">
          Join 2,500+ plant lovers who get one actionable tip every week. No spam, unsubscribe anytime.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm transition-colors focus:border-green-light focus:outline-none focus:ring-2 focus:ring-green-light/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-dark hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
