"use client";
import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Users, Ticket, PieChart } from 'lucide-react';
import { AnalyticsQueryDto, TheaterRevenueResponseDto } from '@/app/others/dtos/analytics.dto';
import { getTheaterWiseRevenueApi } from '@/app/others/services/commonServices/analyticServices';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';

// Font variables
const lexendMediumStyle = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface DateRange {
  startDate: string;
  endDate: string;
}

interface TheaterRevenueHeaderProps {
  theaterId: string;
  dateRange?: DateRange | null; 
}

export const TheaterRevenueHeader: React.FC<TheaterRevenueHeaderProps> = ({ theaterId, dateRange }) => {
  const [revenueData, setRevenueData] = useState<TheaterRevenueResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheaterRevenue = async () => {
      try {
        setLoading(true);
        const params: AnalyticsQueryDto = {
          theaterId: theaterId,
          ...(dateRange && {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate
          })
        };
        const response = await getTheaterWiseRevenueApi(params);
        console.log(response);
        setRevenueData(response);
      } catch (err) {
        console.error('Error fetching theater revenue:', err);
        setError('Failed to load theater revenue');
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterRevenue();
  }, [theaterId, dateRange]); 

  if (loading) {
    return (
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

  // Access the first theater data from the array
  const theaterData = revenueData.data?.[0];
  
  if (!theaterData) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <PieChart className="w-6 h-6 text-yellow-400" />
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
    marketShare
  } = theaterData;

  return (
    <div>

        <p className="text-2xl p-4 text-white mb-2 flex items-center gap-2" style={lexendMediumStyle}>
        Statistics :
      </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            {dateRange ? `${dateRange.startDate} to ${dateRange.endDate}` : 'Current Period'}
          </p>
        </div>
      </div>

      {/* Total Bookings Card */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Users className="w-6 h-6 text-green-400" />
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

      {/* Market Share Card */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <PieChart className="w-6 h-6 text-orange-400" />
          </div>
          {marketShare && (
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30">
              <TrendingUp className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-400" style={lexendSmallStyle}>
                {marketShare}%
              </span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm mb-1" style={lexendSmallStyle}>
            Market Share
          </h3>
          <p className="text-2xl text-white" style={lexendMediumStyle}>
            {marketShare || '0'}%
          </p>
          <p className="text-gray-500 text-xs" style={lexendSmallStyle}>
            Regional market
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};
