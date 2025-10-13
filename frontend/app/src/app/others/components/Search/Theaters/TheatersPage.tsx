
"use client";

import React, { useState, useEffect, useCallback } from "react";
import TheaterListManager from "./TheaterListManager";
import { GetTheatersFilters, getTheatersWithFilters, Theater } from "@/app/others/services/userServices/theaterServices";
import { useDebounce } from "@/app/others/Utils/debounce";
import { getTheaterRatingApi, getTheaterReviewStats } from "@/app/others/services/commonServices/ratingServices";
import TheaterReviewModal from "./TheaterReviewModal";

type SortOption = "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";

const TheatersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("nearby");
  const [currentPage, setCurrentPage] = useState(1);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: string, longitude: string }>();
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState({});
  const [selectedTheaterForReview, setSelectedTheaterForReview] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [theaterReviewsData, setTheaterReviewsData] = useState(null);
  const [theaterRatingStats, setTheaterRatingStats] = useState(null);

  function handleClickReview(theaterId: string) {
    setShowReviewModal(true)
    setSelectedTheaterForReview(theaterId)
    getTheaterReviewStatsFunc(theaterId)
    getTheaterRevies(theaterId)
  }

  const itemsPerPage = 2;


  const getTheaterReviewStatsFunc = async (theaterId: string) => {
    try {
      const data = await getTheaterReviewStats(theaterId)
      console.log('stats');
      setTheaterRatingStats(data.data);

      console.log(data);

    } catch (error) {
      console.log(error);


    }

  }
  const getTheaterRevies = async (theaterId: string) => {
    try {
      const data = await getTheaterRatingApi(theaterId)
      setTheaterReviewsData(data.data);

      console.log(data);

    } catch (error) {
      console.log(error);


    }

  }

  useEffect(() => {
    let isScrolling = false;

    function handleScroll() {
      if (isScrolling) return;

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
        hasMore &&
        !isLoading &&
        !scrollLoading
      ) {
        isScrolling = true;

        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        loadMoreTheaters(nextPage);

        setTimeout(() => {
          isScrolling = false;
        }, 1000);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, scrollLoading, currentPage]);

  const loadTheaters = useCallback(async (
    search: string = searchTerm,
    sort: SortOption = sortBy,
    page: number = currentPage,
    facilities: string[] = selectedFacilities,
    reset: boolean = true
  ) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setScrollLoading(true);
      }
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
      console.log('Theater response:', data);

      if (reset || page === 1) {
        setTheaters(data.data);
      } else {
        setTheaters(prev => {
          const existingIds = prev.map(item => item._id);
          const filteredNew = data.data.filter((theater: Theater) => !existingIds.includes(theater._id));
          return [...prev, ...filteredNew];
        });
      }

      setTotalCount(data.meta.pagination.total);
      setHasMore(data.meta.pagination.hasNextPage);

    } catch (err) {
      setError("Failed to load theaters.");
      if (reset) {
        setTheaters([]);
      }
    } finally {
      if (reset) {
        setIsLoading(false);
      } else {
        setScrollLoading(false);
      }
      setSearchLoading(false);
    }
  }, [currentPage, userLocation, theaters.length]);

  const loadMoreTheaters = useCallback(async (page: number) => {
    await loadTheaters(searchTerm, sortBy, page, selectedFacilities, false);
  }, [loadTheaters, searchTerm, sortBy, selectedFacilities]);

  const debouncedSearch = useDebounce((searchValue: string) => {
    resetAndSearch(searchValue, sortBy, selectedFacilities);
  }, 550);

  const resetAndSearch = useCallback((search: string, sort: SortOption, facilities: string[]) => {
    setCurrentPage(1);
    setHasMore(true);
    setTheaters([]);
    loadTheaters(search, sort, 1, facilities, true);
  }, [loadTheaters]);

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setSearchLoading(true);
    debouncedSearch(newSearchTerm);
  }, [debouncedSearch]);

  const handleFiltersChange = useCallback((sort: SortOption, facilities: string[]) => {
    setSortBy(sort);
    setSelectedFacilities(facilities);
    setCurrentFilters({ sortBy: sort, facilities });
    resetAndSearch(searchTerm, sort, facilities);
  }, [searchTerm, resetAndSearch]);

  const handleSortChange = (newSortBy: SortOption) => {
    handleFiltersChange(newSortBy, selectedFacilities);
  };

  const handleFacilityChange = (facilities: string[]) => {
    handleFiltersChange(sortBy, facilities);
  };

  useEffect(() => {
    loadTheaters(searchTerm, sortBy, 1, selectedFacilities, true);
  }, []);

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedTheaterForReview('');
    setTheaterReviewsData(null);
    setTheaterRatingStats(null);
  };


  return (
    <>
      <TheaterListManager
        loadTheaters={loadTheaters}
        theaters={theaters}
        isLoading={isLoading || searchLoading}
        searchLoading={searchLoading}
        scrollLoading={scrollLoading}
        searchTerm={searchTerm}
        sortBy={sortBy}
        totalCount={totalCount}
        error={error}
        selectedFacilities={selectedFacilities}
        hasMore={hasMore}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onFacilityChange={handleFacilityChange}
        handleClickReview={handleClickReview}
      />

      <TheaterReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        theaterId={selectedTheaterForReview}
        reviewsData={theaterReviewsData}
        ratingStats={theaterRatingStats}
        theaterName={theaters.find(t => t._id === selectedTheaterForReview)?.name || 'Theater'}
      />
    </>

  );
};

export default TheatersPage;
