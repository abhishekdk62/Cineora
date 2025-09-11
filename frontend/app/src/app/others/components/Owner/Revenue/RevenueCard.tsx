"use client";
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';

interface RevenueCardProps {
  title: string;
  amount: number;
  period: string;
  growthRate?: number;
  icon?: LucideIcon;
  iconColor?: string;
  loading?: boolean;
}

export const RevenueCard: React.FC<RevenueCardProps> = ({
  title,
  amount,
  period,
  growthRate,
  icon: Icon = DollarSign,
  iconColor = 'blue',
  loading = false
}) => {
  const isPositiveGrowth = growthRate !== undefined && growthRate > 0;

  const getIconColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'purple': return 'bg-purple-500/20 text-purple-400';
      case 'orange': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
            <div className="w-16 h-6 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="space-y-2">
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
            <div className="w-32 h-8 bg-gray-700 rounded"></div>
            <div className="w-20 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${getIconColorClasses(iconColor)}`}>
          <Icon className="w-6 h-6" />
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
