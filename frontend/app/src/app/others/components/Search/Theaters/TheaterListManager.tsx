"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import TheaterList from "./TheaterList";
import FilterSidebar from "./FiltersSideBar";
import { useRouter } from "next/navigation";
import LocationDropdown, { LocationOption } from "./CitiesDropdown";
import { Navigation } from "lucide-react";
import { updateLocation } from "@/app/others/services/userServices/userServices";
import toast from "react-hot-toast";

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
  loadTheaters(search: string,
    sort: SortOption,
    page: number,
    facilities: string[],
    reset: boolean
  ): void;
  theaters: Theater[];
  isLoading: boolean;
  searchLoading?: boolean;
  scrollLoading?: boolean;
  searchTerm: string;
  sortBy: SortOption;
  totalCount: number;
  error: string | null;
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  selectedFacilities: string[];
  onFacilityChange: (facilities: string[]) => void;
  hasMore: boolean;
  handleClickReview:(theaterId:string)=>void
}

const TheaterListManager: React.FC<TheaterListManagerProps> = ({
  loadTheaters,
  theaters,
  isLoading,
  searchLoading = false,
  scrollLoading = false,
  searchTerm,
  sortBy,
  totalCount,
  error,
  onSearchChange,
  onSortChange,
  selectedFacilities = [],
  onFacilityChange,
  hasMore,
  handleClickReview
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleViewNowShowing = (theaterId: string) => {
  };
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>({
    value: 'current',
    icon: Navigation,
    label: "Current Location",

  })
  const onLocationChange = (location: LocationOption) => {
    setSelectedLocation({ value: location.value, icon: location.icon, label: location.label })
    updateLocationFunc(location)
  }

  const updateLocationFunc = async (location: LocationOption) => {
    if (location.value !== 'current' && location.coordinates) {
      try {

        const locationData = {
          latitude: location.coordinates[1],
          longitude: location.coordinates[0],
        };

        localStorage.setItem('userLocation', JSON.stringify(locationData))


        loadTheaters(searchTerm, sortBy, 1, selectedFacilities, true)
        toast.success('Location switched')
      } catch (error) {
        console.log(error);
      }
    }
     else if(location.value=='current') {
      if (!navigator.geolocation) {
        toast.error("Sorry Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          localStorage.setItem('userLocation', JSON.stringify(locationData));
          loadTheaters(searchTerm, sortBy, 1, selectedFacilities, true)

        })
    }
  }
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 flex  items-center justify-between">
          <div>
            <h1 className={`${lexendMedium.className} text-3xl text-white mb-2`}>
              Theaters
            </h1>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Find theaters near you and book your favorite movies
            </p>
          </div>
          <LocationDropdown selectedLocation={selectedLocation} onLocationChange={onLocationChange} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              searchLoading={searchLoading}
              placeholder="Search theaters by name or location..."
            />

            <motion.button
              onClick={() => setIsSidebarOpen(true)}
              className={`${lexendMedium.className} relative flex items-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 ${selectedFacilities.length > 0 ? 'bg-blue-600/20 border-blue-500/50' : ''
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isSidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
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

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className={`${lexendSmall.className} text-red-300`}>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <p className={`${lexendSmall.className} text-gray-400`}>
            {isLoading && theaters.length === 0 ? 'Loading...' : `${totalCount} theater${totalCount !== 1 ? 's' : ''} found`}
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
          handleClickReview={handleClickReview}
        />

        {/* Infinite Scroll Loading Indicators */}
        {scrollLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className={`${lexendSmall.className} ml-3 text-gray-400`}>
              Loading more theaters...
            </span>
          </div>
        )}

        {!hasMore && theaters.length > 0 && (
          <div className="text-center py-8">
            <p className={`${lexendSmall.className} text-gray-400`}>
              No more theaters to load
            </p>
          </div>
        )}

        {hasMore && theaters.length > 0 && !isLoading && !scrollLoading && (
          <div
            id="load-more-trigger"
            className="h-10 flex items-center justify-center opacity-0"
          >
            Loading trigger
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
