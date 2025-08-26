"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TheaterList from "./TheaterList";
import Pagination from "@/app/others/components/utils/Pagination";
import FilterSidebar from "./FiltersSideBar";
import { useRouter } from "next/navigation";

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
  location: {
    coordinates: [number, number]
  }
  facilities: string[];
  distance?: string;
}

type SortOption = "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";

interface TheaterListManagerProps {
  theaters: Theater[];
  isLoading: boolean;
  searchLoading?: boolean; // Add search loading prop
  searchTerm: string;
  sortBy: SortOption;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  error: string | null;
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onPageChange: (page: number) => void;
  selectedFacilities: string[];
  onFacilityChange: (facilities: string[]) => void;
}


const TheaterListManager: React.FC<TheaterListManagerProps> = ({
  theaters,
  isLoading,
  searchLoading = false, // Default to false
  searchTerm,
  sortBy,
  currentPage,
  totalPages,
  totalCount,
  error,
  onSearchChange,
  onSortChange,
  onPageChange,
  selectedFacilities = [],
  onFacilityChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter()
  const handleViewNowShowing = (theaterId: string) => {

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              searchLoading={searchLoading} // Pass search loading state
              placeholder="Search theaters by name or location..."
            />

            {/* Filter button stays the same */}
            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              className={`${lexendMedium.className} relative flex items-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 ${selectedFacilities.length > 0 ? 'bg-blue-600/20 border-blue-500/50' : ''
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Filter button content stays the same */}
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </motion.svg>
              <span className="hidden sm:inline">Filters</span>

              {selectedFacilities.length > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  key={selectedFacilities.length}
                >
                  <motion.span
                    key={selectedFacilities.length}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedFacilities.length}
                  </motion.span>
                </motion.span>
              )}
            </motion.button>
          </div>

          <div className="flex justify-end">
            <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
          </div>
        </div>

        {/* Rest of component stays the same */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className={`${lexendSmall.className} text-red-300`}>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {isLoading ? 'Loading...' : `${totalCount} theater${totalCount !== 1 ? 's' : ''} found`}
            {selectedFacilities.length > 0 && (
              <motion.span
                className="ml-2 text-blue-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                • {selectedFacilities.length} filter{selectedFacilities.length !== 1 ? 's' : ''} applied
              </motion.span>
            )}
          </p>
        </div>

        <TheaterList
          theaters={theaters}
          isLoading={isLoading}
          onViewNowShowing={handleViewNowShowing}
        />

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

      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedFacilities={selectedFacilities}
        onFacilityChange={onFacilityChange}
      />
    </div>
  );
};


export default TheaterListManager;
