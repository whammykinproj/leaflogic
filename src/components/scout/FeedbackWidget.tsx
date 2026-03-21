"use client";

import { useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature" | "feedback">("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async () => {
    if (!message.trim() || message.length < 5) return;
    setStatus("sending");

    try {
      const res = await fetch("/scout/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message,
          page: window.location.pathname,
        }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        setMessage("");
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-all duration-200 shadow-lg"
        aria-label="Send feedback"
      >
        {open ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 animate-fade-in">
          {status === "sent" ? (
            <div className="text-center py-4">
              <svg className="w-8 h-8 text-emerald-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-zinc-300">Thanks for your feedback!</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-white mb-3">
                Send us feedback
              </p>

              <div className="flex gap-2 mb-3">
                {(["feedback", "bug", "feature"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1 rounded-lg text-xs border transition ${
                      type === t
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {t === "bug" ? "Bug" : t === "feature" ? "Feature" : "Feedback"}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-24 bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
              />

              {status === "error" && (
                <p className="text-red-400 text-xs mt-1">
                  Failed to send. Try again.
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === "sending" || message.length < 5}
                className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium py-2 rounded-lg text-sm transition"
              >
                {status === "sending" ? "Sending..." : "Send"}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
