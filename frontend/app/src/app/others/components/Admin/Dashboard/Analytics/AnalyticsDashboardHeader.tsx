import React from 'react';
import { 
  BarChart3, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  Users,
  Building
} from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onFilterClick: () => void;
  onExportClick: () => void;
  onRefreshClick: () => void;
  isRefreshing?: boolean;
  activeFilters?: {
    dateRange?: string;
    owner?: string;
    theater?: string;
  };
  className?: string;
}

export const AnalyticsDashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  onFilterClick,
  onExportClick,
  onRefreshClick,
  isRefreshing = false,
  activeFilters,
  className = ""
}) => {
  const getActiveFiltersCount = () => {
    if (!activeFilters) return 0;
    return Object.values(activeFilters).filter(Boolean).length;
  };

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div>
            <h1 className="text-2xl text-yellow-400 font-medium">{title}</h1>
            {subtitle && (
              <p className="text-gray-300 mt-1">{subtitle}</p>
            )}
            
            {/* Active Filters Display */}
            {activeFilters && getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {activeFilters.dateRange && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/30">
                    <Calendar className="w-3 h-3" />
                    {activeFilters.dateRange}
                  </div>
                )}
                {activeFilters.owner && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                    <Users className="w-3 h-3" />
                    {activeFilters.owner}
                  </div>
                )}
                {activeFilters.theater && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
                    <Building className="w-3 h-3" />
                    {activeFilters.theater}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onFilterClick}
            className="relative flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Filter className="w-4 h-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          
          <button
            onClick={onRefreshClick}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={onExportClick}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
