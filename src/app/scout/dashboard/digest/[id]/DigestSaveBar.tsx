"use client";

import { useState } from "react";
import { useToast } from "@/lib/scout/toast";

interface Props {
  digestHtml: string;
}

export default function DigestSaveBar({ digestHtml }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleOpen = () => {
    // Try to pre-fill from digest HTML by parsing job headings
    // Digest format uses <h3>Company — Role Title</h3>
    const match = digestHtml.match(/<h3[^>]*>([^<]+)\s*[—–-]\s*([^<]+)<\/h3>/i);
    if (match) {
      setCompany(match[1].trim());
      setRoleTitle(match[2].trim());
    }
    // Try to find a URL near the first match
    const urlMatch = digestHtml.match(/href="(https?:\/\/[^"]+)"/i);
    if (urlMatch) {
      setUrl(urlMatch[1]);
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !roleTitle.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/scout/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          role_title: roleTitle.trim(),
          url: url.trim() || undefined,
          status: "saved",
        }),
      });

      if (res.ok) {
        toast("Job saved to tracker!", "success");
        setShowModal(false);
        setCompany("");
        setRoleTitle("");
        setUrl("");
      } else {
        toast("Failed to save job", "error");
      }
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Floating action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-900/95 backdrop-blur-sm px-5 py-3 shadow-2xl">
            <p className="text-sm text-zinc-400">
              See a role you like?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpen}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Save to Tracker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Save job to tracker
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 transition hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  Company *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Stripe"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  Role *
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Senior PM"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-zinc-400">
                  Job URL (optional)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
