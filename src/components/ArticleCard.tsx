import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  date,
  category,
}: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="group block rounded-xl border border-gray-100 p-6 transition-all hover:border-green-light hover:shadow-md"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-green-light">
        {category}
      </span>
      <h2 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-green-primary transition-colors">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{excerpt}</p>
      <p className="mt-3 text-xs text-gray-400">{date}</p>
    </Link>
  );
}
