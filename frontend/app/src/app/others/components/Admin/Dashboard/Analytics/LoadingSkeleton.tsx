import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'chart';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1 
}) => {
  const renderCardSkeleton = () => (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
          <div className="h-8 bg-gray-700/50 rounded w-32"></div>
          <div className="h-3 bg-gray-700/50 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg animate-pulse">
      <div className="p-4 border-b border-gray-700/50">
        <div className="h-6 bg-gray-700/50 rounded w-48"></div>
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="h-4 bg-gray-700/50 rounded w-32"></div>
            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            <div className="h-4 bg-gray-700/50 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-700/50 rounded w-48 mb-4"></div>
      <div className="h-64 bg-gray-700/50 rounded"></div>
    </div>
  );

  const skeletons = Array.from({ length: count }).map((_, index) => {
    switch (type) {
      case 'table':
        return <div key={index}>{renderTableSkeleton()}</div>;
      case 'chart':
        return <div key={index}>{renderChartSkeleton()}</div>;
      default:
        return <div key={index}>{renderCardSkeleton()}</div>;
    }
  });

  if (count === 1) {
    return skeletons[0];
  }

  return (
    <div className={`grid gap-6 ${
      type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
    }`}>
      {skeletons}
    </div>
  );
};
