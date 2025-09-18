import React, { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { Grid3X3, List, Loader2 } from "lucide-react";
import { MovieFilters } from "./MoviesManager";
import Pagination from "./tmdb/Pagination";
import MoviesSearchFilter from "./MoviesSearchFilter";
import MoviesEmptyState from "./MoviesEmptyState";
import MoviesGrid from "./MoviesGrid";
import MoviesStatsCards from "./MoviesStatsCards";
import MoviesListView from "./MoviesListView";
import { MovieResponseDto } from "@/app/others/dtos";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

// Font variables for styling
const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

export interface Movie {
  _id: string;
  tmdbId: string; 
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
}

interface MoviesListProps {
  movies: MovieResponseDto[];
  onEdit: (movie: MovieResponseDto) => void;
  onDelete: (movie: MovieResponseDto) => void;
  onToggleStatus: (movie: MovieResponseDto) => void;
  onFiltersChange: (filters: MovieFilters, resetPage?: boolean) => void;
  isLoading: boolean;
  currentFilters: MovieFilters;
  title: string;
  allMovies: MovieResponseDto[];
  emptyMessage: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
export type MovieFilterValue = 
  | string 
  | number 
  | boolean 
  | undefined
  | "asc" 
  | "desc"
  | null;


const MoviesListComponent: React.FC<MoviesListProps> = ({
  movies,
  onEdit,
  onDelete,
  onToggleStatus,
  onFiltersChange,
  isLoading,
  currentFilters,
  title,
  allMovies,
  emptyMessage,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localFilters, setLocalFilters] = useState<MovieFilters>(currentFilters);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true); 
    
    const delayedFilter = setTimeout(() => {
      onFiltersChange(localFilters, true);
      setIsFiltering(false);
    }, 500);

    return () => {
      clearTimeout(delayedFilter);
      setIsFiltering(false);
    };
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof MovieFilters, value: MovieFilterValue) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const clearAllFilters = () => {
    setLocalFilters({});
  };

  const activeFilterCount = Object.values(localFilters).filter(
    (value) => value !== undefined && value !== null && value !== ""
  ).length;

  return (
    <div className="space-y-6">
      <MoviesStatsCards
        allMovies={allMovies}
        totalItems={totalItems}
      />

      <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 
            className="text-2xl text-yellow-400"
            style={lexendMedium}
          >
            {title}
          </h2>
          <div className="flex items-center gap-4">
            {(isLoading || isFiltering) && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="animate-spin text-yellow-400" size={16} />
                <span className="text-sm" style={lexendSmallStyle}>
                  {isFiltering ? "Applying filters..." : "Loading..."}
                </span>
              </div>
            )}
            <div 
              className="text-sm text-gray-300" 
              style={lexendSmallStyle}
            >
              Showing {movies.length} of {totalItems} results (Page{" "}
              {currentPage} of {totalPages})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60"
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/60"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <MoviesSearchFilter
        localFilters={localFilters}
        allMovies={allMovies}
        onFilterChange={handleFilterChange}
        onClearAllFilters={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="relative">
        {isFiltering && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3 text-white bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg px-6 py-4">
              <Loader2 className="animate-spin text-yellow-400" size={20} />
              <span style={lexendMedium}>Loading...</span>
            </div>
          </div>
        )}
        
        {movies.length === 0 ? (
          <MoviesEmptyState
            isLoading={isLoading || isFiltering}
            activeFilterCount={activeFilterCount}
            emptyMessage={emptyMessage}
          />
        ) : (
          <>
            {viewMode === "grid" ? (
              <MoviesGrid
                movies={movies}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            ) : (
              <MoviesListView
                movies={movies}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            )}
          </>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default MoviesListComponent;
