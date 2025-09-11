export default function LoadingReviews() {
  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30 mt-8">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
