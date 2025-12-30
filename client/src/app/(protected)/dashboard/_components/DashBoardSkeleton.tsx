import { Skeleton } from "@/components/ui/skeleton";

const DashBoardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="flex gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-48 rounded-xl" />
          ))}
        </div>

        {/* Content Skeleton */}
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  );
};

export default DashBoardSkeleton;
