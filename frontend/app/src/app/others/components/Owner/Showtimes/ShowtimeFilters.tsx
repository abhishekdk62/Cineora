"use client";
import React from "react";

interface ShowtimeFiltersProps {
  filter: string;
  sortBy: string;
  groupBy: string;
  timeFilter: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sortBy: string) => void;
  onGroupChange: (groupBy: string) => void;
  onTimeFilterChange: (timeFilter: string) => void;
}

const ShowtimeFilters: React.FC<ShowtimeFiltersProps> = ({
  filter,
  sortBy,
  groupBy,
  timeFilter,
  onFilterChange,
  onSortChange,
  onGroupChange,
  onTimeFilterChange
}) => {
  const selectClassName = "px-3 py-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="flex items-center gap-4">
    
      
      <select
        value={groupBy}
        onChange={(e) => onGroupChange(e.target.value)}
        className={selectClassName}
      >
        <option value="none">No Grouping</option>
        <option value="theater">Group by Theater</option>
        <option value="movie">Group by Movie</option>
        <option value="screen">Group by Screen</option>
      </select>
      
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className={selectClassName}
      >
        <option value="all">All Status</option>
        <option value="active">Active Only</option>
        <option value="inactive">Inactive Only</option>
      </select>
      
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className={selectClassName}
      >
        <option value="date">Sort by Date</option>
        <option value="time">Sort by Time</option>
      </select>
    </div>
  );
};

export default ShowtimeFilters;
