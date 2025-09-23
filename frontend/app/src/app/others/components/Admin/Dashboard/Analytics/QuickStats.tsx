import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  format?: 'currency' | 'number' | 'percentage';
}

interface QuickStatsProps {
  stats: StatItem[];
  loading?: boolean;
  className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  stats,
  loading = false,
  className = ""
}) => {
  const formatValue = (value: string | number, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-IN').format(value);
    }
  };

  const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="w-3 h-3" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-400 bg-green-500/20';
      case 'decrease':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-300 bg-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-700/50 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-700/50 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-700/50 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition-all duration-200">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-400">{stat.label}</p>
            <p className="text-xl font-bold text-white">
              {formatValue(stat.value, stat.format)}
            </p>
            
            {stat.change && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(stat.change.type)}`}>
                {getTrendIcon(stat.change.type)}
                <span>
                  {stat.change.value > 0 ? '+' : ''}{stat.change.value.toFixed(1)}%
                </span>
                <span className="text-gray-300">
                  {stat.change.period}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
