import Link from "next/link";
import { getAllPosts } from "./posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Job search tips, career advice, and AI-powered hiring insights from JobScout AI.",
  openGraph: {
    title: "JobScout AI Blog",
    description:
      "Job search tips, career advice, and AI-powered hiring insights.",
  },
};

export default function BlogListingPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/scout" className="text-xl font-bold tracking-tight">
          <span className="text-emerald-400">JobScout</span>{" "}
          <span className="text-zinc-400 font-normal">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/scout/login"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Log in
          </Link>
          <Link
            href="/scout/login?signup=true"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-zinc-400">
          Job search strategies, career advice, and insights on how AI is
          changing hiring.
        </p>
      </header>

      {/* Posts grid */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/scout/blog/${post.slug}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition group"
            >
              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="text-zinc-700">&middot;</span>
                <span>{post.author}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">
            JobScout AI — Built with Claude
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/scout/blog" className="hover:text-zinc-300">
              Blog
            </Link>
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
