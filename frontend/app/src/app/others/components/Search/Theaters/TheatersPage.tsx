"use client";

import React, { useState, useEffect, useCallback } from "react";
import TheaterListManager from "./TheaterListManager";
import { GetTheatersFilters, getTheatersWithFilters, Theater } from "@/app/others/services/userServices/theaterServices";
import { useSelector } from "react-redux";
import { RootState } from "@/app/others/redux/store";


type SortOption = "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";


function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

const TheatersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearby");
  const [currentPage, setCurrentPage] = useState(1);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [error, setError] = useState<string | null>(null);
const[userLocation,setUserLocation]=useState<any>()
  const itemsPerPage = 6;


  const loadTheaters = async (
    search: string = searchTerm,
    sort: SortOption = sortBy,
    page: number = currentPage
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
    }
  };

  const debouncedFetch = useCallback(
    debounce((search: string, sort: SortOption, page: number) => {
      loadTheaters(search, sort, page);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchTerm.trim() === "") {
      loadTheaters(searchTerm, sortBy, 1);
      setCurrentPage(1);
    } else {
      debouncedFetch(searchTerm, sortBy, 1);
      setCurrentPage(1);
    }
  }, [searchTerm, sortBy]);

  useEffect(() => {
    if (currentPage > 1) {
      loadTheaters(searchTerm, sortBy, currentPage);
    }
  }, [currentPage]);

  const handleSearchChange = (newSearchTerm: string) => setSearchTerm(newSearchTerm);
  const handleSortChange = (newSortBy: SortOption) => setSortBy(newSortBy);
  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  return (
    <TheaterListManager
      theaters={theaters}
      isLoading={isLoading}
      searchTerm={searchTerm}
      sortBy={sortBy}
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      error={error}
      onSearchChange={handleSearchChange}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
    />
  );
};

export default TheatersPage;
