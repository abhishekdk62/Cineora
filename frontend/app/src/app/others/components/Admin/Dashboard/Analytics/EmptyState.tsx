// components/admin/analytics/EmptyState.tsx
import React from 'react';
import { BarChart3, Database, Search, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-data' | 'no-results' | 'error' | 'loading';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = ""
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'no-results':
        return <Search className="w-12 h-12 text-gray-300" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-400" />;
      case 'loading':
        return <Database className="w-12 h-12 text-yellow-400 animate-pulse" />;
      default:
        return <BarChart3 className="w-12 h-12 text-gray-300" />;
    }
  };

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-12 text-center ${className}`}>
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 border border-yellow-500/30 mb-4">
        {icon || getDefaultIcon()}
      </div>
      
      <h3 className="text-2xl text-yellow-400 font-medium mb-2">
        {title}
      </h3>
      
      <p className="text-gray-300 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
