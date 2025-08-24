"use client";

import React, { useState, useEffect, useCallback } from "react";
import TheaterListManager from "./TheaterListManager";
import { GetTheatersFilters, getTheatersWithFilters, Theater } from "@/app/others/services/userServices/theaterServices";
import { useDebounce } from "@/app/others/Utils/debounce";

type SortOption = "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";

const TheatersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearby");
  const [currentPage, setCurrentPage] = useState(1);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Add search-specific loading
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<any>();
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState({}); // Track current filters

  const itemsPerPage = 6;

  const loadTheaters = useCallback(async (
    search: string = searchTerm,
    sort: SortOption = sortBy,
    page: number = currentPage,
    facilities: string[] = selectedFacilities 
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      let locationData = userLocation;
      if (!locationData) {
        try {
          locationData = JSON.parse(localStorage.getItem('userLocation') || 'null');
        } catch {
          locationData = null;
        }
      }

      const filters: GetTheatersFilters = {
        search,
        sortBy: sort,
        page,
        limit: itemsPerPage,
        facilities, 
        ...(locationData ? { latitude: locationData.latitude, longitude: locationData.longitude } : {}),
      };

      const data = await getTheatersWithFilters(filters);
      setTheaters(data.theaters);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError("Failed to load theaters.");
      setTheaters([]);
    } finally {
      setIsLoading(false);
      setSearchLoading(false); // Clear search loading when fetch completes
    }
  }, [currentPage, userLocation]);

  // Debounced search with current filters
  const debouncedSearch = useDebounce((searchValue: string) => {
    const newFilters = { ...currentFilters, search: searchValue };
    loadTheaters(searchValue, sortBy, 1, selectedFacilities);
  }, 550);

  // Handle search input change with loading indicator
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setSearchLoading(true); // Show loading immediately when user types
    debouncedSearch(newSearchTerm);
  }, [debouncedSearch]);

  // Handle non-search changes (immediate update)
  const handleFiltersChange = useCallback((sort: SortOption, facilities: string[]) => {
    setSortBy(sort);
    setSelectedFacilities(facilities);
    setCurrentFilters({ sortBy: sort, facilities });
    loadTheaters(searchTerm, sort, 1, facilities);
    setCurrentPage(1);
  }, [searchTerm, loadTheaters]);

  const handleSortChange = (newSortBy: SortOption) => {
    handleFiltersChange(newSortBy, selectedFacilities);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleFacilityChange = (facilities: string[]) => {
    handleFiltersChange(sortBy, facilities);
  };

  // Initial load and page changes
  useEffect(() => {
    loadTheaters(searchTerm, sortBy, currentPage, selectedFacilities);
  }, [currentPage]);

  return (
    <TheaterListManager
      theaters={theaters}
      isLoading={isLoading || searchLoading} // Combine both loading states
      searchLoading={searchLoading} // Pass search-specific loading
      searchTerm={searchTerm}
      sortBy={sortBy}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      error={error}
      selectedFacilities={selectedFacilities} 
      onSearchChange={handleSearchChange} // Use the new search handler
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      onFacilityChange={handleFacilityChange} 
    />
  );
};

export default TheatersPage;
