import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function MenuItemSkeleton() {
  return (
    <div className="flex items-start gap-5 py-6 px-6 rounded-2xl bg-card border border-border/50 shadow-sm">
      {/* Image skeleton */}
      <Skeleton className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Price and button skeleton */}
      <div className="flex flex-col items-end gap-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
    </div>
  )
}

export function MenuItemSkeletonCompact() {
  return (
    <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-card border border-border/50 shadow-sm">
      <Skeleton className="w-16 h-16 shrink-0 rounded-xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  )
}
