"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { Search, User, Filter, SortAsc } from "lucide-react";
import { User as UserType, UserFilters } from "./UserManager";
import UserCard from "./UserCard";
import Pagination from "../Movies/tmdb/Pagination";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface ActiveUsersProps {
  users: UserType[];
  isLoading: boolean;
  currentFilters: UserFilters;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: UserFilters, resetPage?: boolean) => void;
  onSearchChange: (searchTerm: string) => void;
  onViewDetails: (user: UserType) => void;
  onToggleStatus: (user: UserType) => void;
  searchLoading: boolean;
}

const ActiveUsers: React.FC<ActiveUsersProps> = ({
  users,
  isLoading,
  currentFilters,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onFiltersChange,
  onSearchChange,
  onViewDetails,
  onToggleStatus,
  searchLoading
}) => {
  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder,
    }, true);
  };

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm p-6">
      <div className="space-y-6">
    
        {/* Search and Filters Card */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Search & Filters
            </h3>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={currentFilters.search || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={`${currentFilters.sortBy || "name"}-${currentFilters.sortOrder || "asc"}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  handleSortChange(sortBy, sortOrder as "asc" | "desc");
                }}
                className="appearance-none bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white pl-10 pr-8 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 min-w-[180px] cursor-pointer hover:bg-gray-700/50"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="lastLogin-desc">Recently Active</option>
                <option value="lastLogin-asc">Least Active</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <span className="text-yellow-400 font-medium text-sm">
                {totalItems}
              </span>
              <span className="text-gray-300 text-sm whitespace-nowrap">
                users found
              </span>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Users List
            </h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
                <p className="text-gray-300 text-sm">Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div 
                  key={user._id}
                  className="transition-all duration-200 hover:scale-[1.01]"
                >
                  <UserCard
                    user={user}
                    onViewDetails={onViewDetails}
                    onToggleStatus={onToggleStatus}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-8 text-center max-w-md mx-auto transition-all duration-200">
                  <div className="bg-yellow-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-yellow-400" />
                  </div>
                  <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                    No users found
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    No users match your current search criteria. Try adjusting your search terms or filters.
                  </p>
                  <button 
                    onClick={() => onSearchChange("")}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveUsers;
