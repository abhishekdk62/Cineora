"use client";
import React, { useState, useEffect } from "react";
import MoviesPage from "../../others/components/Search/MoviesPage";
import { Footer, NavBar } from "../../others/components/Home";
import Orb from "../../others/Utils/ReactBits/Orb";


import Pagination from "../../others/Utils/Pagination";
import { getMoviesWithFilters } from "@/app/others/services/userServices/movieServices";

const Page = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMovies = async (filters: any) => {
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
    }
  };

  useEffect(() => {
    fetchMovies({});
  }, [currentPage]);

  return (
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
        <NavBar scrollToSection={() => {}} />
        <MoviesPage 
          movies={movies}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onFiltersChange={fetchMovies}
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
  );
};

export default Page;
