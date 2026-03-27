"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useRef, useMemo } from "react";
import MobileNav from "@/components/scout/MobileNav";

interface ActivityItem {
  id: string;
  type: "digest" | "application_created" | "status_change";
  description: string;
  icon: string;
  timestamp: string;
}

interface Props {
  user: { email: string; fullName: string };
  profile: {
    targetRoles: string[];
    targetLocations: string[];
    targetCompanies: string[];
    skills: string[];
  };
  digests: { id: string; jobsFound: number; sentAt: string }[];
  gate: "active" | "trialing" | "expired";
  trialDaysLeft: number;
  hasStripeCustomer: boolean;
  streakDays: number;
}

function getGreeting(fullName: string) {
  const hour = new Date().getHours();
  const firstName = fullName?.split(" ")[0] || "";
  if (hour < 12) return `Good morning${firstName ? `, ${firstName}` : ""}`;
  if (hour < 18) return `Good afternoon${firstName ? `, ${firstName}` : ""}`;
  return `Good evening${firstName ? `, ${firstName}` : ""}`;
}

function DashboardContent({
  user,
  profile,
  digests,
  gate,
  trialDaysLeft,
  hasStripeCustomer,
  streakDays,
}: Props) {
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get("checkout");

  const greeting = useMemo(() => getGreeting(user.fullName), [user.fullName]);

  const handleSubscribe = async () => {
    const res = await fetch("/scout/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleManageBilling = async () => {
    const res = await fetch("/scout/api/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleLogout = async () => {
    await fetch("/scout/api/logout", { method: "POST" });
    window.location.href = "/scout";
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Link href="/scout" className="text-xl font-bold">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/scout/onboarding" className="text-sm text-zinc-400 hover:text-white transition">
            Edit profile
          </Link>
          <Link href="/scout/settings" className="text-sm text-zinc-400 hover:text-white transition">
            Settings
          </Link>
          <span className="text-sm text-zinc-500">{user.email}</span>
          <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-red-400 transition">
            Log out
          </button>
        </div>
        <MobileNav onLogout={handleLogout} />
      </div>

      {/* AI Tools Bar */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-800 overflow-x-auto animate-fade-in delay-100">
        {[
          { href: "/scout/tracker", label: "Job Tracker", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { href: "/scout/cover-letter", label: "Cover Letter", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { href: "/scout/interview-prep", label: "Interview Prep", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
          { href: "/scout/resume-review", label: "Resume Review", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" },
          { href: "/scout/company-research", label: "Company Intel", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { href: "/scout/compare-offers", label: "Compare Offers", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" },
          { href: "/scout/interview-sim", label: "Mock Interview", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
          { href: "/scout/negotiate", label: "Negotiate Salary", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/30 rounded-lg text-sm text-zinc-300 hover:text-emerald-400 transition-all duration-200 whitespace-nowrap"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
            </svg>
            {tool.label}
          </Link>
        ))}
      </div>

      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 animate-fade-in delay-100">
        {greeting}
      </h1>

      {/* Checkout success message */}
      {checkoutStatus === "success" && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm animate-fade-in">
          Welcome aboard! Your subscription is active. Digests start tomorrow
          morning.
        </div>
      )}

      {/* Subscription status banner */}
      {gate === "trialing" && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <p className="text-amber-300 text-sm font-medium">
              Free trial — {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}{" "}
              left
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              Subscribe to keep your daily digests after the trial ends.
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg text-sm transition hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Subscribe — $29/mo
          </button>
        </div>
      )}

      {gate === "expired" && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div>
            <p className="text-red-300 text-sm font-medium">
              Trial expired
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              Subscribe to resume your daily job digests.
            </p>
          </div>
          <button
            onClick={handleSubscribe}
            className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg text-sm transition hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Subscribe — $29/mo
          </button>
        </div>
      )}

      {/* Stats + Streak */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { value: digests.length, label: "Digests received", emerald: true },
          { value: digests.reduce((sum, d) => sum + d.jobsFound, 0), label: "Jobs matched", emerald: true },
          { value: profile.targetRoles.length, label: "Target roles", emerald: false },
          { value: profile.targetCompanies.length, label: "Target companies", emerald: false },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in`}
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            <p className={`text-2xl font-bold ${stat.emerald ? "text-emerald-400" : "text-white"}`}>
              {stat.value}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
        {/* Streak card */}
        <div
          className={`bg-zinc-900 border rounded-xl p-4 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in ${streakDays > 3 ? "border-orange-500/40" : "border-zinc-800"}`}
          style={{ animationDelay: "520ms" }}
        >
          <p className="text-2xl font-bold text-orange-400 flex items-center gap-1.5">
            <span className="text-lg">&#x1F525;</span>
            {streakDays}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Day streak</p>
          {streakDays > 3 && (
            <p className="text-xs text-orange-400/80 mt-1">
              {streakDays >= 14 ? "Unstoppable!" : streakDays >= 7 ? "On fire!" : "Keep it up!"}
            </p>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Run scout now */}
      {gate !== "expired" && <RunScoutButton />}

      {/* Profile summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in delay-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your scout profile</h2>
          <Link
            href="/scout/onboarding"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            Edit
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Roles:</span>{" "}
            <span className="text-zinc-300">
              {profile.targetRoles.join(", ") || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Locations:</span>{" "}
            <span className="text-zinc-300">
              {profile.targetLocations.join(", ") || "Not set"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Companies:</span>{" "}
            <span className="text-zinc-300">
              {profile.targetCompanies.join(", ") || "Any"}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Skills:</span>{" "}
            <span className="text-zinc-300">
              {profile.skills.join(", ") || "Not set"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent digests */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in delay-400">
        <h2 className="text-lg font-semibold mb-4">Recent digests</h2>
        {digests.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No digests yet. Your first one will arrive tomorrow morning!
          </p>
        ) : (
          <div className="space-y-3">
            {digests.map((d, i) => (
              <Link
                key={d.id}
                href={`/scout/dashboard/digest/${d.id}`}
                className={`flex items-center justify-between py-2 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 -mx-2 px-2 rounded transition-all duration-200 animate-slide-up`}
                style={{ animationDelay: `${450 + i * 60}ms` }}
              >
                <div>
                  <p className="text-sm text-zinc-300">
                    {new Date(d.sentAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-400">
                    {d.jobsFound} job{d.jobsFound !== 1 ? "s" : ""} matched
                  </span>
                  <svg
                    className="w-4 h-4 text-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Referral card */}
      <ReferralCard />

      {/* Billing */}
      {hasStripeCustomer && gate === "active" && (
        <div className="text-center animate-fade-in delay-500">
          <button
            onClick={handleManageBilling}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition"
          >
            Manage billing
          </button>
        </div>
      )}
    </div>
  );
}

function relativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

const ACTIVITY_ICONS: Record<string, string> = {
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  bookmark: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  trophy: "M5 3h14l-1 9a5 5 0 01-5 4h-2a5 5 0 01-5-4L5 3zm2 0v2m10-2v2M12 16v4m-4 0h8",
  circle: "M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0",
};

const ACTIVITY_COLORS: Record<string, string> = {
  digest: "text-emerald-400",
  application_created: "text-blue-400",
  status_change: "text-amber-400",
};

function ActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/scout/api/activity")
      .then((res) => (res.ok ? res.json() : []))
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in delay-200">
      <h2 className="text-lg font-semibold mb-4">Activity</h2>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <svg className="w-5 h-5 animate-spin text-zinc-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-zinc-500 text-sm">No activity yet.</p>
          <p className="text-zinc-600 text-xs mt-1">
            Activity will show up as you receive digests and track applications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`mt-0.5 shrink-0 ${ACTIVITY_COLORS[item.type] || "text-zinc-500"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={ACTIVITY_ICONS[item.icon] || ACTIVITY_ICONS.circle} />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate">{item.description}</p>
              </div>
              <span className="text-xs text-zinc-600 shrink-0 whitespace-nowrap">
                {relativeTime(item.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RunScoutButton() {
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "rate-limited" | "error"
  >("idle");
  const [jobsFound, setJobsFound] = useState(0);
  const [nextRunAt, setNextRunAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateCountdown = useCallback(() => {
    if (!nextRunAt) return;
    const diff = nextRunAt.getTime() - Date.now();
    if (diff <= 0) {
      setState("idle");
      setNextRunAt(null);
      setCountdown("");
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setCountdown(
      `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`
    );
  }, [nextRunAt]);

  useEffect(() => {
    if (!nextRunAt) return;
    updateCountdown();
    timerRef.current = setInterval(updateCountdown, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextRunAt, updateCountdown]);

  const handleRun = async () => {
    setState("loading");
    try {
      const res = await fetch("/scout/api/run-now", { method: "POST" });
      const data = await res.json();

      if (res.status === 429) {
        setState("rate-limited");
        setNextRunAt(new Date(data.nextRunAt));
        return;
      }

      if (!res.ok) {
        setState("error");
        return;
      }

      setState("success");
      setJobsFound(data.jobsFound);
      setNextRunAt(new Date(Date.now() + 4 * 60 * 60 * 1000));
    } catch {
      setState("error");
    }
  };

  const isDisabled = state === "loading" || state === "rate-limited";

  return (
    <div className="mb-10 animate-fade-in delay-200">
      <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition-all duration-200 ${state === "idle" ? "animate-pulse-glow" : ""}`}>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Run my scout now
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {state === "loading"
              ? "Scouting jobs across all sources..."
              : state === "success"
                ? `Done! ${jobsFound} job${jobsFound !== 1 ? "s" : ""} found — check your email.`
                : state === "rate-limited"
                  ? `Available again in ${countdown}`
                  : state === "error"
                    ? "Something went wrong. Try again later."
                    : "Get an instant digest instead of waiting for the daily run."}
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={isDisabled}
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isDisabled
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : state === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-lg hover:shadow-emerald-500/20"
          }`}
        >
          {state === "loading" ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
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
              Scouting...
            </>
          ) : state === "success" ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Done
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Run now
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ReferralCard() {
  const [referral, setReferral] = useState<{
    code: string;
    referrals: number;
    shareUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/scout/api/referral")
      .then((res) => (res.ok ? res.json() : null))
      .then(setReferral)
      .catch(() => {});
  }, []);

  if (!referral) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referral.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in delay-500">
      <h2 className="text-lg font-semibold mb-2">Refer a friend</h2>
      <p className="text-zinc-400 text-sm mb-4">
        Share your link — you both get +7 days free when they sign up.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={referral.shareUrl}
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 select-all min-w-0"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-lg text-sm transition shrink-0 hover:shadow-lg hover:shadow-emerald-500/20"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {referral.referrals > 0 && (
        <p className="text-xs text-emerald-400 mt-3">
          {referral.referrals} friend{referral.referrals !== 1 ? "s" : ""}{" "}
          referred
        </p>
      )}
    </div>
  );
}

export default function DashboardClient(props: Props) {
  return (
    <Suspense>
      <DashboardContent {...props} />
    </Suspense>
  );
}
