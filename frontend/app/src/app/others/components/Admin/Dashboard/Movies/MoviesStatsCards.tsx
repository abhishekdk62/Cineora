import React from "react";
import { Eye, Play, Pause, Filter } from "lucide-react";
import { Movie } from "./MoviesList";

interface MoviesStatsCardsProps {
  allMovies: Movie[];
  totalItems: number;
}

const MoviesStatsCards: React.FC<MoviesStatsCardsProps> = ({
  allMovies,
  totalItems,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">Total Movies</p>
            <p className="text-2xl font-bold text-white">{allMovies.length}</p>
          </div>
          <Eye className="h-8 w-8 text-[#e78f03]" />
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">Active</p>
            <p className="text-2xl font-bold text-green-400">
              {allMovies.filter((m) => m.isActive).length}
            </p>
          </div>
          <Play className="h-8 w-8 text-green-400" />
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">Inactive</p>
            <p className="text-2xl font-bold text-red-400">
              {allMovies.filter((m) => !m.isActive).length}
            </p>
          </div>
          <Pause className="h-8 w-8 text-red-400" />
        </div>
      </div>
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm font-medium">Search Results</p>
            <p className="text-2xl font-bold text-white">{totalItems}</p>
          </div>
          <Filter className="h-8 w-8 text-[#e78f03]" />
        </div>
      </div>
    </div>
  );
};

export default MoviesStatsCards;
