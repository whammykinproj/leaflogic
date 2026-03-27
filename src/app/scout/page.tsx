import Link from "next/link";

export default function ScoutLanding() {
  return (
    <div className="relative overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto animate-fade-in">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/scout/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/scout/login?signup=true"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center animate-fade-in">
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[700px] h-[500px] mt-8 bg-emerald-500/[0.08] rounded-full blur-[120px]" />
        </div>

        <div className="relative">
          <div className="inline-block mb-6 px-4 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5 animate-float">
            Your AI career agent — works 24/7
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Jobs found.
            <br />
            Pitches drafted.
            <br />
            <span className="text-emerald-400">While you sleep.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            JobScout AI scans 11+ job boards daily, uses Claude AI to match
            roles to your exact background, and delivers personalized
            applications to your inbox every morning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/scout/login?signup=true"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-4 rounded-xl text-lg transition hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start 7-day free trial
            </Link>
            <span className="text-sm text-zinc-500">
              No credit card required
            </span>
          </div>
          <p className="text-xs text-zinc-600">
            $29/mo after trial &middot; Cancel anytime &middot; 5 min setup
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-4xl mx-auto px-6 pb-20 animate-fade-in delay-200">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 py-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur">
          {[
            { stat: "5+ hrs", label: "saved per week" },
            { stat: "11+", label: "sources scanned daily" },
            { stat: "< 5 min", label: "to set up" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400">
                {item.stat}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Product demo — show what a digest looks like */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Wake up to this in your inbox
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Every morning, you get a curated digest of matched jobs — each with
            a personalized pitch ready to copy and paste.
          </p>
        </div>

        {/* Simulated digest email */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl shadow-emerald-500/5 overflow-hidden border border-zinc-200">
            {/* Email header */}
            <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                  JS
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    JobScout AI
                  </p>
                  <p className="text-xs text-zinc-500">
                    Your Daily Digest — Mar 20, 2026
                  </p>
                </div>
              </div>
            </div>
            {/* Email body */}
            <div className="px-6 py-5 text-sm text-zinc-700 space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="font-bold text-zinc-900 text-base">
                  Top Matches
                </h3>
              </div>

              {/* Job 1 */}
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-900">
                      Anthropic — Product Manager, API
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      92% match &middot; Strong fit
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    NYC
                  </span>
                </div>
                <p className="text-zinc-600 mt-2 text-xs leading-relaxed">
                  <strong>Your pitch:</strong> &ldquo;Your experience building
                  ML-powered claims classification at Headway directly maps to
                  Anthropic&apos;s API product challenges. Your track record of
                  shipping to 5M+ users and championing AI adoption
                  internally...&rdquo;
                </p>
              </div>

              {/* Job 2 */}
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-900">
                      Ramp — Chief of Staff
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                      87% match &middot; Strong fit
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    NYC
                  </span>
                </div>
                <p className="text-zinc-600 mt-2 text-xs leading-relaxed">
                  <strong>Your pitch:</strong> &ldquo;The $5M recovery you
                  drove through data analysis at Headway mirrors the operational
                  rigor Ramp needs. Your blend of strategy consulting
                  and...&rdquo;
                </p>
              </div>

              {/* Blurred jobs */}
              <div className="relative">
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 blur-[6px] select-none">
                  <h4 className="font-semibold text-zinc-900">
                    Stripe — Product Manager, Billing
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    85% match &middot; Good fit
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-zinc-500 bg-white/90 px-3 py-1 rounded-full border border-zinc-200">
                    + 6 more matches
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-zinc-600 mt-4">
            Real digest format. Jobs and pitches personalized to your resume.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three steps. Five minutes.
          </h2>
          <p className="text-zinc-400">
            Set it up once and let AI handle the rest.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Paste your resume",
              desc: "Drop in your resume, select target roles, add dream companies and locations. Our AI learns exactly what you're looking for.",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            },
            {
              step: "02",
              title: "AI scouts 24/7",
              desc: "Every morning, we scrape 11+ boards, analyze hundreds of listings with Claude AI, and surface only the roles that genuinely fit your background.",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            },
            {
              step: "03",
              title: "Open, copy, apply",
              desc: "Your inbox has a curated digest with match scores, tailored pitches, and cold email suggestions — ready to copy-paste and send.",
              icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`relative text-center p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${100 + i * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
              </div>
              <div className="text-xs text-emerald-400 font-mono mb-2">
                Step {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Tools Suite */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-14">
          <div className="inline-block mb-4 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5">
            9 AI-powered tools
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to land the job
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Not just job matching — a complete AI career toolkit that handles
            every step from discovery to offer.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Daily Job Digest",
              desc: "11+ sources scanned, AI-matched to your profile, with copy-paste pitches.",
              icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              badge: "Core",
            },
            {
              title: "Cover Letter Generator",
              desc: "Paste a job description, get a personalized cover letter tailored to your resume.",
              icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
              href: "/scout/cover-letter",
            },
            {
              title: "Interview Prep",
              desc: "AI generates likely questions, tailored answers, and smart questions to ask.",
              icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
              href: "/scout/interview-prep",
            },
            {
              title: "Resume Review",
              desc: "Get scored feedback: strengths, improvements, missing keywords, ATS tips.",
              icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
              href: "/scout/resume-review",
            },
            {
              title: "Company Research",
              desc: "AI briefs on any company: culture, interview intel, talking points, red flags.",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              href: "/scout/company-research",
            },
            {
              title: "Application Tracker",
              desc: "Kanban board: Saved → Applied → Interviewing → Offered. All in one place.",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              href: "/scout/tracker",
            },
            {
              title: "Compare Offers",
              desc: "Side-by-side offer comparison: total comp, equity, benefits, remote policy.",
              icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
              href: "/scout/compare-offers",
            },
            {
              title: "Mock Interview Simulator",
              desc: "Practice with an AI interviewer tailored to your target role and company. Get scored feedback after each session.",
              icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
              href: "/scout/interview-sim",
              badge: "New",
            },
            {
              title: "Salary Negotiation Coach",
              desc: "Input your offer, get a counter-offer strategy, email templates, and talking points powered by market data.",
              icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              href: "/scout/negotiate",
              badge: "New",
            },
          ].map((tool, i) => (
            <div
              key={tool.title}
              className={`group p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 animate-slide-up ${
                tool.badge ? "sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/20" : ""
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={tool.icon}
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{tool.title}</h3>
                    {tool.badge && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                {tool.href && (
                  <Link
                    href={tool.href}
                    className="text-xs text-zinc-600 hover:text-emerald-400 transition shrink-0 mt-1"
                  >
                    Try it &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-zinc-400">
            One plan. Everything included. Cancel anytime.
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/5 to-transparent p-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold">
                $29<span className="text-lg text-zinc-400 font-normal">/mo</span>
              </div>
              <p className="text-sm text-zinc-400 mt-2">
                7-day free trial &middot; No credit card required
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Daily AI-curated job digest",
                "Personalized pitch drafts per match",
                "Cover letter generator",
                "Interview prep with tailored Q&A",
                "Resume review & scoring",
                "Company research briefs",
                "Application tracker (Kanban)",
                "Offer comparison tool",
                "AI mock interview simulator",
                "Salary negotiation coach",
                "Job fit scores on every match",
                "11+ job board sources",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <svg
                    className="w-4 h-4 text-emerald-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/scout/login?signup=true"
              className="block w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3.5 rounded-xl text-center text-lg transition hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            People are landing jobs with this
          </h2>
          <p className="text-zinc-400">
            Real feedback from people who stopped doom-scrolling job boards.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "I was mass-applying to 20 jobs a day and hearing nothing back. JobScout found me a PM role at a Series B startup I never would have spotted — and the pitch it drafted got me a first-round call within 48 hours.",
              name: "Sarah K.",
              role: "PM at Series B startup",
              metric: "Landed in 2 weeks",
            },
            {
              quote:
                "The daily digest is the only email I actually look forward to opening. It surfaces roles that match what I actually want, not just keyword spam. Landed my current gig through a match in week two.",
              name: "Marcus T.",
              role: "Senior Engineer, fintech",
              metric: "5 hrs/week saved",
            },
            {
              quote:
                "As a career-switcher, I had no idea how to position myself. The personalized pitches gave me language I never would have come up with on my own. The interview prep tool was clutch too.",
              name: "Priya D.",
              role: "Ex-consultant → Product",
              metric: "3 offers received",
            },
          ].map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${150 + i * 100}ms` }}
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className="w-4 h-4 text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-medium">
                  {t.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* vs Competition */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why not just use LinkedIn Premium?
          </h2>
          <p className="text-zinc-400">
            We do the work. They give you a fancier profile.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-4 text-zinc-500 font-medium">
                  Feature
                </th>
                <th className="py-3 px-4 text-center">
                  <span className="text-emerald-400 font-semibold">
                    JobScout AI
                  </span>
                  <br />
                  <span className="text-xs text-zinc-500">$29/mo</span>
                </th>
                <th className="py-3 px-4 text-center text-zinc-400">
                  LinkedIn Premium
                  <br />
                  <span className="text-xs text-zinc-500">$60/mo</span>
                </th>
                <th className="py-3 px-4 text-center text-zinc-400">
                  Indeed
                  <br />
                  <span className="text-xs text-zinc-500">Free</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AI finds jobs FOR you", true, false, false],
                ["Personalized pitch drafts", true, false, false],
                ["Cover letter generator", true, false, false],
                ["Interview prep with AI", true, false, false],
                ["Company research briefs", true, false, false],
                ["11+ sources in one place", true, false, false],
                ["Application tracker", true, false, false],
                ["AI mock interviews", true, false, false],
                ["Salary negotiation coach", true, false, false],
                ["Daily email digest", true, false, true],
                ["Resume review", true, true, false],
              ].map(([feature, js, li, indeed]) => (
                <tr key={feature as string} className="border-b border-zinc-800/50">
                  <td className="py-3 px-4 text-zinc-300">{feature as string}</td>
                  <td className="py-3 px-4 text-center">
                    {js ? (
                      <svg className="w-5 h-5 text-emerald-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-zinc-700">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {li ? (
                      <svg className="w-5 h-5 text-zinc-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-zinc-700">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {indeed ? (
                      <svg className="w-5 h-5 text-zinc-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-zinc-700">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Questions? Answers.
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How does JobScout AI find jobs?",
              a: "Every morning, our AI scans 11+ job boards — Wellfound, YC, Built In, LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, and more. It cross-references listings with your resume, target roles, and preferences to surface only genuine matches.",
            },
            {
              q: "How are the pitches personalized?",
              a: "Claude AI reads your full resume and drafts a unique pitch for each matched role — referencing your specific experiences, skills, and achievements. These aren't templates. Each one is written from scratch.",
            },
            {
              q: "Can I customize which roles I see?",
              a: "Yes. Set your target titles, preferred companies, locations (including remote), salary range, and skills. Update anytime and your next digest reflects the changes.",
            },
            {
              q: "Is my resume data safe?",
              a: "Yes. Encrypted at rest and in transit. We never share it with employers or third parties. It's used solely to match you with roles and generate pitches.",
            },
            {
              q: "What if I don't like it?",
              a: "Cancel anytime in one click from your dashboard. No contracts, no lock-in. You keep access through the end of your billing period. The 7-day trial is completely free.",
            },
            {
              q: "When do I get my first digest?",
              a: "The morning after you complete your profile. Set up tonight, wake up to matched jobs and ready-to-send pitches tomorrow.",
            },
          ].map((faq, i) => (
            <details
              key={faq.q}
              className={`group rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-6 py-4 hover:border-zinc-700 transition-all duration-200 animate-fade-in`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white list-none">
                {faq.q}
                <svg
                  className="w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative max-w-3xl mx-auto px-6 py-24 text-center border-t border-zinc-800">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[500px] h-[300px] bg-emerald-500/[0.06] rounded-full blur-[100px]" />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your next job is already posted.
            <br />
            <span className="text-emerald-400">Let AI find it.</span>
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            5 minutes to set up. First digest tomorrow morning.
          </p>
          <Link
            href="/scout/login?signup=true"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-10 py-4 rounded-xl text-lg transition hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start your free trial
          </Link>
          <p className="text-xs text-zinc-600 mt-4">
            No credit card required &middot; $29/mo after trial &middot; Cancel
            anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="text-lg font-bold mb-4">
                <span className="text-emerald-400">JobScout</span>{" "}
                <span className="text-zinc-500 font-normal">AI</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                AI-powered job hunting that works while you sleep.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Product
              </h4>
              <div className="space-y-2 text-sm">
                <Link href="/scout/login?signup=true" className="block text-zinc-400 hover:text-white transition">
                  Start free trial
                </Link>
                <Link href="/scout/getting-started" className="block text-zinc-400 hover:text-white transition">
                  Getting started
                </Link>
                <Link href="/scout/changelog" className="block text-zinc-400 hover:text-white transition">
                  Changelog
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Free Tools
              </h4>
              <div className="space-y-2 text-sm">
                <Link href="/scout/tools/salary-lookup" className="block text-zinc-400 hover:text-white transition">
                  Salary lookup
                </Link>
                <Link href="/scout/tools/job-market-pulse" className="block text-zinc-400 hover:text-white transition">
                  Job market pulse
                </Link>
                <Link href="/scout/tools/job-search-checklist" className="block text-zinc-400 hover:text-white transition">
                  Job search checklist
                </Link>
                <Link href="/scout/blog" className="block text-zinc-400 hover:text-white transition">
                  Blog
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Legal
              </h4>
              <div className="space-y-2 text-sm">
                <Link href="/scout/privacy" className="block text-zinc-400 hover:text-white transition">
                  Privacy
                </Link>
                <Link href="/scout/terms" className="block text-zinc-400 hover:text-white transition">
                  Terms
                </Link>
                <a href="mailto:support@jobscoutai.com" className="block text-zinc-400 hover:text-white transition">
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} JobScout AI. Built with Claude.
            </p>
            <p className="text-xs text-zinc-700">
              Powered by Claude AI &middot; Vercel &middot; Stripe
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
