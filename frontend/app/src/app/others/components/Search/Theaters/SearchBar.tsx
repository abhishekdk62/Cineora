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
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
}) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={`${lexendSmall.className} w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-300`}
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-white text-gray-400 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
