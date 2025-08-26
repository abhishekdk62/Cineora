// components/booking/BookingHeader.tsx
"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { UnifiedBookingEntity } from "@/app/book/[id]/page";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });

interface BookingHeaderProps {
  movie?: UnifiedBookingEntity | null;
  theater?: UnifiedBookingEntity | null;
  bookingFlow: 'movie-first' | 'theater-first' | null;
  onBack: () => void;
}

export default function BookingHeader({ 
  movie, 
  theater, 
  bookingFlow, 
  onBack 
}: BookingHeaderProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Helper function to format location safely
  const formatLocation = (theaterData: any): string => {
    // Try theaterLocation first
    if (theaterData?.theaterLocation?.coordinates) {
      const [lng, lat] = theaterData.theaterLocation.coordinates;
      return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
    }
    
    // Try location object
    if (theaterData?.location?.coordinates) {
      const [lng, lat] = theaterData.location.coordinates;
      return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
    }
    
    // Try location as string
    if (typeof theaterData?.location === 'string') {
      return theaterData.location;
    }
    
    // Try address fields
    if (theaterData?.city && theaterData?.state) {
      return `${theaterData.city}, ${theaterData.state}`;
    }
    
    if (theaterData?.address) {
      return theaterData.address;
    }
    
    return "Location not available";
  };

  return (
    <div className="pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className={`${lexendSmall.className} flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 mb-6`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {bookingFlow === 'movie-first' ? 'Movie' : 'Theater'} Details
        </button>

        <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30">
          {/* Movie Header (movie-first flow) */}
          {bookingFlow === 'movie-first' && movie && (
            <div className="flex items-center gap-6">
              <img
                src={movie.poster ?? "/api/placeholder/80/112"}
                alt={movie.title ?? "Movie"}
                className="w-20 h-28 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/api/placeholder/80/112";
                }}
              />
              <div>
                <h1 className={`${lexendBold.className} text-2xl md:text-3xl text-white mb-2`}>
                  {movie.title ?? "Unknown Movie"}
                </h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <span className={`${lexendSmall.className}`}>{movie.rating ?? "N/A"}</span>
                  <span className={`${lexendSmall.className}`}>•</span>
                  <span className={`${lexendSmall.className}`}>
                    {movie.duration ? formatDuration(movie.duration) : 'N/A'}
                  </span>
                  <span className={`${lexendSmall.className}`}>•</span>
                  <span className={`${lexendSmall.className}`}>
                    {movie.genre?.length ? movie.genre.join(", ") : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Theater Header (theater-first flow) */}
          {bookingFlow === 'theater-first' && theater && (
            <div>
              <h1 className={`${lexendBold.className} text-2xl md:text-3xl text-white mb-2`}>
                {theater.theaterName ?? theater.name ?? "Unknown Theater"}
              </h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className={`${lexendSmall.className}`}>
                  {formatLocation(theater)} {/* ✅ FIXED: Use helper function */}
                </span>
                {theater.distance && (
                  <>
                    <span className={`${lexendSmall.className}`}>•</span>
                    <span className={`${lexendSmall.className}`}>{theater.distance} away</span>
                  </>
                )}
              </div>
              {theater.amenities?.length && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {theater.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
