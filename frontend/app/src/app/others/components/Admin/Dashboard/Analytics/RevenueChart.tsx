import React from 'react';
import { ChartContainer } from './ChartContainer';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  bookings: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  loading?: boolean;
  type?: 'daily' | 'monthly';
  onRefresh?: () => void;
  onDownload?: () => void;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  loading = false,
  type = 'daily',
  onRefresh,
  onDownload
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const renderChart = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-300">
          No revenue data available
        </div>
      );
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue));
    
    return (
      <div className="h-full flex items-end justify-between gap-2 px-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-yellow-500 rounded-t-sm hover:bg-yellow-400 transition-colors cursor-pointer relative group"
              style={{
                height: `${(item.revenue / maxRevenue) * 200}px`,
                minHeight: '4px'
              }}
              title={`${item.date}: ${formatCurrency(item.revenue)}`}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900/90 border border-yellow-500/20 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatCurrency(item.revenue)}
              </div>
            </div>
            <div className="text-xs text-gray-300 mt-2 transform -rotate-45 origin-left">
              {new Date(item.date).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ChartContainer
      title={`${type === 'daily' ? 'Daily' : 'Monthly'} Revenue Trends`}
      subtitle={`Revenue performance over ${type === 'daily' ? 'days' : 'months'}`}
      loading={loading}
      onRefresh={onRefresh}
      onDownload={onDownload}
      height="h-80"
    >
      {renderChart()}
    </ChartContainer>
  );
};
