"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import MobileNav from "@/components/scout/MobileNav";

interface Application {
  id: string;
  company: string;
  role_title: string;
  url: string | null;
  status: string;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

const STATUSES = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "rejected",
] as const;

const PIPELINE_STATUSES = [
  "saved",
  "applied",
  "interviewing",
  "offered",
] as const;

const STATUS_LABELS: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-zinc-600",
  applied: "bg-blue-500",
  interviewing: "bg-amber-500",
  offered: "bg-emerald-500",
  rejected: "bg-red-500",
  withdrawn: "bg-zinc-500",
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  saved: "text-zinc-400",
  applied: "text-blue-400",
  interviewing: "text-amber-400",
  offered: "text-emerald-400",
  rejected: "text-red-400",
  withdrawn: "text-zinc-400",
};

type EmailType = "thank_you" | "status_check" | "follow_up" | "negotiate";

const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  thank_you: "Thank You",
  status_check: "Status Check",
  follow_up: "Follow-up After Interview",
  negotiate: "Negotiate Offer",
};

// --- Helper: days since a date ---
function daysSince(dateStr: string): number {
  const now = new Date();
  const then = new Date(dateStr);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

// --- Helper: get follow-up alert for an application ---
function getFollowUpAlert(app: Application): { text: string; color: string } | null {
  const days = daysSince(app.updated_at);
  if (app.status === "applied" && days >= 5) {
    return { text: "Follow up recommended", color: "amber" };
  }
  if (app.status === "interviewing" && days >= 3) {
    return { text: "Send thank you note", color: "amber" };
  }
  if (app.status === "offered" && days >= 2) {
    return { text: "Respond soon", color: "red" };
  }
  return null;
}

// --- Follow-up Modal ---
function FollowUpModal({
  app,
  onClose,
}: {
  app: Application;
  onClose: () => void;
}) {
  const [emailType, setEmailType] = useState<EmailType>("status_check");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/scout/api/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: app.company,
          role: app.role_title,
          status: app.status,
          context,
          type: emailType,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate");
        return;
      }
      const data = await res.json();
      setResult(data.html);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-semibold text-white">Draft Follow-up</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {app.company} &middot; {app.role_title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition text-lg leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email type</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(EMAIL_TYPE_LABELS) as EmailType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setEmailType(type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${
                    emailType === type
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {EMAIL_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              Additional context <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="e.g. Interviewed with Sarah, discussed ML pipeline project..."
            />
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition"
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {result && (
            <div className="space-y-3">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <pre className="text-sm text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {result}
                </pre>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy to clipboard
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Application Card ---
function AppCard({
  app,
  onStatusChange,
  onDelete,
  onDraftFollowUp,
}: {
  app: Application;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onDraftFollowUp: (app: Application) => void;
}) {
  const alert = getFollowUpAlert(app);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 group">
      <div className="flex items-start justify-between mb-1">
        <h4 className="text-sm font-medium text-white truncate flex-1">
          {app.company}
        </h4>
        <button
          onClick={() => onDelete(app.id)}
          className="text-zinc-700 hover:text-red-400 text-xs ml-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          title="Remove"
        >
          x
        </button>
      </div>
      <p className="text-xs text-zinc-400 truncate mb-2">{app.role_title}</p>

      {alert && (
        <div
          className={`mb-2 px-2 py-1 rounded text-xs font-medium ${
            alert.color === "red"
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          {alert.text}
        </div>
      )}

      {app.url && (
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 block truncate mb-2"
        >
          View listing
        </a>
      )}
      {app.notes && (
        <p className="text-xs text-zinc-500 truncate mb-2">{app.notes}</p>
      )}
      <div className="flex items-center justify-between mb-2">
        <select
          value={app.status}
          onChange={(e) => onStatusChange(app.id, e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <span className="text-xs text-zinc-600">
          {new Date(app.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <button
        onClick={() => onDraftFollowUp(app)}
        className="w-full text-xs text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 rounded py-1 transition md:opacity-0 md:group-hover:opacity-100"
      >
        Draft Follow-up
      </button>
    </div>
  );
}

// --- Timeline Entry ---
function TimelineEntry({ app }: { app: Application }) {
  const alert = getFollowUpAlert(app);
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[app.status]} mt-1 ring-4 ring-zinc-950`} />
        <div className="w-px flex-1 bg-zinc-800 group-last:hidden" />
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 mb-3 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{app.company}</h4>
            <p className="text-xs text-zinc-400 truncate">{app.role_title}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-xs font-medium ${STATUS_TEXT_COLORS[app.status]}`}>
              {STATUS_LABELS[app.status]}
            </span>
            <span className="text-xs text-zinc-600">
              {new Date(app.updated_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        {alert && (
          <div
            className={`mt-2 px-2 py-1 rounded text-xs font-medium inline-block ${
              alert.color === "red"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {alert.text}
          </div>
        )}
        {app.notes && (
          <p className="text-xs text-zinc-500 mt-2 truncate">{app.notes}</p>
        )}
      </div>
    </div>
  );
}

// --- Pipeline Visualization ---
function PipelineViz({ apps }: { apps: Application[] }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of PIPELINE_STATUSES) {
      c[s] = apps.filter((a) => a.status === s).length;
    }
    return c;
  }, [apps]);

  const max = Math.max(...Object.values(counts), 1);

  const conversionRates = useMemo(() => {
    const rates: Record<string, string> = {};
    for (let i = 1; i < PIPELINE_STATUSES.length; i++) {
      const prev = counts[PIPELINE_STATUSES[i - 1]];
      const curr = counts[PIPELINE_STATUSES[i]];
      rates[PIPELINE_STATUSES[i]] =
        prev > 0 ? `${Math.round((curr / prev) * 100)}%` : "--";
    }
    return rates;
  }, [counts]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">Application Pipeline</h3>

      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-end gap-3">
        {PIPELINE_STATUSES.map((status, i) => {
          const pct = max > 0 ? (counts[status] / max) * 100 : 0;
          return (
            <div key={status} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-lg font-bold text-white">{counts[status]}</span>
              <div className="w-full bg-zinc-800 rounded-lg overflow-hidden" style={{ height: "80px" }}>
                <div
                  className={`w-full ${STATUS_COLORS[status]} rounded-lg transition-all duration-500`}
                  style={{ height: `${Math.max(pct, 4)}%`, marginTop: `${100 - Math.max(pct, 4)}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${STATUS_TEXT_COLORS[status]}`}>
                {STATUS_LABELS[status]}
              </span>
              {i > 0 && (
                <span className="text-xs text-zinc-600">{conversionRates[status]}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical / stacked */}
      <div className="md:hidden space-y-3">
        {PIPELINE_STATUSES.map((status, i) => {
          const pct = max > 0 ? (counts[status] / max) * 100 : 0;
          return (
            <div key={status}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${STATUS_TEXT_COLORS[status]}`}>
                  {STATUS_LABELS[status]}
                </span>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="text-xs text-zinc-600">{conversionRates[status]}</span>
                  )}
                  <span className="text-sm font-bold text-white">{counts[status]}</span>
                </div>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${STATUS_COLORS[status]} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Stats Dashboard ---
function StatsDashboard({ apps }: { apps: Application[] }) {
  const stats = useMemo(() => {
    const total = apps.length;
    const nonSaved = apps.filter((a) => a.status !== "saved");
    const movedPast = nonSaved.filter(
      (a) => a.status !== "applied" && a.status !== "rejected"
    );
    const responseRate =
      nonSaved.length > 0
        ? Math.round((movedPast.length / nonSaved.length) * 100)
        : 0;

    // Average days in each stage
    const stageDays: Record<string, number[]> = {};
    for (const app of apps) {
      const days = daysSince(app.updated_at);
      if (!stageDays[app.status]) stageDays[app.status] = [];
      stageDays[app.status].push(days);
    }
    const avgDays: Record<string, number> = {};
    for (const [status, arr] of Object.entries(stageDays)) {
      avgDays[status] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }

    // Most active week
    const weekCounts: Record<string, number> = {};
    for (const app of apps) {
      const d = new Date(app.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      weekCounts[key] = (weekCounts[key] || 0) + 1;
    }
    let mostActiveWeek = "--";
    let mostActiveCount = 0;
    for (const [week, count] of Object.entries(weekCounts)) {
      if (count > mostActiveCount) {
        mostActiveCount = count;
        mostActiveWeek = `Week of ${week}`;
      }
    }

    // Interview rate
    const interviewCount = apps.filter(
      (a) => a.status === "interviewing" || a.status === "offered"
    ).length;
    const appliedCount = nonSaved.length;
    const interviewRate =
      appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;

    return {
      total,
      responseRate,
      interviewRate,
      avgDays,
      mostActiveWeek,
      mostActiveCount,
    };
  }, [apps]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-2xl font-bold text-emerald-400">{stats.total}</p>
        <p className="text-xs text-zinc-500 mt-1">Total applications</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-2xl font-bold text-emerald-400">{stats.responseRate}%</p>
        <p className="text-xs text-zinc-500 mt-1">Response rate</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-2xl font-bold text-emerald-400">{stats.interviewRate}%</p>
        <p className="text-xs text-zinc-500 mt-1">Interview rate</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-lg font-bold text-emerald-400 truncate">{stats.mostActiveWeek}</p>
        <p className="text-xs text-zinc-500 mt-1">Most active ({stats.mostActiveCount} apps)</p>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("saved");
  const [viewMode, setViewMode] = useState<"kanban" | "timeline">("kanban");
  const [followUpApp, setFollowUpApp] = useState<Application | null>(null);
  const [form, setForm] = useState({
    company: "",
    role_title: "",
    url: "",
    notes: "",
  });

  const fetchApps = useCallback(async () => {
    try {
      const res = await fetch("/scout/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role_title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/scout/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newApp = await res.json();
        setApps((prev) => [newApp, ...prev]);
        setForm({ company: "", role_title: "", url: "", notes: "" });
        setShowForm(false);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "applied") {
      const app = apps.find((a) => a.id === id);
      if (app && !app.applied_at) {
        updates.applied_at = new Date().toISOString();
      }
    }

    try {
      const res = await fetch(`/scout/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
      }
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/scout/api/applications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApps((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      // silent
    }
  };

  const grouped = STATUSES.reduce(
    (acc, status) => {
      acc[status] = apps.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<string, Application[]>
  );

  const timelineSorted = useMemo(
    () => [...apps].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()),
    [apps]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      {/* Follow-up Modal */}
      {followUpApp && (
        <FollowUpModal
          app={followUpApp}
          onClose={() => setFollowUpApp(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/scout" className="text-xl font-bold">
            <span className="text-emerald-400">JobScout</span>{" "}
            <span className="text-zinc-400 font-normal">AI</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/scout/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            href="/scout/settings"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Settings
          </Link>
        </div>
        <MobileNav />
      </div>

      {/* Title + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <h1 className="text-2xl font-bold">Application Tracker</h1>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === "kanban"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === "timeline"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              Timeline
            </button>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition"
          >
            {showForm ? "Cancel" : "+ Add job"}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8"
        >
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company: e.target.value }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Stripe"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Role *
              </label>
              <input
                type="text"
                value={form.role_title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role_title: e.target.value }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                placeholder="e.g. Senior Product Manager"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Job URL
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                placeholder="Any notes..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-6 py-2 rounded-lg text-sm transition"
          >
            {saving ? "Saving..." : "Save job"}
          </button>
        </form>
      )}

      {/* Pipeline Visualization */}
      {!loading && apps.length > 0 && <PipelineViz apps={apps} />}

      {/* Stats Dashboard */}
      {!loading && apps.length > 0 && <StatsDashboard apps={apps} />}

      {/* Content Area */}
      {loading ? (
        <div className="text-center text-zinc-500 py-20">Loading...</div>
      ) : viewMode === "timeline" ? (
        /* Timeline View */
        <div className="max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold text-zinc-400 mb-4">Activity Timeline</h2>
          {timelineSorted.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-lg p-12 text-center">
              <p className="text-sm text-zinc-600">No applications yet. Add your first job above.</p>
            </div>
          ) : (
            <div>
              {timelineSorted.map((app) => (
                <TimelineEntry key={app.id} app={app} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Kanban / Card View */
        <>
          {/* Mobile: Tabbed view */}
          <div className="md:hidden">
            {/* Tab bar */}
            <div className="flex overflow-x-auto gap-1 mb-4 pb-1 -mx-1 px-1">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    activeTab === status
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]}`}
                  />
                  {STATUS_LABELS[status]}
                  <span className="text-zinc-600 ml-0.5">
                    {grouped[status].length}
                  </span>
                </button>
              ))}
            </div>

            {/* Active tab content */}
            <div className="space-y-2 min-h-[200px]">
              {grouped[activeTab]?.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center">
                  <p className="text-sm text-zinc-600">
                    No {STATUS_LABELS[activeTab]?.toLowerCase()} jobs
                  </p>
                </div>
              ) : (
                grouped[activeTab]?.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onDraftFollowUp={setFollowUpApp}
                  />
                ))
              )}
            </div>
          </div>

          {/* Desktop: Kanban columns */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]}`}
                  />
                  <h3 className="text-sm font-semibold text-zinc-300">
                    {STATUS_LABELS[status]}
                  </h3>
                  <span className="text-xs text-zinc-600 ml-auto">
                    {grouped[status].length}
                  </span>
                </div>

                <div className="space-y-2">
                  {grouped[status].length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-lg p-4 text-center">
                      <p className="text-xs text-zinc-600">
                        No {STATUS_LABELS[status].toLowerCase()} jobs
                      </p>
                    </div>
                  ) : (
                    grouped[status].map((app) => (
                      <AppCard
                        key={app.id}
                        app={app}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onDraftFollowUp={setFollowUpApp}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
