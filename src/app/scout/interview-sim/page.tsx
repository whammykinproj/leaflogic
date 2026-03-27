"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import MobileNav from "@/components/scout/MobileNav";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Scorecard {
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  practiceAreas: string[];
}

type Step = "setup" | "interview" | "scorecard";

const INTERVIEW_TYPES = [
  "Behavioral",
  "Technical",
  "Case Study",
  "Culture Fit",
];

export default function InterviewSimPage() {
  const [step, setStep] = useState<Step>("setup");

  // Setup state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("Behavioral");
  const [jobDescription, setJobDescription] = useState("");

  // Interview state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  // Scorecard state
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const callAPI = async (msgHistory: Message[]) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/scout/api/interview-sim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          type: interviewType,
          jobDescription: jobDescription || undefined,
          messages: msgHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.isComplete && data.scorecard) {
        setScorecard(data.scorecard);
        setStep("scorecard");
      } else {
        // Count questions from assistant messages (including this new one)
        const assistantMessages = [...msgHistory, assistantMsg].filter(
          (m) => m.role === "assistant"
        );
        setQuestionCount(assistantMessages.length);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("interview");
    setMessages([]);
    setQuestionCount(0);
    // Kick off the interview with an empty message history so the API sends "Begin the interview."
    await callAPI([]);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || loading) return;

    const userMsg: Message = { role: "user", content: currentAnswer.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setCurrentAnswer("");

    await callAPI(updatedMessages);

    // Refocus the textarea
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleReset = () => {
    setStep("setup");
    setCompany("");
    setRole("");
    setInterviewType("Behavioral");
    setJobDescription("");
    setMessages([]);
    setCurrentAnswer("");
    setScorecard(null);
    setQuestionCount(0);
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
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
          className="hidden md:inline text-sm text-zinc-400 hover:text-white transition"
        >
          Dashboard
        </Link>
        <MobileNav />
      </div>

      {/* Step 1: Setup */}
      {step === "setup" && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">Interview Simulator</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Practice with an AI interviewer that adapts to your answers and gives
            real-time feedback.
          </p>

          <form onSubmit={handleStartInterview} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Company name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Role title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Interview type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTERVIEW_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewType(t)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                      interviewType === t
                        ? "bg-emerald-500 text-black"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Job description{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for more targeted questions..."
                rows={4}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Interview Chat */}
      {step === "interview" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold">
                {interviewType} Interview — {company}
              </h1>
              <p className="text-zinc-400 text-sm">{role}</p>
            </div>
            {questionCount > 0 && (
              <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-full">
                Question {questionCount} of ~8
              </span>
            )}
          </div>

          {/* Chat messages */}
          <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-500/15 text-emerald-100 border border-emerald-500/20"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span className="block text-xs text-zinc-500 mb-1 font-medium">
                      Interviewer
                    </span>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400">
                  <span className="block text-xs text-zinc-500 mb-1 font-medium">
                    Interviewer
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse [animation-delay:0.4s]" />
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}

          {/* Answer input */}
          <form onSubmit={handleSubmitAnswer} className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitAnswer(e);
                }
              }}
              placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
              rows={3}
              disabled={loading}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition resize-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !currentAnswer.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 rounded-lg text-sm transition disabled:opacity-50 self-end h-[42px]"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Scorecard */}
      {step === "scorecard" && scorecard && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">Interview Scorecard</h1>
          <p className="text-zinc-400 text-sm mb-8">
            {interviewType} interview at {company} for {role}
          </p>

          {/* Overall Score */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 text-center">
            <p className="text-zinc-400 text-sm mb-2">Overall Score</p>
            <p className="text-5xl font-bold text-emerald-400">
              {scorecard.overallScore}
              <span className="text-2xl text-zinc-500">/10</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                Strengths
              </h3>
              <ul className="space-y-2">
                {scorecard.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-orange-400 mb-3">
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {scorecard.areasToImprove.map((a, i) => (
                  <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5 shrink-0">-</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practice Areas */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">
              Recommended Practice Areas
            </h3>
            <ul className="space-y-2">
              {scorecard.practiceAreas.map((p, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                  <span className="text-zinc-500 mt-0.5 shrink-0">*</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition"
            >
              Start New Interview
            </button>
            <Link
              href="/scout/dashboard"
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-semibold px-6 py-2.5 rounded-lg text-sm transition text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
