"use client";

import React from "react";
import TheaterCard from "./TheaterCard";

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  facilities: string[];
  location:{
    coordinates:[number,number]
  }
  distance?: string;
}

interface TheaterListProps {
  theaters: Theater[];
  isLoading: boolean;
  onViewNowShowing: (theaterId: string) => void;
  handleClickReview:(theaterId:string)=>void
}

const TheaterList: React.FC<TheaterListProps> = ({
  theaters,
  isLoading,
  onViewNowShowing,
  handleClickReview
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 animate-pulse"
          >
            <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-white/10 rounded mb-4 w-1/4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-white/10 rounded w-16"></div>
              <div className="h-6 bg-white/10 rounded w-20"></div>
              <div className="h-6 bg-white/10 rounded w-14"></div>
            </div>
            <div className="h-10 bg-white/10 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No theaters found</div>
        <div className="text-gray-500 text-sm">
          Try adjusting your search criteria or location
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {theaters.map((theater) => (
        <TheaterCard
        handleClickReview={handleClickReview}
          key={theater._id}
          theater={theater}
          onViewNowShowing={onViewNowShowing}
        />
      ))}
    </div>
  );
};

export default TheaterList;
