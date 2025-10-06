"use client";
import React from "react";
import { Search, Filter, Building } from 'lucide-react';

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
}

interface StaffFiltersProps {
  filter: string;
  sortBy: string;
  groupBy: string;
  timeFilter: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: 'all' | 'active' | 'inactive';
  setActiveFilter: (filter: 'all' | 'active' | 'inactive') => void;
  selectedTheater: string;
  setSelectedTheater: (theaterId: string) => void;
  theaters: Theater[];
  totalCount: number;
  onFilterChange: (filter: string) => void;
  onSortChange: (sortBy: string) => void;
  onGroupChange: (groupBy: string) => void;
  onTimeFilterChange: (timeFilter: string) => void;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({
  filter,
  sortBy,
  groupBy,
  timeFilter,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  selectedTheater,
  setSelectedTheater,
  theaters,
  totalCount,
  onFilterChange,
  onSortChange,
  onGroupChange,
  onTimeFilterChange
}) => {
  const selectClassName = "px-3 py-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search staff by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Theater Filter */}
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <select
            value={selectedTheater}
            onChange={(e) => setSelectedTheater(e.target.value)}
            className={selectClassName}
          >
            <option value="all">All Theaters</option>
            {theaters.map((theater) => (
              <option key={theater._id} value={theater._id}>
                {theater.name}
              </option>
            ))}
          </select>
        </div>

        {/* Group By */}
        <select
          value={groupBy}
          onChange={(e) => onGroupChange(e.target.value)}
          className={selectClassName}
        >
          <option value="none">No Grouping</option>
          <option value="theater">Group by Theater</option>
          <option value="status">Group by Status</option>
        </select>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className={selectClassName}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Sort By */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={selectClassName}
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>

        {/* Results Count */}
        <div className="text-gray-400 text-sm ml-auto">
          {totalCount} {totalCount === 1 ? 'member' : 'members'} found
        </div>
      </div>
    </div>
  );
};

export default StaffFilters;
