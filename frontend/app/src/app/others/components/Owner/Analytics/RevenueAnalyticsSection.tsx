import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Building, Monitor } from 'lucide-react';

import {
  getMonthlyRevenueTrendsApi,
  getTheaterWiseRevenueApi,
  getScreenWiseRevenueApi,
  getMovieWiseRevenueApi
} from '../../../services/commonServices/analyticServices';
import { AnalyticsQueryDto } from '../../../dtos/analytics.dto';
import { LoadingCard } from './LoadingCard';
import { RevenueSummaryCard } from './RevenueSummaryCard';
import { MetricCard } from './MetricCard';
import { RevenueAreaChart } from './Charts';

interface RevenueAnalyticsSectionProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: string;
  lexendSmall: string;
}

export const RevenueAnalyticsSection: React.FC<RevenueAnalyticsSectionProps> = ({
  dateRange,
  lexendMedium,
  lexendSmall
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<string[]>([]);
  const [theaterData, setTheaterData] = useState<string[]>([]);
  const [screenData, setScreenData] = useState<string[]>([]);
  const [movieData, setMovieData] = useState<string[]>([]);

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      const [monthlyRes, theaterRes, screenRes, movieRes] = await Promise.all([
        getMonthlyRevenueTrendsApi({ months: 6 }),
        getTheaterWiseRevenueApi(dateRange),
        getScreenWiseRevenueApi(dateRange),
        getMovieWiseRevenueApi(dateRange)
      ]);
      console.log('monthlyRes.data', monthlyRes.data);
      console.log('theaterRes.data', theaterRes.data);
      console.log('screenRes.data', screenRes.data);
      console.log('movieRes.data', movieRes.data);

      setMonthlyData(monthlyRes.data || []);
      setTheaterData(theaterRes.data || []);
      setScreenData(screenRes.data || []);
      setMovieData(movieRes.data || []);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = theaterData.reduce((sum, theater) => sum + theater.totalRevenue, 0);
  const totalBookings = theaterData.reduce((sum, theater) => sum + theater.totalBookings, 0);
  const avgTicketPrice = totalBookings > 0 ? totalRevenue / totalBookings : 0;
  const revenueGrowth = monthlyData.length > 1 ? monthlyData[monthlyData.length - 1]?.growthRate : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`${lexendMedium.className} text-2xl text-white mb-2`}>
          Revenue Analytics
        </h2>
        <p className={`${lexendSmall.className} text-gray-400`}>
          Track your theater's financial performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RevenueSummaryCard
          title="Total Revenue"
          amount={totalRevenue}
          growthRate={revenueGrowth}
          period="Selected Period"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />

        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="Confirmed bookings"
          icon={Calendar}
          color="green"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />



        <MetricCard
          title="Average Ticket Price"
          value={`₹${avgTicketPrice.toFixed(0)}`}
          subtitle="Per ticket"
          icon={DollarSign}
          color="blue"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />

        <MetricCard
          title="Active Theaters"
          value={theaterData.length}
          subtitle="Generating revenue"
          icon={Building}
          color="purple"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>
      <div className="mt-8">
        <RevenueAreaChart
          dateRange={dateRange}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      </div>
      {/* Theater Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`${lexendMedium.className} text-lg text-white mb-4`}>
            Top Performing Theaters
          </h3>
          <div className="space-y-3">
            {theaterData.slice(0, 5).map((theater, index) => (
              <div key={theater.theaterId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className={`${lexendMedium.className} text-blue-400 text-sm font-semibold`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className={`${lexendMedium.className} text-white text-sm`}>
                      {theater.theaterName}
                    </p>
                    <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                      {theater.totalBookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    ₹{theater.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                    {theater.marketShare.toFixed(1)}% share
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`${lexendMedium.className} text-lg text-white mb-4`}>
            Top Performing Movies
          </h3>
          <div className="space-y-3">
            {movieData.slice(0, 5).map((movie, index) => (
              <div key={movie.movieId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className={`${lexendMedium.className} text-green-400 text-sm font-semibold`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className={`${lexendMedium.className} text-white text-sm`}>
                      {movie.movieTitle}
                    </p>
                    <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                      {movie.totalTickets} tickets sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    ₹{movie.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                    {movie.revenueShare.toFixed(1)}% share
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
