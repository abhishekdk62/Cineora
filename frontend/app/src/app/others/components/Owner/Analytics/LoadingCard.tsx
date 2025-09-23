import React from 'react';

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = "" }) => {
  return (
    <div className={`bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse ${className}`}>
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gray-600 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
          <div className="h-6 bg-gray-600 rounded w-1/2"></div>
          <div className="h-3 bg-gray-600 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};
