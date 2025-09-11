export default function LoadingTheaterReviews() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        {/* Rating Overview Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        
        {/* Rating Distribution Skeleton */}
        <div className="h-40 bg-gray-700 rounded-2xl mb-6"></div>
        
        {/* Reviews Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
