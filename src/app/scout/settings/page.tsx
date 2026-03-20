"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DigestFrequency = "daily" | "3x_week" | "weekly";

const frequencyOptions: { value: DigestFrequency; label: string; description: string }[] = [
  { value: "daily", label: "Daily", description: "Every weekday morning" },
  { value: "3x_week", label: "3x / week", description: "Mon, Wed, Fri" },
  { value: "weekly", label: "Weekly", description: "Every Monday morning" },
];

export default function SettingsPage() {
  const [digestFrequency, setDigestFrequency] = useState<DigestFrequency>("daily");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    fetch("/scout/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.digest_frequency) setDigestFrequency(data.digest_frequency);
        if (typeof data.email_notifications === "boolean")
          setEmailNotifications(data.email_notifications);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (updates: Record<string, unknown>) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/scout/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = (freq: DigestFrequency) => {
    setDigestFrequency(freq);
    handleSave({ digest_frequency: freq });
  };

  const handleNotificationToggle = () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    handleSave({ email_notifications: next });
  };

  const handleManageBilling = async () => {
    const res = await fetch("/scout/api/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/scout/api/settings", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/scout";
      }
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
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
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Back to dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        {/* Save indicator */}
        {saved && (
          <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm text-center">
            Settings saved
          </div>
        )}

        {/* Digest frequency */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Digest frequency</h2>
          <p className="text-sm text-zinc-500 mb-4">
            How often do you want to receive job digests?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {frequencyOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFrequencyChange(opt.value)}
                disabled={saving}
                className={`p-4 rounded-xl border text-left transition ${
                  digestFrequency === opt.value
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    digestFrequency === opt.value
                      ? "text-emerald-400"
                      : "text-zinc-300"
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Email notifications */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Email notifications
              </h2>
              <p className="text-sm text-zinc-500">
                Receive digest emails in your inbox
              </p>
            </div>
            <button
              onClick={handleNotificationToggle}
              disabled={saving}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                emailNotifications ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  emailNotifications ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-1">Billing</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Manage your subscription, update payment methods, or cancel.
          </p>
          <button
            onClick={handleManageBilling}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
          >
            Open billing portal
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-400 mb-1">
            Danger zone
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Permanently delete your JobScout account, profile, and all digest
            history. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium px-4 py-2 rounded-lg text-sm transition"
          >
            Delete my account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-2">
              Delete your account?
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              This will permanently remove your profile, all digest history, and
              account data. Your subscription (if active) will also be canceled.
              This cannot be undone.
            </p>
            <p className="text-sm text-zinc-300 mb-2">
              Type <span className="font-mono text-red-400">DELETE</span> to
              confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium px-4 py-2 rounded-lg text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 disabled:text-red-300/50 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
              >
                {deleting ? "Deleting..." : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
