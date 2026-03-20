const shimmerClasses =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[skeleton-shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-zinc-700/40 before:to-transparent";

export function SkeletonText({
  width = "w-full",
  height = "h-4",
  className = "",
}: {
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} ${height} rounded bg-zinc-800 ${shimmerClasses} ${className}`}
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 ${className}`}
    >
      <SkeletonText width="w-1/3" className="mb-3" />
      <SkeletonText width="w-full" className="mb-2" />
      <SkeletonText width="w-2/3" />
    </div>
  );
}

export function SkeletonAvatar({
  size = "w-10 h-10",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <div
      className={`${size} rounded-full bg-zinc-800 ${shimmerClasses} ${className}`}
    />
  );
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-10 w-32 rounded-lg bg-zinc-800 ${shimmerClasses} ${className}`}
    />
  );
}
