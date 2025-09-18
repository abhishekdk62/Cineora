// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Film, BarChart2, Globe, Star, Trophy } from 'lucide-react';

import { AnalyticsQueryDto } from '../../../dtos/analytics.dto';
import { getMovieAnalyticsApi } from '@/app/others/services/commonServices/analyticServices';
import { LoadingCard } from './LoadingCard';
import { MetricCard } from './MetricCard';
import { FormatPieChart } from './Charts';

interface MovieAnalyticsSectionProps {
  dateRange: AnalyticsQueryDto;
  lexendMedium: string;
  lexendSmall: string;
}

export const MovieAnalyticsSection: React.FC<MovieAnalyticsSectionProps> = ({
  dateRange,
  lexendMedium,
  lexendSmall
}) => {
  const [loading, setLoading] = useState(true);
  const [movieAnalytics, setMovieAnalytics] = useState<string>(null);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchMovieAnalytics();
    }
  }, [dateRange]);

  const fetchMovieAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getMovieAnalyticsApi(dateRange);
      setMovieAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching movie analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !movieAnalytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
      <div>
        <h2 className={`text-2xl text-white mb-2`} style={lexendMedium}>
          Movie Analytics
        </h2>
        <p className={`text-gray-400`} style={lexendSmall}>
          Insights on movie performance and audience preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Top Movies"
          value={movieAnalytics.topMovies.length}
          subtitle="High performing films"
          icon={Film}
          color="blue"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Formats Available"
          value={movieAnalytics.formatPerformance.length}
          subtitle="2D, 3D, IMAX options"
          icon={BarChart2}
          color="green"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
        
        <MetricCard
          title="Languages"
          value={movieAnalytics.languagePerformance.length}
          subtitle="Multi-language content"
          icon={Globe}
          color="purple"
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />

      </div>
<div className="mt-8">
  <FormatPieChart
    dateRange={dateRange} 
    lexendMedium={lexendMedium} 
    lexendSmall={lexendSmall} 
  />
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Movies */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium}>
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top Performing Movies
          </h3>
          <div className="space-y-3">
            {movieAnalytics.topMovies.slice(0, 5).map((movie: string, index: number) => (
              <div key={movie.movieId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className={`text-yellow-400 text-sm font-semibold`} style={lexendMedium}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className={`text-white font-medium`} style={lexendMedium}>
                      {movie.movieTitle}
                    </p>
                    <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                      {movie.totalTickets} tickets • {movie.totalShows} shows
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-white text-sm font-medium`} style={lexendMedium}>
                    ₹{movie.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className={`text-yellow-400 text-xs`} style={lexendSmall}>
                      Rank #{movie.rank}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Format Performance */}
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium}>
            <BarChart2 className="w-5 h-5 text-blue-400" />
            Format Performance
          </h3>
          <div className="space-y-3">
            {movieAnalytics.formatPerformance.map((format: string, index: number) => (
              <div key={format.format} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className={`text-blue-400 text-xs font-semibold`} style={lexendMedium}>
                      {format.format}
                    </span>
                  </div>
                  <div>
                    <p className={`text-white font-medium`} style={lexendMedium}>
                      {format.format} Format
                    </p>
                    <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                      {format.totalBookings} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-white text-sm`} style={lexendMedium}>
                    ₹{format.totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                    {format.marketShare.toFixed(1)}% share
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language Performance */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <h3 className={`text-lg text-white mb-4 flex items-center gap-2`} style={lexendMedium}>
          <Globe className="w-5 h-5 text-green-400" />
          Language Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movieAnalytics.languagePerformance.map((lang: string) => (
            <div key={lang.language} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-white font-medium`} style={lexendMedium}>
                  {lang.language}
                </h4>
                <span className={`text-green-400 text-sm`} style={lexendMedium}>
                  {lang.marketShare.toFixed(1)}%
                </span>
              </div>
              <p className={`text-gray-400 text-sm mb-1`} style={lexendSmall}>
                Revenue: ₹{lang.totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className={`text-gray-400 text-xs`} style={lexendSmall}>
                {lang.totalBookings} bookings • Avg: ₹{lang.avgTicketPrice.toFixed(0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
