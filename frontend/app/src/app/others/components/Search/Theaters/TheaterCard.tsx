"use client";

import React from "react";
import { Star, ArrowRight, MapPin } from "lucide-react";
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  location: {
    coordinates: [number, number]
  }
  rating: number;
  facilities: string[];
  distance?: string;
}

interface TheaterCardProps {
  theater: Theater;
  onViewNowShowing: (theaterId: string) => void;
}

const TheaterCard: React.FC<TheaterCardProps> = ({ theater, onViewNowShowing }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : index < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-600"
          }`}
      />
    ));
  };

  return (
    <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 hover:border-white/30 transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side - Theater Info */}
        <div className="flex-1">
          {/* Theater Name */}
          <h3 className={`${lexendMedium.className} text-white text-xl mb-2`}>
            {theater.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 mb-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <p className={`${lexendSmall.className} text-gray-400`}>
              {theater.city}, {theater.state}
              {theater.distance && ` • ${theater.distance}`}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(theater?.rating)}
            </div>
            <span className={`${lexendSmall.className} text-gray-300`}>
              {theater?.rating?.toFixed(1)} ({Math.floor(theater?.rating * 127)} reviews)
            </span>
          </div>

          {/* Facilities */}
          <div className="flex flex-wrap gap-2">
            {theater.facilities.slice(0, 6).map((facility, index) => (
              <span
                key={index}
                className={`${lexendSmall.className} bg-white/10 text-white px-2 py-1 rounded text-xs border border-gray-500/30`}
              >
                {facility}
              </span>
            ))}
            {theater.facilities.length > 6 && (
              <span className={`${lexendSmall.className} text-gray-400 text-xs px-2 py-1`}>
                +{theater.facilities.length - 6} more
              </span>
            )}
          </div>
        </div>

        <div className="lg:flex-shrink-0">
          <button
            onClick={() => onViewNowShowing(theater._id)}
            className={`${lexendMedium.className} flex items-center bg-white text-black px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105`}
          >
            <span>View Now Showing</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              const url = `https://www.google.com/maps?q=${theater.location.coordinates[1]},${theater.location.coordinates[0]}`;
              window.open(url, "_blank");
            }}
            className="mt-2 text-xs text-[#e78f03] hover:text-[#d67e02] underline"
          >
            View on Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterCard;
