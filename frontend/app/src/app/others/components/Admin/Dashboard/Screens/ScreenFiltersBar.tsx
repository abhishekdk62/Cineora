import React from "react";
import { Search } from "lucide-react";

interface ScreenFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ScreenFiltersBarProps {
  filters: ScreenFilters;
  totalItems: number;
  onChange: (filters: ScreenFilters) => void;
}

const ScreenFiltersBar: React.FC<ScreenFiltersBarProps> = ({ filters, totalItems, onChange }) => (
  <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
    <div className="flex flex-col sm:flex-row items-center gap-4">
      
      {/* Search */}
      <div className="relative flex-1 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search screens by name..."
          value={filters.search || ""}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
        />
      </div>

      {/* Status Filter */}
      <select
        value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
        onChange={e => {
          const value = e.target.value === "all" ? undefined : e.target.value === "true";
          onChange({ ...filters, isActive: value });
        }}
        className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
      >
        <option value="all">All Status</option>
        <option value="true">Active</option>
        <option value="false">Disabled</option>
      </select>

      {/* Sort */}
      <select
        value={`${filters.sortBy || "name"}-${filters.sortOrder || "asc"}`}
        onChange={e => {
          const [sortBy, sortOrder] = e.target.value.split("-");
          onChange({ ...filters, sortBy, sortOrder: sortOrder as "asc" | "desc" });
        }}
        className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03] min-w-[150px]"
      >
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="totalSeats-desc">Most Seats</option>
        <option value="totalSeats-asc">Least Seats</option>
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
      </select>

      <div className="text-sm text-gray-400 whitespace-nowrap">{totalItems} screens</div>
    </div>
  </div>
);

export default ScreenFiltersBar;
