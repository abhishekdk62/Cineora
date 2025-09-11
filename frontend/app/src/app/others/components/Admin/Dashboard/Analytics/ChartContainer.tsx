// components/admin/analytics/ChartContainer.tsx
import React from 'react';
import { BarChart3, TrendingUp, Download, RefreshCw } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
  onDownload?: () => void;
  className?: string;
  height?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  onRefresh,
  onDownload,
  className = "",
  height = "h-80"
}) => {
  if (loading) {
    return (
      <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-700/50 rounded w-48 animate-pulse"></div>
            {subtitle && <div className="h-4 bg-gray-700/50 rounded w-32 animate-pulse"></div>}
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <div className={`bg-gray-700/50 rounded animate-pulse ${height}`}></div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-2xl text-yellow-400 font-medium">{title}</h3>
          </div>
          {subtitle && (
            <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className={height}>
        {children}
      </div>
    </div>
  );
};
