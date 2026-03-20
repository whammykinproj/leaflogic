"use client";

import Link from "next/link";
import { useState } from "react";

// Hardcoded salary data — no API needed
const SALARY_DATA: Record<string, Record<string, { low: number; mid: number; high: number }>> = {
  "Software Engineer": {
    "San Francisco": { low: 130000, mid: 175000, high: 250000 },
    "New York": { low: 120000, mid: 165000, high: 235000 },
    "Austin": { low: 105000, mid: 145000, high: 200000 },
    "Seattle": { low: 125000, mid: 170000, high: 240000 },
    "Chicago": { low: 100000, mid: 140000, high: 195000 },
    "Los Angeles": { low: 115000, mid: 155000, high: 220000 },
    "Remote": { low: 110000, mid: 155000, high: 215000 },
    "Boston": { low: 115000, mid: 160000, high: 225000 },
    "Denver": { low: 105000, mid: 145000, high: 200000 },
    "Miami": { low: 95000, mid: 135000, high: 190000 },
  },
  "Product Manager": {
    "San Francisco": { low: 125000, mid: 170000, high: 240000 },
    "New York": { low: 120000, mid: 160000, high: 230000 },
    "Austin": { low: 100000, mid: 140000, high: 190000 },
    "Seattle": { low: 120000, mid: 165000, high: 235000 },
    "Chicago": { low: 95000, mid: 135000, high: 185000 },
    "Los Angeles": { low: 110000, mid: 150000, high: 210000 },
    "Remote": { low: 105000, mid: 150000, high: 210000 },
    "Boston": { low: 110000, mid: 155000, high: 220000 },
    "Denver": { low: 100000, mid: 140000, high: 195000 },
    "Miami": { low: 90000, mid: 130000, high: 180000 },
  },
  "Data Scientist": {
    "San Francisco": { low: 130000, mid: 175000, high: 245000 },
    "New York": { low: 120000, mid: 165000, high: 230000 },
    "Austin": { low: 105000, mid: 145000, high: 195000 },
    "Seattle": { low: 125000, mid: 170000, high: 235000 },
    "Chicago": { low: 100000, mid: 140000, high: 190000 },
    "Los Angeles": { low: 115000, mid: 155000, high: 215000 },
    "Remote": { low: 110000, mid: 150000, high: 210000 },
    "Boston": { low: 115000, mid: 160000, high: 220000 },
    "Denver": { low: 100000, mid: 140000, high: 195000 },
    "Miami": { low: 95000, mid: 135000, high: 185000 },
  },
  "UX Designer": {
    "San Francisco": { low: 110000, mid: 145000, high: 200000 },
    "New York": { low: 100000, mid: 135000, high: 190000 },
    "Austin": { low: 85000, mid: 115000, high: 160000 },
    "Seattle": { low: 105000, mid: 140000, high: 195000 },
    "Chicago": { low: 80000, mid: 115000, high: 160000 },
    "Los Angeles": { low: 95000, mid: 130000, high: 180000 },
    "Remote": { low: 90000, mid: 125000, high: 175000 },
    "Boston": { low: 95000, mid: 130000, high: 180000 },
    "Denver": { low: 85000, mid: 120000, high: 165000 },
    "Miami": { low: 80000, mid: 110000, high: 155000 },
  },
  "Marketing Manager": {
    "San Francisco": { low: 95000, mid: 130000, high: 180000 },
    "New York": { low: 90000, mid: 125000, high: 175000 },
    "Austin": { low: 75000, mid: 105000, high: 145000 },
    "Seattle": { low: 90000, mid: 125000, high: 170000 },
    "Chicago": { low: 75000, mid: 105000, high: 145000 },
    "Los Angeles": { low: 85000, mid: 120000, high: 165000 },
    "Remote": { low: 80000, mid: 110000, high: 155000 },
    "Boston": { low: 85000, mid: 120000, high: 165000 },
    "Denver": { low: 75000, mid: 105000, high: 145000 },
    "Miami": { low: 70000, mid: 100000, high: 140000 },
  },
  "DevOps Engineer": {
    "San Francisco": { low: 135000, mid: 175000, high: 245000 },
    "New York": { low: 125000, mid: 165000, high: 230000 },
    "Austin": { low: 110000, mid: 145000, high: 200000 },
    "Seattle": { low: 130000, mid: 170000, high: 240000 },
    "Chicago": { low: 105000, mid: 140000, high: 195000 },
    "Los Angeles": { low: 120000, mid: 155000, high: 220000 },
    "Remote": { low: 115000, mid: 155000, high: 215000 },
    "Boston": { low: 120000, mid: 160000, high: 220000 },
    "Denver": { low: 110000, mid: 145000, high: 200000 },
    "Miami": { low: 100000, mid: 135000, high: 190000 },
  },
};

const ROLES = Object.keys(SALARY_DATA);
const LOCATIONS = Object.keys(SALARY_DATA["Software Engineer"]);

function fmt(n: number) {
  return "$" + n.toLocaleString();
}

export default function SalaryLookupPage() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const result = role && location ? SALARY_DATA[role]?.[location] : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/scout" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/scout/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/scout/login?signup=true"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5">
          Free Tool
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Salary Range Lookup
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          See what companies are paying for your role in your city. Know your
          worth before you negotiate.
        </p>
      </div>

      {/* Lookup form */}
      <div className="max-w-xl mx-auto px-6 pb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select a role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="max-w-xl mx-auto px-6 pb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-1">
              {role} in {location}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Estimated annual salary range (2026)
            </p>

            {/* Visual bar */}
            <div className="relative mb-8">
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #065f46, #10b981, #34d399)",
                    width: "100%",
                  }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <div className="text-center">
                  <p className="text-xs text-zinc-500">25th %ile</p>
                  <p className="text-sm font-semibold text-zinc-300">
                    {fmt(result.low)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500">Median</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {fmt(result.mid)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500">90th %ile</p>
                  <p className="text-sm font-semibold text-zinc-300">
                    {fmt(result.high)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500">Monthly</p>
                <p className="text-sm font-semibold text-zinc-300">
                  {fmt(Math.round(result.mid / 12))}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500">Bi-weekly</p>
                <p className="text-sm font-semibold text-zinc-300">
                  {fmt(Math.round(result.mid / 26))}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-zinc-500">Hourly (est.)</p>
                <p className="text-sm font-semibold text-zinc-300">
                  {fmt(Math.round(result.mid / 2080))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-zinc-800">
        <h2 className="text-2xl font-bold mb-3">
          Know what you're worth. Find the roles that pay it.
        </h2>
        <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
          JobScout AI matches you with roles that fit your salary expectations,
          skills, and career goals — delivered to your inbox every morning.
        </p>
        <Link
          href="/scout/login?signup=true"
          className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3 rounded-lg transition"
        >
          Get personalized job matches — free for 7 days
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">
            <Link href="/scout" className="hover:text-zinc-300">
              JobScout AI
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/scout/tools/job-market-pulse" className="hover:text-zinc-300">
              Job Market Pulse
            </Link>
            <Link href="/scout/blog" className="hover:text-zinc-300">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
