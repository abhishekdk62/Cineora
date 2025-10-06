'use client'
import React, { useMemo } from 'react';
import { Film, Star, TrendingUp, Users, Clock, Award, Play, DollarSign } from 'lucide-react';
import { Lexend } from 'next/font/google';

interface BookingData {
  _id: string;
  bookingId: string;
  userId: string;
  movieId: {
    _id: string;
    title: string;
    genre: string[];
    language: string;
    rating?: string;
    poster?: string;
    duration?: number;
    director?: string;
    releaseDate?: string;
  };
  theaterId: {
    _id: string;
    name: string;
    city: string;
    ownerId: string;
  };
  priceDetails: {
    total: number;
    subtotal: number;
    taxes: number;
    convenienceFee: number;
  };
  bookedAt: string;
  paymentStatus: string;
  bookingStatus: string;
  selectedSeats: string[];
}

interface MovieSalesAnalyticsProps {
  data: BookingData[];
  lexend: any;
}

interface MovieStats {
  movieId: string;
  movieData: BookingData['movieId'];
  totalRevenue: number;
  totalBookings: number;
  totalSeatsBooked: number;
  uniqueUsers: number;
  avgRevenuePerBooking: number;
  theaters: Set<string>;
  cities: Set<string>;
  bookingDates: string[];
  confirmedBookings: number;
  conversionRate: number;
}

