import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-xl border border-border">
      {/* Cover Image Skeleton - 3:2 aspect ratio */}
      <Skeleton className="w-full aspect-[3/2]" />

      <div className="p-4 md:p-5 space-y-3">
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-5 md:h-6 w-full" />
          <Skeleton className="h-5 md:h-6 w-3/4" />
        </div>

        {/* Excerpt skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Author and date row */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            {/* Avatar skeleton */}
            <Skeleton className="h-6 w-6 rounded-full" />
            {/* Author name skeleton */}
            <Skeleton className="h-3 md:h-4 w-20 md:w-24" />
          </div>
          {/* Date skeleton */}
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </Card>
  );
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Image Skeleton */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <Skeleton className="w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl" />
          </div>

          {/* Content Skeleton */}
          <div className="w-full md:w-1/2 lg:w-2/5">
            <div className="max-w-lg space-y-4">
              {/* Featured Badge */}
              <Skeleton className="h-6 w-32 rounded-full" />

              {/* Title - 2 lines */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>

              {/* Description - 3 lines */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Button */}
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
