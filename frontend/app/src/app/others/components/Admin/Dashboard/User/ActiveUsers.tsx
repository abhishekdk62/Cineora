"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { Search, User } from "lucide-react";
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
}) => {
  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder,
    }, true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={currentFilters.search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
            />
          </div>

          <select
            value={`${currentFilters.sortBy || "name"}-${currentFilters.sortOrder || "asc"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-");
              handleSortChange(sortBy, sortOrder as "asc" | "desc");
            }}
            className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03] min-w-[150px]"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="lastLogin-desc">Recently Active</option>
            <option value="lastLogin-asc">Least Active</option>
          </select>
          
          <div className="text-sm text-gray-400 whitespace-nowrap">
            {totalItems} users
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onViewDetails={onViewDetails}
              onToggleStatus={onToggleStatus}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-8 text-center max-w-md mx-auto">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                No users found
              </h3>
              <p className="text-gray-400">
                No users match your current search criteria.
              </p>
            </div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ActiveUsers;
