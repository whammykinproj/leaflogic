import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getAllPlantHubs } from "@/lib/plants";

export const metadata: Metadata = {
  title: "About LeafLogic",
  description:
    "LeafLogic is your trusted resource for indoor plant care. Learn about our mission to help every plant parent succeed.",
};

export default function AboutPage() {
  const articleCount = getAllArticles().length;
  const plantCount = getAllPlantHubs().length;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-green-bg px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-green-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-primary">
            About Us
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Helping Every Plant Parent <span className="text-green-primary">Succeed</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-foreground/60">
            LeafLogic was born from a simple idea: everyone deserves to enjoy
            thriving indoor plants, regardless of experience level.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-white px-6 py-10">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-green-primary sm:text-3xl">{articleCount}+</p>
            <p className="mt-1 text-xs font-medium text-foreground/40 sm:text-sm">Expert Guides</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-primary sm:text-3xl">{plantCount}+</p>
            <p className="mt-1 text-xs font-medium text-foreground/40 sm:text-sm">Plants Covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-primary sm:text-3xl">5</p>
            <p className="mt-1 text-xs font-medium text-foreground/40 sm:text-sm">Categories</p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold text-foreground">Our Approach</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-foreground/50">
          Every guide follows the same principles to make plant care simple and effective.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {/* Card: Research-Backed */}
          <div className="rounded-2xl border border-border bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-bg">
              <svg className="h-6 w-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Research-Backed</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/50">
              Every article references trusted horticultural sources and proven methods.
            </p>
          </div>

          {/* Card: Beginner-Friendly */}
          <div className="rounded-2xl border border-border bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-bg">
              <svg className="h-6 w-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Beginner-Friendly</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/50">
              Clear language with no jargon. Every guide is written for real people, not botanists.
            </p>
          </div>

          {/* Card: No Fluff */}
          <div className="rounded-2xl border border-border bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-bg">
              <svg className="h-6 w-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">No Fluff</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/50">
              Practical, actionable advice you can use today. We respect your time.
            </p>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="border-t border-border bg-cream px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground">What We Cover</h2>
          <div className="mt-8 space-y-4">
            {[
              { title: "Care Guides", desc: "Step-by-step care instructions for popular houseplants", color: "bg-emerald-50 text-emerald-700" },
              { title: "Troubleshooting", desc: "Diagnose and fix common plant problems like yellowing leaves, drooping, and more", color: "bg-amber-50 text-amber-700" },
              { title: "Propagation", desc: "Learn how to multiply your plant collection for free", color: "bg-violet-50 text-violet-700" },
              { title: "Plant Selection", desc: "Find the perfect plants for your space, light conditions, and lifestyle", color: "bg-sky-50 text-sky-700" },
              { title: "Pests & Disease", desc: "Identify, treat, and prevent common houseplant pests and diseases", color: "bg-rose-50 text-rose-700" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-white p-5">
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>
                  {item.title}
                </span>
                <p className="text-sm leading-relaxed text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground">Get in Touch</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-foreground/50">
          Have a question or suggestion? We&apos;d love to hear from you.
        </p>
        <a
          href="mailto:hello@leaflogic.app"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-green-dark hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          hello@leaflogic.app
        </a>
      </section>
    </div>
  );
}
