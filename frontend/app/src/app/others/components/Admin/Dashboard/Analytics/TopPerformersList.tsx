import React from 'react';
import { Crown, TrendingUp, TrendingDown } from 'lucide-react';

interface TopPerformer {
  id: string;
  name: string;
  value: number;
  subtitle?: string;
  change?: number;
  rank: number;
}

interface TopPerformersListProps {
  title: string;
  data: TopPerformer[];
  loading?: boolean;
  type?: 'revenue' | 'bookings' | 'occupancy';
  limit?: number;
  className?: string;
}

export const TopPerformersList: React.FC<TopPerformersListProps> = ({
  title,
  data,
  loading = false,
  type = 'revenue',
  limit = 5,
  className = ""
}) => {
  const formatValue = (value: number) => {
    switch (type) {
      case 'revenue':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
        }).format(value);
      case 'occupancy':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-IN').format(value);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    return <span className="text-sm font-semibold text-gray-400">#{rank}</span>;
  };

  if (loading) {
    return (
      <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
        <div className="h-6 bg-gray-700/50 rounded w-48 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 animate-pulse">
              <div className="w-6 h-6 bg-gray-700/50 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700/50 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-700/50 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-700/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const displayData = data.slice(0, limit);

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
      <h3 className="text-2xl text-yellow-400 font-medium mb-4">{title}</h3>
      
      {displayData.length === 0 ? (
        <div className="text-center py-8 text-gray-300">
          No data available
        </div>
      ) : (
        <div className="space-y-3">
          {displayData.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-yellow-500/5 transition-all duration-200">
              <div className="flex items-center justify-center w-6">
                {getRankIcon(item.rank)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">
                  {item.name}
                </div>
                {item.subtitle && (
                  <div className="text-sm text-gray-300 truncate">
                    {item.subtitle}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-white">
                  {formatValue(item.value)}
                </div>
                {item.change !== undefined && (
                  <div className={`flex items-center gap-1 text-xs ${
                    item.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(item.change).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
