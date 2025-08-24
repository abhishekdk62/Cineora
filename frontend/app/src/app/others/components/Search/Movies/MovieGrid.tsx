"use client";

import React from "react";
import { Lexend } from "next/font/google";
import MovieCard from "./MovieCard";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  poster: string;
  director: string;
  language: string;
}

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  languageMap: { [key: string]: string };
  formatDuration: (minutes: number) => string;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading,
  sortOrder,
  setSortOrder,
  languageMap,
  formatDuration,
  hasActiveFilters,
  clearAllFilters,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between">
        <p className={`${lexendSmall.className} text-gray-400`}>
          {loading ? "Loading..." : `Showing ${movies.length} movies`}
        </p>
        
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className={`${lexendSmall.className} lg:hidden flex items-center gap-2 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white hover:bg-white/20 transition-all duration-300`}
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className={`${lexendMedium.className} text-white`}>Loading movies...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              languageMap={languageMap}
              formatDuration={formatDuration}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
            <h3 className={`${lexendMedium.className} text-white text-xl mb-4`}>No movies found</h3>
            <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
              Try adjusting your search criteria or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className={`${lexendMedium.className} bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 py-2 px-6 rounded-lg transition-all duration-300 border border-blue-500/30`}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
