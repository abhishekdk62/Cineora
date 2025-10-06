import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Lexend } from 'next/font/google';

const lexend = Lexend({ subsets: ['latin'] });

interface StaffFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: 'all' | 'active' | 'inactive';
  setActiveFilter: (filter: 'all' | 'active' | 'inactive') => void;
  totalCount: number;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  totalCount
}) => {
  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:bg-gray-700/70 transition-all"
              style={{ fontFamily: lexend.style.fontFamily }}
            />
          </div>
        </div>

        {/* Status Filter & Results Count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
              Status:
            </span>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500/50"
              style={{ fontFamily: lexend.style.fontFamily }}
            >
              <option value="all">All Staff</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            {totalCount} {totalCount === 1 ? 'member' : 'members'} found
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffFilters;
