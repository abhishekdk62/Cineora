import React from 'react';

const WalletLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-white/10 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-white/5 rounded w-64 animate-pulse"></div>
        </div>

        {/* Wallet Card Skeleton */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-7 mb-6 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-32 mb-4"></div>
          <div className="h-12 bg-white/10 rounded w-48 mb-6"></div>
          <div className="flex gap-3">
            <div className="h-12 bg-white/10 rounded-xl flex-1"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
              <div className="h-8 bg-white/10 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Transactions Skeleton */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-7 animate-pulse">
          <div className="h-6 bg-white/10 rounded w-40 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletLoading;
