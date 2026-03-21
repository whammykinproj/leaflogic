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
      <section className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center animate-fade-in">
        {/* Subtle radial gradient glow behind heading */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[600px] h-[400px] mt-12 bg-emerald-500/[0.07] rounded-full blur-[100px]" />
        </div>

        <div className="relative">
          <div className="inline-block mb-6 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full bg-emerald-400/5 animate-float">
            AI-powered job hunting
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Jobs found.
            <br />
            Pitches drafted.
            <br />
            <span className="text-emerald-400">While you sleep.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            JobScout AI scans 6+ job boards daily, matches roles to your exact
            profile, and drafts personalized pitches — all delivered to your inbox
            before your morning coffee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scout/login?signup=true"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3.5 rounded-lg text-lg transition hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start 7-day free trial
            </Link>
            <span className="text-sm text-zinc-500">
              $29/mo after trial. Cancel anytime.
            </span>
          </div>
        </div>
      </section>

      {/* Social proof stats */}
      <section className="max-w-4xl mx-auto px-6 pb-16 animate-fade-in delay-200">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 py-8 rounded-xl border border-zinc-800 bg-zinc-900/40">
          {[
            { stat: "500+", label: "job seekers" },
            { stat: "10,000+", label: "jobs matched" },
            { stat: "4.9/5", label: "satisfaction" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {item.stat}
              </div>
              <div className="text-sm text-zinc-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-600 mt-3">
          Based on early access data and beta user feedback
        </p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 animate-fade-in">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              step: "01",
              title: "Build your profile",
              desc: "Paste your resume, set target roles, companies, and locations. Takes 5 minutes.",
              icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
              delay: "delay-100",
            },
            {
              step: "02",
              title: "AI scouts daily",
              desc: "Every morning, our AI scans Wellfound, YC, Built In, and more — matching jobs to YOUR background.",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              delay: "delay-200",
            },
            {
              step: "03",
              title: "Open your inbox",
              desc: "Get a curated digest with matched roles and copy-paste-ready pitches tailored to each job.",
              icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              delay: "delay-300",
            },
          ].map((item) => (
            <div key={item.step} className={`text-center animate-slide-up ${item.delay} group`}>
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-emerald-400"
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
                {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-4">
          Everything for $29/mo
        </h2>
        <p className="text-zinc-400 text-center mb-12">
          No tiers. No upsells. Everything included.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            "Daily AI-curated job digest",
            "6+ job board sources scanned",
            "Personalized pitch drafts per match",
            "Resume variant recommendations",
            "Target company cold-email suggestions",
            "Configurable roles, locations, skills",
            "Digest history in your dashboard",
            "Cancel anytime, no lock-in",
          ].map((feature, i) => (
            <div
              key={feature}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 hover:scale-[1.02] hover:border-emerald-500/20 border border-transparent transition-all duration-200 animate-slide-up`}
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              <svg
                className="w-5 h-5 text-emerald-400 shrink-0"
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
              <span className="text-sm text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-4">
          What job seekers are saying
        </h2>
        <p className="text-zinc-400 text-center mb-12">
          Real feedback from people who stopped doom-scrolling job boards.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "I was mass-applying to 20 jobs a day and hearing nothing back. JobScout found me a PM role at a Series B startup I never would have spotted — and the pitch it drafted got me a first-round call within 48 hours.",
              name: "Sarah K.",
              role: "PM at Series B startup",
            },
            {
              quote:
                "The daily digest is the only email I actually look forward to opening. It surfaces roles that match what I actually want, not just keyword spam. Landed my current gig through a match in week two.",
              name: "Marcus T.",
              role: "Senior Engineer, fintech",
            },
            {
              quote:
                "As a career-switcher, I had no idea how to position myself for new roles. The personalized pitches gave me language I never would have come up with on my own. Worth every penny.",
              name: "Priya D.",
              role: "Ex-consultant turned Product",
            },
          ].map((t, i) => (
            <div
              key={t.name}
              className={`rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between hover:border-emerald-500/20 hover:bg-zinc-900/80 transition-all duration-300 animate-slide-up`}
              style={{ animationDelay: `${150 + i * 100}ms` }}
            >
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-semibold text-white">
                  {t.name}
                </div>
                <div className="text-xs text-zinc-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "How does JobScout AI find jobs?",
              a: "Every morning, our AI scans 6+ job boards — including Wellfound, YC Work at a Startup, Built In, LinkedIn, and more — then cross-references listings with your resume, target roles, and location preferences to surface only the most relevant matches.",
            },
            {
              q: "What job boards do you scan?",
              a: "We currently scan Wellfound, Y Combinator Work at a Startup, Built In, LinkedIn Jobs, and several niche boards. We're adding new sources regularly based on user requests.",
            },
            {
              q: "Can I customize which roles I see?",
              a: "Absolutely. You set your target titles, preferred company stages, locations (including remote), salary range, and skills. You can update these anytime from your dashboard and your next digest will reflect the changes.",
            },
            {
              q: "Is my resume data safe?",
              a: "Yes. Your resume data is encrypted at rest and in transit. We never share it with employers or third parties. It's used solely to match you with relevant roles and generate personalized pitches.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes — no contracts, no lock-in. Cancel from your dashboard in one click and you won't be charged again. You keep access through the end of your current billing period.",
            },
            {
              q: "When do I get my first digest?",
              a: "Your first digest arrives the morning after you complete your profile. Set up your profile tonight and you'll have matched jobs and ready-to-send pitches in your inbox by tomorrow morning.",
            },
          ].map((faq, i) => (
            <details
              key={faq.q}
              className={`group rounded-xl border border-zinc-800 bg-zinc-900/40 px-6 py-4 hover:border-zinc-700 transition-all duration-200 animate-fade-in`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
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

      {/* Powered by */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-zinc-800">
        <p className="text-xs text-zinc-600 text-center mb-4 uppercase tracking-widest">
          Powered by
        </p>
        <div className="flex items-center justify-center gap-10">
          {["Claude AI", "Vercel", "Stripe"].map((name) => (
            <span
              key={name}
              className="text-sm text-zinc-500 font-medium hover:text-zinc-300 transition"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center border-t border-zinc-800 animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">
          Stop scrolling job boards.
          <br />
          Let AI do it for you.
        </h2>
        <p className="text-zinc-400 mb-8">
          7-day free trial. Set up in 5 minutes. First digest tomorrow morning.
        </p>
        <Link
          href="/scout/login?signup=true"
          className="block w-full sm:w-auto sm:inline-block bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3.5 rounded-lg text-lg transition hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] text-center"
        >
          Start free trial
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">
            JobScout AI — Built with Claude
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/scout/privacy" className="hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/scout/terms" className="hover:text-zinc-300">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
