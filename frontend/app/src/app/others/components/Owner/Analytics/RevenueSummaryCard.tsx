// @ts-nocheck
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface RevenueSummaryCardProps {
  title: string;
  amount: number;
  growthRate?: number;
  period: string;
  lexendMedium: string;
  lexendSmall: string;
}

export const RevenueSummaryCard: React.FC<RevenueSummaryCardProps> = ({
  title,
  amount,
  growthRate,
  period,
  lexendMedium,
  lexendSmall
}) => {
  const isPositiveGrowth = growthRate && growthRate > 0;
  
  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <DollarSign className="w-6 h-6 text-blue-400" />
        </div>
        {growthRate !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isPositiveGrowth ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isPositiveGrowth ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className={`${lexendSmall.className} text-xs font-medium`}>
              {Math.abs(growthRate).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className={`${lexendSmall.className} text-gray-400 text-sm`}>
          {title}
        </h3>
        <p className={`${lexendMedium.className} text-2xl text-white font-semibold`}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
        <p className={`${lexendSmall.className} text-gray-500 text-xs`}>
          {period}
        </p>
      </div>
    </div>
  );
};
