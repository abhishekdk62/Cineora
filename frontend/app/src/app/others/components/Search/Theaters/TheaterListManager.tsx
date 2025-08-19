"use client";

import React from "react";
import { Lexend } from "next/font/google";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TheaterList from "./TheaterList";
import Pagination from "@/app/others/Utils/Pagination";

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
  rating: number;
  location:{
    coordinates:[number,number]
  }
  facilities: string[];
  distance?: string;
}

type SortOption = "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";

interface TheaterListManagerProps {
  theaters: Theater[];
  isLoading: boolean;
  searchTerm: string;
  sortBy: SortOption;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  error: string | null;
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onPageChange: (page: number) => void;
}

const TheaterListManager: React.FC<TheaterListManagerProps> = ({
  theaters,
  isLoading,
  searchTerm,
  sortBy,
  currentPage,
  totalPages,
  totalCount,
  error,
  onSearchChange,
  onSortChange,
  onPageChange,
}) => {
  const handleViewNowShowing = (theaterId: string) => {
    // Handle navigation to theater showtimes
    console.log("View now showing for theater:", theaterId);
    // router.push(`/theaters/${theaterId}/showtimes`);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${lexendMedium.className} text-3xl text-white mb-2`}>
           Theaters
          </h1>
          <p className={`${lexendSmall.className} text-gray-400`}>
            Find theaters near you and book your favorite movies
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              placeholder="Search theaters by name or location..."
            />
          </div>
          <div className="md:ml-6">
            <SortDropdown
              sortBy={sortBy}
              onSortChange={onSortChange}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className={`${lexendSmall.className} text-red-300`}>
              {error}
            </p>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {isLoading ? 'Loading...' : `${totalCount} theater${totalCount !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Theater List */}
        <TheaterList
          theaters={theaters}
          isLoading={isLoading}
          onViewNowShowing={handleViewNowShowing}
        />

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showPages={5}
              className="mb-8"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TheaterListManager;