const MovieSalesAnalytics: React.FC<MovieSalesAnalyticsProps> = ({ data, lexend }) => {
  // Process movie statistics
  const movieStats = useMemo((): MovieStats[] => {
    const movieMap = new Map<string, MovieStats>();

    data.forEach(booking => {
      const movieId = booking.movieId._id;
      
      if (!movieMap.has(movieId)) {
        movieMap.set(movieId, {
          movieId,
          movieData: booking.movieId,
          totalRevenue: 0,
          totalBookings: 0,
          totalSeatsBooked: 0,
          uniqueUsers: 0,
          avgRevenuePerBooking: 0,
          theaters: new Set(),
          cities: new Set(),
          bookingDates: [],
          confirmedBookings: 0,
          conversionRate: 0
        });
      }

      const stats = movieMap.get(movieId)!;
      
      // Update statistics
      if (booking.paymentStatus === 'completed') {
        stats.totalRevenue += booking.priceDetails.total;
      }
      stats.totalBookings += 1;
      stats.totalSeatsBooked += booking.selectedSeats.length;
      stats.theaters.add(booking.theaterId.name);
      stats.cities.add(booking.theaterId.city);
      stats.bookingDates.push(booking.bookedAt);
      
      if (booking.bookingStatus === 'confirmed') {
        stats.confirmedBookings += 1;
      }
    });

    // Calculate derived metrics and unique users
    const movieStatsArray: MovieStats[] = [];
    
    movieMap.forEach(stats => {
      // Calculate unique users for this movie
      const movieBookings = data.filter(booking => booking.movieId._id === stats.movieId);
      stats.uniqueUsers = new Set(movieBookings.map(b => b.userId)).size;
      
      // Calculate averages
      stats.avgRevenuePerBooking = stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0;
      stats.conversionRate = stats.totalBookings > 0 ? (stats.confirmedBookings / stats.totalBookings) * 100 : 0;
      
      movieStatsArray.push(stats);
    });

    // Sort by total revenue (descending)
    return movieStatsArray.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [data]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalMovies = movieStats.length;
    const totalRevenue = movieStats.reduce((sum, movie) => sum + movie.totalRevenue, 0);
    const totalBookings = movieStats.reduce((sum, movie) => sum + movie.totalBookings, 0);
    const totalSeats = movieStats.reduce((sum, movie) => sum + movie.totalSeatsBooked, 0);
    
    return {
      totalMovies,
      totalRevenue,
      totalBookings,
      totalSeats,
      avgRevenuePerMovie: totalMovies > 0 ? totalRevenue / totalMovies : 0,
      avgBookingsPerMovie: totalMovies > 0 ? totalBookings / totalMovies : 0
    };
  }, [movieStats]);

  const getRankBadge = (index: number) => {
    if (index === 0) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: '👑' };
    if (index === 1) return { bg: 'bg-gray-400/20', text: 'text-gray-300', icon: '🥈' };
    if (index === 2) return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: '🥉' };
    return { bg: 'bg-gray-600/20', text: 'text-gray-400', icon: `#${index + 1}` };
  };

  if (movieStats.length === 0) {
    return (
      <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-6">
        <div className="text-center text-gray-400">
          <Film className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className={`${lexend.className} text-lg`}>No movie data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Film className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className={`${lexend.className} text-xl text-white font-semibold`}>
            Movie Sales Analytics
          </h3>
          <p className="text-gray-400 text-sm">
            Top performing movies by revenue and engagement
          </p>
        </div>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Total Movies</span>
          </div>
          <p className={`${lexend.className} text-xl text-white font-bold`}>
            {overallMetrics.totalMovies}
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Total Revenue</span>
          </div>
          <p className={`${lexend.className} text-xl text-white font-bold`}>
            ₹{overallMetrics.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Total Bookings</span>
          </div>
          <p className={`${lexend.className} text-xl text-white font-bold`}>
            {overallMetrics.totalBookings.toLocaleString()}
          </p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">Avg per Movie</span>
          </div>
          <p className={`${lexend.className} text-xl text-white font-bold`}>
            ₹{Math.round(overallMetrics.avgRevenuePerMovie).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Movie Performance List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {movieStats.map((movie, index) => {
          const rankBadge = getRankBadge(index);
          
          return (
            <div
              key={movie.movieId}
              className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Movie Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  {movie.movieData.poster ? (
                    <img
                      src={movie.movieData.poster}
                      alt={movie.movieData.title}
                      className="w-16 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-movie.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-600/50 rounded-lg flex items-center justify-center">
                      <Film className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {/* Rank Badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold mb-2 ${rankBadge.bg} ${rankBadge.text}`}>
                        <span>{rankBadge.icon}</span>
                        <span>Rank {index + 1}</span>
                      </div>
                      
                      <h4 className={`${lexend.className} text-white font-semibold text-lg mb-1 line-clamp-2`}>
                        {movie.movieData.title}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-2">
                        {movie.movieData.language && (
                          <span className="flex items-center gap-1">
                            🌐 {movie.movieData.language.toUpperCase()}
                          </span>
                        )}
                        {movie.movieData.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.movieData.duration} min
                          </span>
                        )}
                        {movie.movieData.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {movie.movieData.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Revenue Display */}
                    <div className="text-right">
                      <p className={`${lexend.className} text-green-400 font-bold text-xl`}>
                        ₹{movie.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {movie.totalBookings} bookings
                      </p>
                    </div>
                  </div>

                  {/* Genre Tags */}
                  {movie.movieData.genre && movie.movieData.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.movieData.genre.slice(0, 3).map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                      {movie.movieData.genre.length > 3 && (
                        <span className="px-2 py-1 bg-gray-600/30 text-gray-400 rounded-full text-xs">
                          +{movie.movieData.genre.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Revenue</span>
                  </div>
                  <p className={`${lexend.className} text-white font-bold text-sm`}>
                    ₹{movie.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 text-xs font-medium">Users</span>
                  </div>
                  <p className={`${lexend.className} text-white font-bold text-sm`}>
                    {movie.uniqueUsers}
                  </p>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Play className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">Seats</span>
                  </div>
                  <p className={`${lexend.className} text-white font-bold text-sm`}>
                    {movie.totalSeatsBooked}
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Award className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-medium">Avg/Booking</span>
                  </div>
                  <p className={`${lexend.className} text-white font-bold text-sm`}>
                    ₹{Math.round(movie.avgRevenuePerBooking)}
                  </p>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-600/30">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Theater Reach</p>
                  <p className={`${lexend.className} text-white text-sm font-medium`}>
                    {movie.theaters.size} theaters across {movie.cities.size} cities
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Conversion Rate</p>
                  <p className={`${lexend.className} text-white text-sm font-medium`}>
                    {movie.conversionRate.toFixed(1)}% success rate
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 pt-4 border-t border-gray-600/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-sm">Top Movie Revenue</p>
            <p className={`${lexend.className} text-green-400 font-bold text-lg`}>
              ₹{movieStats[0]?.totalRevenue.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Avg Seats/Movie</p>
            <p className={`${lexend.className} text-blue-400 font-bold text-lg`}>
              {Math.round(overallMetrics.totalSeats / overallMetrics.totalMovies) || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Most Popular</p>
            <p className={`${lexend.className} text-purple-400 font-bold text-sm`}>
              {movieStats[0]?.movieData.title.slice(0, 15) || 'N/A'}
              {movieStats[0]?.movieData.title.length > 15 && '...'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Seats Sold</p>
            <p className={`${lexend.className} text-yellow-400 font-bold text-lg`}>
              {overallMetrics.totalSeats.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSalesAnalytics;
