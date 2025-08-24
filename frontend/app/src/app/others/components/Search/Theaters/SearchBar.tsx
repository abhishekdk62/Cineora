"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchLoading?: boolean; // Add search loading prop
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  searchLoading = false,
  placeholder = "Search...",
}) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="relative w-[350px] sm:w-[450px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={`${lexendSmall.className} w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 ${
          searchLoading ? 'opacity-75' : ''
        }`}
        // NO disabled prop here!
      />

      {/* Right side icons */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        {/* Search Loading Spinner */}
        {searchLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
        )}
        
        {/* Clear button */}
        {searchTerm && !searchLoading && (
          <button
            onClick={handleClear}
            className="hover:text-white text-gray-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
