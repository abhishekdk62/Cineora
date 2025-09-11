// components/admin/analytics/AnalyticsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-yellow-400",
  trend,
  loading = false
}) => {
  if (loading) {
    return (
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
  }

  return (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-300">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-300">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-gray-800/50 border border-yellow-500/30">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
