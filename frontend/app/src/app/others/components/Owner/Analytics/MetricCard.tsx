// @ts-nocheck
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  lexendMedium: string;
  lexendSmall: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  lexendMedium,
  lexendSmall
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colorClasses[color]} rounded-xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className={`${lexendSmall.className} text-gray-400 text-sm`}>
          {title}
        </h3>
        <p className={`${lexendMedium.className} text-2xl text-white font-semibold`}>
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </p>
        {subtitle && (
          <p className={`${lexendSmall.className} text-gray-500 text-xs`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
