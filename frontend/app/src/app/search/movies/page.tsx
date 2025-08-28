"use client";
import React, { useState, useEffect, useCallback } from "react";
import MoviesPage from "../../others/components/Search/Movies/MoviesPage";
import { Footer, NavBar } from "../../others/components/Home";
import Orb from "../../others/components/ReactBits/Orb";
import Pagination from "../../others/components/utils/Pagination";
import { getMoviesWithFilters } from "@/app/others/services/userServices/movieServices";
import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { useDebounce } from "@/app/others/Utils/debounce";

const Page = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false); 
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({}); 

  const fetchMovies = useCallback(async (filters: any) => {
    setLoading(true);
    try {
      const response = await getMoviesWithFilters({
        ...filters,
        isActive: true,
        page: currentPage,
        limit: 10
      });
      
      setMovies(response.data || []);
      setTotalPages(response.meta?.pagination?.totalPages || 0);
      
      console.log('Movies set:', response.data?.length);
      console.log('Total pages from meta:', response.meta?.pagination?.totalPages);
      
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
      setSearchLoading(false); 
    }
  }, [currentPage]);

  const debouncedSearch = useDebounce((searchTerm: string) => {
    const newFilters = { ...currentFilters, search: searchTerm };
    fetchMovies(newFilters);
  }, 550);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchLoading(true); 
    debouncedSearch(searchTerm);
  }, [debouncedSearch]);

  const handleFiltersChange = useCallback((filters: any) => {
    setCurrentFilters(filters);
    fetchMovies(filters);
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies(currentFilters);
  }, [currentPage]);

  return (
    <RouteGuard excludedRoles={['owner','admin']}>
      <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>

        <div className="relative z-10">
          <NavBar />
          <MoviesPage 
            movies={movies}
            loading={loading || searchLoading} 
            searchLoading={searchLoading} 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onFiltersChange={handleFiltersChange}
            onSearchChange={handleSearchChange}
          />

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPages={5}
            className="mb-8"
          />
          <Footer />
        </div>
      </div>
    </RouteGuard>
  );
};

export default Page;
