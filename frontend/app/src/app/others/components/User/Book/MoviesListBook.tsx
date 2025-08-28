"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { UnifiedBookingEntity } from "@/app/book/[id]/page";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface MoviesListBookProps {
  movies: UnifiedBookingEntity[];
  selectedDate: Date;
  theater?: UnifiedBookingEntity;
  onShowtimeSelect: (showtimeId: string) => void;
}

export default function MoviesListBook({
  movies,
  selectedDate,
  theater,
  onShowtimeSelect,
}: MoviesListBookProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getLowestPrice = (rowPricing?: any[]): number => {
    if (!rowPricing || rowPricing.length === 0) return 0;
    return Math.min(...rowPricing.map(row => row.showtimePrice ?? row.basePrice ?? 0));
  };

  const getTotalAvailableSeats = (rowPricing?: any[]): number => {
    if (!rowPricing) return 0;
    return rowPricing.reduce((total, row) => total + (row.availableSeats ?? 0), 0);
  };

  const isShowtimeExpired = (showTime: string, showDate: Date): boolean => {
    const now = new Date();
    
    const showDateTime = new Date(showDate);
    const [hours, minutes] = showTime.split(':');
    showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDateTime = new Date(showDateTime.getTime() + 2 * 60 * 60 * 1000);
    
    return endDateTime <= now;
  };

  const groupMoviesByMovieAndScreen = () => {
    const grouped = new Map<string, UnifiedBookingEntity[]>();
    
    movies.forEach((movie) => {
      const movieId = movie.movieId?._id || movie._id;
      const screenId = movie.screenId?._id || 'default-screen';
      const key = `${movieId}-${screenId}`;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(movie);
    });
    
    return Array.from(grouped.values());
  };

  const groupedMovies = groupMoviesByMovieAndScreen();

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {groupedMovies.map((movieGroup, groupIndex) => {
            const representativeMovie = movieGroup[0];
            const movieData = representativeMovie.movieId || representativeMovie;
            const screenData = representativeMovie.screenId;

            return (
              <div
                key={`${representativeMovie.movieId?._id || representativeMovie._id}-${representativeMovie.screenId?._id || groupIndex}`}
                className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 hover:border-white/30 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Movie Info */}
                  <div className="lg:col-span-1">
                    <div className="flex gap-4 mb-4">
                      <img
                        src={movieData?.poster ?? "/api/placeholder/80/112"}
                        alt={movieData?.title ?? "Movie"}
                        className="w-16 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/api/placeholder/80/112";
                        }}
                      />
                      <div>
                        <h3 className={`${lexendMedium.className} text-white text-xl mb-2`}>
                          {movieData?.title ?? "Unknown Movie"}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-300 mb-2">
                          <span className={`${lexendSmall.className}`}>
                            {movieData?.rating ?? "N/A"}
                          </span>
                          <span className={`${lexendSmall.className}`}>•</span>
                          <span className={`${lexendSmall.className}`}>
                            {movieData?.duration ? formatDuration(movieData.duration) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(movieData?.genre ?? []).map((g, index) => (
                            <span
                              key={index}
                              className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Screen Info */}
                    <div className="mb-4">
                      <p className={`${lexendSmall.className} text-gray-300 text-sm mb-2`}>
                        <span className="font-medium">Screen:</span> {screenData?.name ?? 'Screen'}
                      </p>
                    </div>

                    {/* Movie Formats and Languages - Get unique values from all showtimes */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Unique formats */}
                      {Array.from(new Set(movieGroup.map(m => m.format).filter(Boolean))).map((format, index) => (
                        <span
                          key={`format-${index}`}
                          className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
                        >
                          {format}
                        </span>
                      ))}
                      {/* Unique languages */}
                      {Array.from(new Set(movieGroup.map(m => m.language).filter(Boolean))).map((language, index) => (
                        <span
                          key={`lang-${index}`}
                          className={`${lexendSmall.className} bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30`}
                        >
                          {language?.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Showtimes - Now showing all showtimes for this movie-screen combination */}
                  <div className="lg:col-span-3">
                    <h4 className={`${lexendMedium.className} text-white text-lg mb-4`}>
                      Show Times
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-start">
                      {movieGroup.map((movie) => {
                        const lowestPrice = movie.rowPricing ? getLowestPrice(movie.rowPricing) : 0;
                        const totalAvailable = movie.rowPricing ? getTotalAvailableSeats(movie.rowPricing) : (movie.availableSeats ?? 0);
                        const showtimeId = movie._id;
                        const displayTime = movie.showTime ?? 'N/A';

                        const isExpired = isShowtimeExpired(displayTime, selectedDate);

                        return (
                          <button
                            key={showtimeId}
                            onClick={() => !isExpired && onShowtimeSelect(showtimeId)} 
                            disabled={isExpired} 
                            className={`${lexendSmall.className} rounded-lg p-3 transition-all duration-300 text-left ${
                              isExpired 
                                ? "bg-gray-800/30 border border-gray-600/20 cursor-not-allowed opacity-50" 
                                : `bg-white/10 hover:bg-white/20 border border-gray-500/30 hover:border-white/50 ${
                                    totalAvailable < 20 ? "border-red-400/50" : ""
                                  }`
                            }`}
                          >
                            <div className={`font-medium mb-1 ${
                              isExpired ? "text-gray-500" : "text-white" 
                            }`}>
                              {displayTime}
                         
                            </div>
                            <div className={`text-xs mb-1 ${
                              isExpired ? "text-gray-600" : "text-gray-400"
                            }`}>
                              {movie.format ?? '2D'} • {movie.language?.toUpperCase() ?? 'N/A'}
                            </div>
                            <div className={`text-xs mb-2 ${
                              isExpired ? "text-gray-600" : "text-gray-400"
                            }`}>
                              {lowestPrice > 0 ? `From ₹${lowestPrice}` : 'Price TBD'}
                            </div>

                            {/* Availability Indicator */}
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isExpired 
                                    ? "bg-gray-600" 
                                    : totalAvailable > 50
                                      ? "bg-green-400"
                                      : totalAvailable > 20
                                        ? "bg-yellow-400"
                                        : "bg-red-400"
                                }`}
                              />
                              <span className={`text-xs ${
                                isExpired ? "text-gray-600" : "text-gray-400"
                              }`}>
                                {isExpired ? "Show ended" : `${totalAvailable} seats`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
