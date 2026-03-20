"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const ROLE_SUGGESTIONS = [
  "Product Manager",
  "Software Engineer",
  "VC Analyst/Associate",
  "Chief of Staff",
  "Strategy & Ops",
  "Data Scientist",
  "Design/UX",
  "Marketing",
  "Sales/BD",
  "Founder/CEO",
];

const LOCATION_SUGGESTIONS = [
  "NYC",
  "San Francisco",
  "Los Angeles",
  "Remote",
  "Chicago",
  "Austin",
  "Seattle",
  "Boston",
  "Miami",
  "Denver",
];

function CelebrationOverlay() {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.6,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
      {/* Confetti-like emerald dots */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-emerald-400"
          style={{
            left: `${dot.left}%`,
            top: "-5%",
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animation: `confetti-fall ${dot.duration}s ease-in ${dot.delay}s both`,
          }}
        />
      ))}
      {/* Center message */}
      <div className="text-center animate-scale-up">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-400"
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
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          You&apos;re all set!
        </h2>
        <p className="text-zinc-400 text-sm">
          Your first digest arrives tomorrow morning.
        </p>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const [resumeText, setResumeText] = useState("");
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [targetLocations, setTargetLocations] = useState<string[]>(["NYC"]);
  const [customLocation, setCustomLocation] = useState("");
  const [targetCompanies, setTargetCompanies] = useState("");
  const [skills, setSkills] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [resumeNotes, setResumeNotes] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load existing profile for returning users
  useEffect(() => {
    fetch("/scout/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.resume_text) {
          setResumeText(data.resume_text || "");
          setTargetRoles(data.target_roles || []);
          setTargetLocations(data.target_locations || ["NYC"]);
          setTargetCompanies((data.target_companies || []).join(", "));
          setSkills((data.skills || []).join(", "));
          setSalaryMin(data.salary_min?.toString() || "");
          setSalaryMax(data.salary_max?.toString() || "");
          setResumeNotes(data.resume_variant_notes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const toggleItem = (
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const addCustom = (
    value: string,
    setValue: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue("");
    }
  };

  const goToStep = (nextStep: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 200);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/scout/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          target_roles: targetRoles,
          target_companies: targetCompanies
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          target_locations: targetLocations,
          salary_min: salaryMin ? parseInt(salaryMin) : null,
          salary_max: salaryMax ? parseInt(salaryMax) : null,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          resume_variant_notes: resumeNotes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      // Show celebration overlay
      setShowCelebration(true);
      setTimeout(() => {
        router.push("/scout/dashboard");
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const progressPercent = Math.round((step / 3) * 100);

  return (
    <>
      {showCelebration && <CelebrationOverlay />}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <Link href="/scout" className="block text-center mb-8 animate-fade-in">
            <span className="text-2xl font-bold">
              <span className="text-emerald-400">JobScout</span>{" "}
              <span className="text-zinc-400 font-normal">AI</span>
            </span>
          </Link>

          {!loaded && (
            <div className="text-center py-12">
              <div className="inline-block w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {loaded && <>
          {/* Progress */}
          <div className="mb-8 animate-fade-in delay-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">Step {step} of 3</span>
              <span className="text-xs text-emerald-400 font-medium">{progressPercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    s <= step ? "bg-emerald-400" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content with transition */}
          <div
            className={`transition-all duration-200 ${
              transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Step 1: Resume */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold mb-2">Paste your resume</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  Copy-paste your resume text. Our AI uses this to match you with
                  relevant roles and draft personalized pitches.
                </p>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here..."
                  className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none transition-colors duration-200"
                />
                <div className="mt-4">
                  <label className="block text-sm text-zinc-400 mb-2">
                    Resume variant notes (optional)
                  </label>
                  <input
                    type="text"
                    value={resumeNotes}
                    onChange={(e) => setResumeNotes(e.target.value)}
                    placeholder='e.g., "I have a PM version and a VC version"'
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                  />
                </div>
                <button
                  onClick={() => goToStep(2)}
                  disabled={!resumeText.trim()}
                  className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium py-3 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Roles & Locations */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold mb-2">Target roles</h1>
                <p className="text-zinc-400 text-sm mb-4">
                  Select or add the roles you&apos;re looking for.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ROLE_SUGGESTIONS.map((role) => (
                    <button
                      key={role}
                      onClick={() => toggleItem(targetRoles, setTargetRoles, role)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 hover:scale-[1.03] ${
                        targetRoles.includes(role)
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-8">
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      addCustom(customRole, setCustomRole, targetRoles, setTargetRoles)
                    }
                    placeholder="Add custom role..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                  />
                  <button
                    onClick={() =>
                      addCustom(customRole, setCustomRole, targetRoles, setTargetRoles)
                    }
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition"
                  >
                    Add
                  </button>
                </div>

                <h2 className="text-lg font-semibold mb-2">Locations</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {LOCATION_SUGGESTIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() =>
                        toggleItem(targetLocations, setTargetLocations, loc)
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all duration-200 hover:scale-[1.03] ${
                        targetLocations.includes(loc)
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      addCustom(
                        customLocation,
                        setCustomLocation,
                        targetLocations,
                        setTargetLocations
                      )
                    }
                    placeholder="Add custom location..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                  />
                  <button
                    onClick={() =>
                      addCustom(
                        customLocation,
                        setCustomLocation,
                        targetLocations,
                        setTargetLocations
                      )
                    }
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => goToStep(1)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    disabled={targetRoles.length === 0}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-medium py-3 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Companies, Skills, Salary */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold mb-2">Fine-tune your search</h1>
                <p className="text-zinc-400 text-sm mb-6">
                  Optional but helps our AI find better matches.
                </p>

                <label className="block text-sm text-zinc-300 mb-2">
                  Target companies (comma-separated)
                </label>
                <textarea
                  value={targetCompanies}
                  onChange={(e) => setTargetCompanies(e.target.value)}
                  placeholder="Stripe, Anthropic, Ramp, Figma..."
                  className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none mb-4 transition-colors duration-200"
                />

                <label className="block text-sm text-zinc-300 mb-2">
                  Key skills (comma-separated)
                </label>
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="SQL, Python, Product Strategy, Financial Modeling..."
                  className="w-full h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none mb-4 transition-colors duration-200"
                />

                <label className="block text-sm text-zinc-300 mb-2">
                  Salary range (optional)
                </label>
                <div className="flex gap-3 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        placeholder="Min"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <span className="text-zinc-600 self-center">—</span>
                  <div className="flex-1">
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-zinc-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        placeholder="Max"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-7 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4 animate-fade-in">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => goToStep(2)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-black font-medium py-3 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    {saving ? "Saving..." : "Launch my scout"}
                  </button>
                </div>
              </div>
            )}
          </div>
          </>}
        </div>
      </div>
    </>
  );
}
