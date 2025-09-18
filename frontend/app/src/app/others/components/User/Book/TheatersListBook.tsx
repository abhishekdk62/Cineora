"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { RowPricing, UnifiedBookingEntity } from "@/app/others/types";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface TheatersListBookProps {
  theaters: UnifiedBookingEntity[];
  selectedDate: Date;
  movie?: UnifiedBookingEntity | null;
  onShowtimeSelect: (showtimeId: string) => void;
}

export default function TheatersListBook({
  theaters,
  selectedDate,
  movie,
  onShowtimeSelect,
}: TheatersListBookProps) {
  const getLowestPrice = (rowPricing?: RowPricing[]): number => {
    if (!rowPricing || rowPricing.length === 0) return 0;
    return Math.min(...rowPricing.map(row => row.showtimePrice ?? row.basePrice ?? 0));
  };

  const formatLocation = (theaterLocation?: { coordinates: [number, number]; type: string }): string => {
    if (!theaterLocation?.coordinates) return "Location not available";
    const [lng, lat] = theaterLocation.coordinates;
    return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
  };

  const getTotalAvailableSeats = (rowPricing?: RowPricing[]): number => {
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

  return (
    <div className="pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {theaters.map((theater) => (
            <div
              key={theater._id}
              className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 hover:border-white/30 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Theater Info */}
                <div className="lg:col-span-1">
                  <h3 className={`${lexendMedium.className} text-white text-xl mb-2`}>
                    {theater.theaterName ?? theater.name ?? "Unknown Theater"}
                  </h3>
                  {
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps?q=${theater.theaterLocation?.coordinates[1]},${theater.theaterLocation?.coordinates[0]}`;
                        window.open(url, "_blank");
                      }}
                      className="mt-2 text-xs text-[#009ffc] hover:text-[#1975d0] underline"
                    >
                      View on Google Maps
                    </button>}
             
                  <div className="flex mt-3 flex-wrap gap-2 mb-4">
                    {theater.showtimes && Array.from(new Set(theater.showtimes.map(s => s.format).filter(Boolean))).map((format, index) => (
                      <span
                        key={index}
                        className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
                      >
                        {format}
                      </span>
                    ))}
                    {theater.showtimes && Array.from(new Set(theater.showtimes.map(s => s.language).filter(Boolean))).map((lang, index) => (
                      <span
                        key={`lang-${index}`}
                        className={`${lexendSmall.className} bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30`}
                      >
                        {lang?.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes */}
                <div className="lg:col-span-3">
                  <h4 className={`${lexendMedium.className} text-white text-lg mb-4`}>
                    Show Times
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 justify-start">
                    {theater.showtimes?.map((showtime) => {
                      const lowestPrice = showtime.rowPricing ? getLowestPrice(showtime.rowPricing) : (showtime.price ?? 0);
                      const totalAvailable = showtime.rowPricing ? getTotalAvailableSeats(showtime.rowPricing) : (showtime.availableSeats ?? 0);
                      const showtimeId = showtime.showtimeId ?? showtime._id ?? '';
                      const displayTime = showtime.showTime ?? showtime.time ?? 'N/A';
                      
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
                            {showtime.screenName ?? 'Screen'} • {showtime.format ?? '2D'}
                          </div>
                          <div className={`text-xs mb-2 ${
                            isExpired ? "text-gray-600" : "text-gray-400"
                          }`}>
                            From ₹{lowestPrice}
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
          ))}
        </div>
      </div>
    </div>
  );
}
