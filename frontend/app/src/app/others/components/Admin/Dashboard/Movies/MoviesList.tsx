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


const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

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
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
  onFiltersChange: (filters: MovieFilters, resetPage?: boolean) => void;
  isLoading: boolean;
  currentFilters: MovieFilters;
  title: string;
  allMovies: Movie[];
  emptyMessage: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

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

  useEffect(() => {
    const delayedFilter = setTimeout(() => {
      onFiltersChange(localFilters, true);
    }, 500);

    return () => clearTimeout(delayedFilter);
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key: keyof MovieFilters, value: any) => {
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className={`${lexend.className} text-2xl font-bold text-white`}>
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          <div className="text-sm text-gray-400">
            Showing {movies.length} of {totalItems} results (Page{" "}
            {currentPage} of {totalPages})
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === "grid"
                  ? "bg-[#e78f03] text-black border-[#e78f03]"
                  : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === "list"
                  ? "bg-[#e78f03] text-black border-[#e78f03]"
                  : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
              }`}
            >
              <List size={16} />
            </button>
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

      {/* Results */}
      {movies.length === 0 ? (
        <MoviesEmptyState
          isLoading={isLoading}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default MoviesListComponent;
