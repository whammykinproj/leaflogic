"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to Beehiiv, ConvertKit, or Mailchimp API
    // For now, just show success state
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl bg-green-bg p-8 text-center">
        <p className="text-lg font-semibold text-green-primary">
          Welcome to the plant fam!
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Check your inbox for your first tip.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-green-bg p-8">
      <h3 className="text-lg font-bold text-green-primary">
        Get Weekly Plant Tips
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Join 1,000+ plant parents. One email a week, no spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-green-light focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-green-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-light"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
