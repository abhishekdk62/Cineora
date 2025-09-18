//@ts-nocheck
"use client";

import React from "react";
import { Clock, Users, Calendar, Film } from "lucide-react";

interface ShowtimeCardProps {
  showtime: string;
  onClick: () => void;
  lexendMedium: string;
  lexendSmall: string;
}

const ShowtimeCard: React.FC<ShowtimeCardProps> = ({
  showtime,
  onClick,
  lexendMedium,
  lexendSmall,
}) => {
  const bookedSeatsCount = showtime.bookedSeats?.length || 0;
  const occupancyPercentage = Math.round((bookedSeatsCount / showtime.totalSeats) * 100);
  
  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    if (percentage >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div
      onClick={onClick}
      className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-gray-400/50 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
    >
      {/* Movie Poster */}
      <div className="flex justify-center mb-4">
        <img
          src={showtime.movieId.poster}
          alt={showtime.movieId.title}
          className="w-32 h-44 object-cover rounded-lg border border-gray-500/30 shadow-lg"
        />
      </div>

      {/* Movie Title */}
      <div className="text-center mb-3">
        <h3 className={`${lexendMedium.className} text-white text-lg mb-1 truncate group-hover:text-blue-400 transition-colors`}>
          {showtime.movieId.title}
        </h3>
        <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
          {showtime.language?.toUpperCase()} • {showtime.format}
        </p>
      </div>

      {/* Show Times */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-xs`}>Start Time</p>
              <p className={`${lexendMedium.className} text-blue-400 text-lg`}>
                {showtime.showTime}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-xs`}>End Time</p>
              <p className={`${lexendMedium.className} text-purple-400 text-lg`}>
                {showtime.endTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seats Info */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className={`${lexendSmall.className} text-gray-400 text-xs`}>Occupancy</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className={`${lexendMedium.className} text-white text-sm`}>
            {bookedSeatsCount}/{showtime.totalSeats} seats
          </p>
          <p className={`${lexendSmall.className} ${getOccupancyColor(occupancyPercentage)} text-xs font-medium`}>
            {occupancyPercentage}% filled
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              occupancyPercentage >= 80 
                ? 'bg-green-400' 
                : occupancyPercentage >= 60 
                ? 'bg-yellow-400' 
                : occupancyPercentage >= 40 
                ? 'bg-orange-400' 
                : 'bg-red-400'
            }`}
            style={{ width: `${occupancyPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Screen Info */}
      <div className="text-center">
        <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
          Screen: {showtime.screenId.name}
        </p>
        <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
          Age Restriction: {showtime.ageRestriction}+
        </p>
      </div>
    </div>
  );
};

export default ShowtimeCard;
