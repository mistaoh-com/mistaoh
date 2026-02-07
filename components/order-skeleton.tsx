import { Skeleton } from "@/components/ui/skeleton"

export function OrderSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      {/* Order header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Order items */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Total */}
      <Skeleton className="h-6 w-24 ml-auto" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded" />
        <Skeleton className="h-9 flex-1 rounded" />
        <Skeleton className="h-9 flex-1 rounded" />
      </div>
    </div>
  )
}
