"use client";
import React from "react";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Lexend } from "next/font/google";
import { TMDBGenre } from "../../AdminContext";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  genres: TMDBGenre[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  genres,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search movies on TMDB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${lexendSmall.className} w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-48 pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white appearance-none focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          >
            <option value="all">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id.toString()}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-40 px-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white appearance-none focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
        >
          <option value="popularity">Popularity</option>
          <option value="title">Title</option>
          <option value="release_date">Release Date</option>
          <option value="vote_average">Rating</option>
        </select>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded border transition-colors ${
              viewMode === "grid"
                ? "bg-[#e78f03] text-black border-[#e78f03]"
                : "border-gray-500 text-gray-300 hover:border-[#e78f03] hover:text-white"
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded border transition-colors ${
              viewMode === "list"
                ? "bg-[#e78f03] text-black border-[#e78f03]"
                : "border-gray-500 text-gray-300 hover:border-[#e78f03] hover:text-white"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
