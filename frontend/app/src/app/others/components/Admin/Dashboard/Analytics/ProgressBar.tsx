// components/admin/analytics/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  maxValue,
  color = 'yellow',
  size = 'md',
  showPercentage = true,
  showValue = false,
  className = ""
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-500',
    red: 'bg-red-400',
    purple: 'bg-purple-400'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className={`font-medium text-gray-400 ${textSizeClasses[size]}`}>
          {label}
        </span>
        <div className={`text-gray-300 ${textSizeClasses[size]}`}>
          {showValue && (
            <span className="mr-2">
              {new Intl.NumberFormat('en-IN').format(value)} / {new Intl.NumberFormat('en-IN').format(maxValue)}
            </span>
          )}
          {showPercentage && (
            <span>{percentage.toFixed(1)}%</span>
          )}
        </div>
      </div>
      
      <div className={`w-full bg-gray-700/50 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
