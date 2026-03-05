"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Beehiiv, ConvertKit, or Mailchimp API
    setSubmitted(true);
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
        <h3 className="text-xl font-bold text-green-dark">
          Get Weekly Plant Tips
        </h3>
        <p className="mt-2 text-sm text-foreground/50">
          Join plant parents who get one actionable tip every week. No spam, unsubscribe anytime.
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
          className="rounded-xl bg-green-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-dark hover:shadow-md"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
