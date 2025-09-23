import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    ownerId?: string;
    theaterId?: string;
    movieId?: string;
  };
  onFiltersChange: (filters: string) => void;
  ownerOptions?: FilterOption[];
  theaterOptions?: FilterOption[];
  movieOptions?: FilterOption[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  ownerOptions = [],
  theaterOptions = [],
  movieOptions = []
}) => {
  if (!isOpen) return null;

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-yellow-400" />
            <h3 className="text-2xl text-yellow-400 font-medium">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Owner Filter */}
          {ownerOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Owner
              </label>
              <select
                value={filters.ownerId || ''}
                onChange={(e) => handleFilterChange('ownerId', e.target.value)}
                className="bg-gray-800/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none w-full transition-all duration-200"
              >
                <option value="">All Owners</option>
                {ownerOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Theater Filter */}
          {theaterOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Theater
              </label>
              <select
                value={filters.theaterId || ''}
                onChange={(e) => handleFilterChange('theaterId', e.target.value)}
                className="bg-gray-800/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none w-full transition-all duration-200"
              >
                <option value="">All Theaters</option>
                {theaterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Movie Filter */}
          {movieOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Movie
              </label>
              <select
                value={filters.movieId || ''}
                onChange={(e) => handleFilterChange('movieId', e.target.value)}
                className="bg-gray-800/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none w-full transition-all duration-200"
              >
                <option value="">All Movies</option>
                {movieOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-yellow-500/20">
          <button
            onClick={clearAllFilters}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
