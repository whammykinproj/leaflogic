"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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

function AppCard({
  app,
  onStatusChange,
  onDelete,
}: {
  app: Application;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
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
      <div className="flex items-center justify-between">
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
    </div>
  );
}

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("saved");
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

  const totalTracked = apps.length;
  const appliedCount = apps.filter((a) => a.status !== "saved").length;
  const interviewCount = apps.filter(
    (a) => a.status === "interviewing" || a.status === "offered"
  ).length;
  const interviewRate =
    appliedCount > 0
      ? Math.round((interviewCount / appliedCount) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
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

      {/* Title + Add button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Application Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg text-sm transition"
        >
          {showForm ? "Cancel" : "+ Add job"}
        </button>
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
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-medium px-6 py-2 rounded-lg text-sm transition"
          >
            {saving ? "Saving..." : "Save job"}
          </button>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-400">{totalTracked}</p>
          <p className="text-xs text-zinc-500 mt-1">Total tracked</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-400">{appliedCount}</p>
          <p className="text-xs text-zinc-500 mt-1">Applied+</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-2xl font-bold text-emerald-400">
            {interviewRate}%
          </p>
          <p className="text-xs text-zinc-500 mt-1">Interview rate</p>
        </div>
      </div>

      {/* Kanban / Tabs */}
      {loading ? (
        <div className="text-center text-zinc-500 py-20">Loading...</div>
      ) : (
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
