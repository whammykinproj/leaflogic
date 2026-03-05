import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  wordCount?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Care Guides": "bg-emerald-50 text-emerald-700",
  Troubleshooting: "bg-amber-50 text-amber-700",
  Propagation: "bg-violet-50 text-violet-700",
  "Plant Selection": "bg-sky-50 text-sky-700",
  "Pests & Disease": "bg-rose-50 text-rose-700",
};

export default function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  category,
  wordCount,
}: ArticleCardProps) {
  const categoryClass = CATEGORY_COLORS[category] || "bg-green-bg text-green-primary";
  const readingTime = wordCount ? Math.max(1, Math.round(wordCount / 200)) : null;

  return (
    <Link
      href={`/articles/${slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-all duration-200 hover:border-green-light hover:shadow-lg hover:-translate-y-0.5"
    >
      <span
        className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${categoryClass}`}
      >
        {category}
      </span>
      <h2 className="mt-3 text-lg font-bold leading-snug text-foreground group-hover:text-green-primary transition-colors">
        {title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60 line-clamp-2">
        {excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground/35">
          <span>{date}</span>
          {readingTime && (
            <>
              <span className="h-1 w-1 rounded-full bg-foreground/20" />
              <span>{readingTime} min read</span>
            </>
          )}
        </div>
        <span className="text-xs font-medium text-green-primary opacity-0 transition-opacity group-hover:opacity-100">
          Read &rarr;
        </span>
      </div>
    </Link>
  );
}
