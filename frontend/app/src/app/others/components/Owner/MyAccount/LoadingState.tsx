import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse">
          <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-600 rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-600 rounded"></div>
                <div className="h-16 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
