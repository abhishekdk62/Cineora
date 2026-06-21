import React, { useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { AnalyticsBookingRecord } from '@/app/others/types/common.types';

interface RevenueTrendChartProps {
  data: AnalyticsBookingRecord[];
}

interface DailyRevenueEntry {
  date: string;
  revenue: number;
  bookings: number;
  percentage?: number;
}

const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data }) => {
  const trendData = useMemo(() => {
    const dailyRevenue = data.reduce<Record<string, DailyRevenueEntry>>((acc, booking) => {
      const date = new Date(booking.bookedAt ?? '').toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          revenue: 0,
          bookings: 0
        };
      }
      acc[date].revenue += booking.priceDetails?.total || 0;
      acc[date].bookings += 1;
      return acc;
    }, {});

    const sortedData = Object.values(dailyRevenue)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    const maxRevenue = Math.max(...sortedData.map((d) => d.revenue), 0);

    return sortedData.map((item) => ({
      ...item,
      percentage: maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
    }));
  }, [data]);

  const trendMetrics = useMemo(() => {
    if (trendData.length < 2) return { change: 0, isPositive: true, recentAvg: 0, previousAvg: 0 };

    const recent = trendData.slice(-7);
    const previous = trendData.slice(-14, -7);

    const recentAvg = recent.reduce((sum, item) => sum + item.revenue, 0) / recent.length;
    const previousAvg = previous.length > 0
      ? previous.reduce((sum, item) => sum + item.revenue, 0) / previous.length
      : recentAvg;

    const change = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;

    return {
      change: Math.abs(change),
      isPositive: change >= 0,
      recentAvg,
      previousAvg
    };
  }, [trendData]);

  if (trendData.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-6">
        <div className="text-center text-gray-400">No revenue data available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl text-white font-semibold">
              Revenue Trend
            </h3>
            <p className="text-gray-400 text-sm">
              Daily revenue for the last 30 days
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          trendMetrics.isPositive
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          <TrendingUp className={`w-4 h-4 ${
            trendMetrics.isPositive ? 'rotate-0' : 'rotate-180'
          }`} />
          <span className="text-sm font-bold">
            {trendMetrics.change.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-64 mb-4">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pr-2">
          <span>₹{Math.max(...trendData.map((d) => d.revenue)).toLocaleString()}</span>
          <span>₹{(Math.max(...trendData.map((d) => d.revenue)) / 2).toLocaleString()}</span>
          <span>₹0</span>
        </div>

        <div className="ml-12 h-full flex items-end gap-1 overflow-x-auto">
          {trendData.map((item) => (
            <div key={item.date} className="flex-shrink-0 group relative">
              <div
                className="w-6 bg-gradient-to-t from-purple-500/60 to-purple-400/40 rounded-t-sm hover:from-purple-500/80 hover:to-purple-400/60 transition-all duration-300 cursor-pointer"
                style={{ height: `${Math.max(item.percentage ?? 0, 2)}%` }}
              ></div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-900 border border-purple-500/30 rounded-lg p-2 text-xs whitespace-nowrap">
                  <p className="text-white font-semibold">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-purple-400">
                    Revenue: ₹{item.revenue.toLocaleString()}
                  </p>
                  <p className="text-gray-400">
                    Bookings: {item.bookings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="ml-12 mt-2 flex justify-between text-xs text-gray-400">
          <span>{new Date(trendData[0]?.date).toLocaleDateString()}</span>
          <span>{new Date(trendData[Math.floor(trendData.length / 2)]?.date).toLocaleDateString()}</span>
          <span>{new Date(trendData[trendData.length - 1]?.date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Avg Daily</span>
          </div>
          <p className="text-white font-bold">
            ₹{Math.round(trendData.reduce((sum, item) => sum + item.revenue, 0) / trendData.length).toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Peak Day</span>
          </div>
          <p className="text-white font-bold">
            ₹{Math.max(...trendData.map((d) => d.revenue)).toLocaleString()}
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Total Days</span>
          </div>
          <p className="text-white font-bold">
            {trendData.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
