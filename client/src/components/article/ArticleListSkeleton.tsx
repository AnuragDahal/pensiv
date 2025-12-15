import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function MobileArticleSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Article image skeleton */}
      <Skeleton className="w-full h-64" />

      <div className="p-4 space-y-3">
        {/* Lifestyle badge skeleton */}
        <Skeleton className="h-6 w-20 rounded-full" />

        {/* Title skeleton */}
        <Skeleton className="h-7 w-3/4" />

        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Author and date row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {/* Avatar skeleton */}
            <Skeleton className="h-8 w-8 rounded-full" />
            {/* Author name skeleton */}
            <Skeleton className="h-4 w-24" />
          </div>
          {/* Date skeleton */}
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}

export function DesktopArticleSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-6 p-6">
        {/* Article image skeleton - left side */}
        <Skeleton className="w-80 h-64 flex-shrink-0 rounded-lg" />

        {/* Content section - right side */}
        <div className="flex-1 space-y-4">
          {/* Lifestyle badge skeleton */}
          <Skeleton className="h-6 w-20 rounded-full" />

          {/* Title skeleton */}
          <Skeleton className="h-8 w-2/3" />

          {/* Description skeleton - 2 lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Author and metadata row */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              {/* Avatar skeleton */}
              <Skeleton className="h-10 w-10 rounded-full" />
              {/* Author name skeleton */}
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-4">
              {/* Date skeleton */}
              <Skeleton className="h-4 w-24" />
              {/* Read time skeleton */}
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ArticleListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <>
      {/* Mobile view - stacked cards */}
      <div className="md:hidden space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <MobileArticleSkeleton key={i} />
        ))}
      </div>

      {/* Desktop view - horizontal cards */}
      <div className="hidden md:block space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <DesktopArticleSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
