"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/scout/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "landing_page" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20 text-center border-t border-zinc-800">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400 font-medium text-sm">You&apos;re in! Check your inbox.</span>
        </div>
        <p className="text-zinc-500 text-sm">
          We&apos;ll send you free job market insights and career tips. No spam, ever.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-20 text-center border-t border-zinc-800">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Not ready to commit? Get job market insights free.
      </h2>
      <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
        Salary trends, hiring signals, and career tips delivered to your inbox. No account needed.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
          className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">{errorMsg}</p>
      )}

      <p className="text-zinc-600 text-xs mt-4">
        Free forever. Unsubscribe anytime.
      </p>
    </section>
  );
}
