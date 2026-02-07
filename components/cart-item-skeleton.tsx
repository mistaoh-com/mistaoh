import { Skeleton } from "@/components/ui/skeleton"

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border rounded-lg bg-white">
      {/* Image skeleton */}
      <Skeleton className="w-20 h-20 shrink-0 rounded" />

      {/* Item info skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Quantity controls skeleton */}
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-6 w-8" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>

      {/* Delete button skeleton */}
      <Skeleton className="w-8 h-8 shrink-0 rounded" />
    </div>
  )
}
