"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

interface SearchHeaderProps {
  searchQuery: string;
  onSearchInput: (search: string) => void; 
  onClearSearch: () => void; 
  searchLoading?: boolean; 
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  hasActiveFilters: boolean;
  sortOptions: Array<{ value: string; label: string }>;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchInput,
  onClearSearch,
  searchLoading = false,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  sortOptions,
}) => {
  return (
    <div className="relative pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 border border-gray-500/30">
          <h1 className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-8 text-center`}>
            Now Showing
          </h1>

          <div className="max-w-4xl mx-auto">
            <div className="relative flex gap-3">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`${lexendMedium.className} relative flex items-center gap-2 px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 ${hasActiveFilters ? 'bg-blue-600/20 border-blue-500/50' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
                )}
              </button>

              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search movies, actors, directors..."
                  value={searchQuery}
                  onChange={(e) => onSearchInput(e.target.value)}
                  className={`${lexendMedium.className} w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 ${
                    searchLoading ? 'opacity-75' : ''
                  }`}
                />
                
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {searchLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  )}
                  
                  {searchQuery && !searchLoading && (
                    <button
                      onClick={onClearSearch}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Rest of the component stays the same */}
              <div className="hidden lg:flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${lexendSmall.className} px-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300`}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className={`${lexendSmall.className} flex items-center gap-1 px-3 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300`}
                >
                  <svg className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
