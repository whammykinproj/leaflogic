import {
  SkeletonText,
  SkeletonCard,
  SkeletonButton,
} from "@/components/scout/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <SkeletonText width="w-32" height="h-6" />
        <div className="hidden md:flex items-center gap-4">
          <SkeletonText width="w-20" height="h-4" />
          <SkeletonText width="w-16" height="h-4" />
          <SkeletonText width="w-40" height="h-4" />
        </div>
      </div>

      {/* Tools bar skeleton */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-zinc-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 rounded-lg bg-zinc-900 border border-zinc-800 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[skeleton-shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-zinc-700/40 before:to-transparent"
          />
        ))}
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <SkeletonText width="w-12" height="h-7" className="mb-2" />
            <SkeletonText width="w-20" height="h-3" />
          </div>
        ))}
      </div>

      {/* Run scout button skeleton */}
      <div className="mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex-1">
            <SkeletonText width="w-36" height="h-4" className="mb-2" />
            <SkeletonText width="w-64" height="h-3" />
          </div>
          <SkeletonButton />
        </div>
      </div>

      {/* Profile card skeleton */}
      <SkeletonCard className="mb-8" />

      {/* Digest list skeleton */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <SkeletonText width="w-36" height="h-5" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
            >
              <SkeletonText width="w-32" height="h-4" />
              <SkeletonText width="w-24" height="h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
