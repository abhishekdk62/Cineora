"use client";
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Calendar, Ticket, Target } from 'lucide-react';
import { getScreenWiseRevenueApi } from '@/app/others/services/commonServices/analyticServices';
import { AnalyticsQueryDto, ScreenRevenueResponseDto } from '@/app/others/dtos/analytics.dto';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';

// Font variables
const lexendMediumStyle = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ScreenRevenueDetailsProps {
  screenId: string;
  screenName: string;
  theaterId: string;
  dateRange?: DateRange | null;
}

export const ScreenRevenueDetails: React.FC<ScreenRevenueDetailsProps> = ({ 
  screenId, 
  screenName, 
  theaterId,
  dateRange
}) => {
  const [revenueData, setRevenueData] = useState<ScreenRevenueResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Helper function to convert local period to API period
  const mapPeriodToApiPeriod = (period: 'today' | 'week' | 'month'): 'monthly' | 'quarterly' | undefined => {
    switch (period) {
      case 'today':
        return undefined;
      case 'week':
        return undefined;
      case 'month':
        return 'monthly';
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const fetchScreenRevenue = async () => {
      try {
        setLoading(true);
        
        const params: AnalyticsQueryDto = {
          screenId: screenId,
          theaterId: theaterId,
        };

        if (dateRange) {
          params.startDate = dateRange.startDate;
          params.endDate = dateRange.endDate;
        } else {
          const apiPeriod = mapPeriodToApiPeriod(selectedPeriod);
          if (apiPeriod) {
            params.period = apiPeriod;
          }
        }

        const response = await getScreenWiseRevenueApi(params);
        setRevenueData(response);
        console.log(response);
        
      } catch (err) {
        console.error('Error fetching screen revenue:', err);
        setError('Failed to load screen revenue');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenRevenue();
  }, [screenId, theaterId, selectedPeriod, dateRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-64 h-8 bg-gray-600 rounded animate-pulse"></div>
          <div className="w-48 h-8 bg-gray-600 rounded animate-pulse"></div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="animate-pulse space-y-4">
                <div className="p-3 bg-gray-700/30 rounded-xl w-fit">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                  <div className="w-32 h-8 bg-gray-600 rounded"></div>
                  <div className="w-24 h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !revenueData) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <TrendingDown className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-400" style={lexendSmallStyle}>{error}</p>
        </div>
      </div>
    );
  }

  // Find the specific screen data by matching screenId
  const specificScreenData = revenueData.data?.find(screen => screen.screenId === screenId);

  if (!specificScreenData) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <Target className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-yellow-400" style={lexendSmallStyle}>
            Oops No Revenue data found for this screen. Maybe no bookings for this date
          </p>
        </div>
      </div>
    );
  }

  const {
    totalRevenue,
    totalBookings,
    avgTicketPrice,
    utilizationRate
  } = specificScreenData;

  return (
    <div className="space-y-6">
      {/* Screen Title and Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-2xl text-white" style={lexendMediumStyle}>
          {screenName} Revenue Analytics
        </h2>
        
        {/* Only show period selector if no dateRange is provided */}
        {!dateRange && (
          <div className="flex gap-2">
            {['today', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as 'today' | 'week' | 'month')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'hover:text-white hover:bg-white/10 text-gray-400 border border-gray-500/30'
                }`}
                style={lexendSmallStyle}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Show date range info if provided */}
        {dateRange && (
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-xl px-4 py-2">
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>
              {dateRange.startDate} to {dateRange.endDate}
            </p>
          </div>
        )}
      </div>

      {/* Revenue Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
              Total Revenue
            </h3>
            <p className="text-2xl text-white" style={lexendMediumStyle}>
              ₹{totalRevenue?.toLocaleString('en-IN') || '0'}
            </p>
            <p className="text-gray-500 text-xs" style={lexendSmallStyle}>
              {dateRange 
                ? `${dateRange.startDate} to ${dateRange.endDate}`
                : selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'
              }
            </p>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
              Total Bookings
            </h3>
            <p className="text-2xl text-white" style={lexendMediumStyle}>
              {totalBookings?.toLocaleString('en-IN') || '0'}
            </p>
            <p className="text-gray-500 text-xs" style={lexendSmallStyle}>
              Confirmed tickets
            </p>
          </div>
        </div>

        {/* Average Ticket Price Card */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Ticket className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
              Avg Ticket Price
            </h3>
            <p className="text-2xl text-white" style={lexendMediumStyle}>
              ₹{avgTicketPrice?.toFixed(2) || '0'}
            </p>
            <p className="text-gray-500 text-xs" style={lexendSmallStyle}>
              Per ticket sold
            </p>
          </div>
        </div>

        {/* Utilization Rate Card */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
            {utilizationRate && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
                <TrendingUp className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-400" style={lexendSmallStyle}>
                  {utilizationRate}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
              Utilization Rate
            </h3>
            <p className="text-2xl text-white" style={lexendMediumStyle}>
              {utilizationRate || '0'}%
            </p>
            <p className="text-gray-500 text-xs" style={lexendSmallStyle}>
              Seat occupancy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
