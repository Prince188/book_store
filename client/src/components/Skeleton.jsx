const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />
);

export const BookCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <Skeleton className="aspect-[3/4] rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  </div>
);

export const BookDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="grid md:grid-cols-2 gap-12">
      <Skeleton className="aspect-[3/4] rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-10 w-20" />
  </div>
);

export default Skeleton;
