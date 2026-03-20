import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "../posts";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = `https://leaflogic.app/scout/blog/${slug}/opengraph-image`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
            href="/scout/blog"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Blog
          </Link>
          <Link
            href="/scout/login?signup=true"
            className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-lg transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-20">
        <Link
          href="/scout/blog"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300 transition mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to blog
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>
        </header>

        <div
          className="prose prose-invert prose-zinc max-w-none
            prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-li:text-zinc-300 prose-li:leading-relaxed
            prose-ul:my-4 prose-ul:pl-5
            prose-ol:my-4 prose-ol:pl-5"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

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
