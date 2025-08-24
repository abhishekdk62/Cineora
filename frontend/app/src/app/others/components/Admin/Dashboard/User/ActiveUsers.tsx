"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { Search, Eye, Ban, User, ChevronLeft, ChevronRight, Shield, Mail, Phone } from "lucide-react";
import { User as UserType, UserFilters } from "./UserManager";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
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
  onSearchChange: (searchTerm: string) => void; // Added this
  onViewDetails: (user: UserType) => void;
  onToggleStatus: (user: UserType) => void;
}

const UserCard: React.FC<{
  user: UserType;
  onViewDetails: (user: UserType) => void;
  onToggleStatus: (user: UserType) => void;
}> = ({ user, onViewDetails, onToggleStatus }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLastLoginText = (lastLogin?: string) => {
    if (!lastLogin || lastLogin === '0') return "Never logged in";
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Profile Picture */}
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border-2 border-gray-600 flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
            )}
            {user.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Shield size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`${lexend.className} text-lg font-medium text-white`}>
                {user.name}
              </h3>
              <div className="flex gap-1">
                {user.emailVerified && (
                  <Mail size={14} className="text-green-400" />
                )}
                {user.phoneVerified && (
                  <Phone size={14} className="text-green-400" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">
                <span className="text-gray-500">Email:</span> {user.email}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Phone:</span> {user.phone}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Joined:</span> {formatDate(user.joinedAt)}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Last Login:</span> {getLastLoginText(user.lastActive)}
              </div>
              {user.gender && (
                <div className="text-gray-300">
                  <span className="text-gray-500">Gender:</span> {user.gender}
                </div>
              )}
              {user.dateOfBirth && (
                <div className="text-gray-300">
                  <span className="text-gray-500">DOB:</span> {formatDate(user.dateOfBirth)}
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-900/50 text-green-400 border border-green-500/30"
                    : "bg-red-900/50 text-red-400 border border-red-500/30"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isVerified
                    ? "bg-blue-900/50 text-blue-400 border border-blue-500/30"
                    : "bg-gray-900/50 text-gray-400 border border-gray-500/30"
                }`}
              >
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
              {user.bookingHistory && user.bookingHistory.length > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  {user.bookingHistory.length} Bookings
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => onViewDetails(user)}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => onToggleStatus(user)}
            className={`px-3 py-2 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1 ${
              user.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Ban size={14} />
            {user.isActive ? "Block" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ActiveUsers: React.FC<ActiveUsersProps> = ({
  users,
  isLoading,
  currentFilters,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onFiltersChange,
  onSearchChange, // Added this
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
              value={currentFilters.search || ""} // This will now update properly
              onChange={(e) => onSearchChange(e.target.value)} // Use the new handler
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
            />
          </div>

          <select
            value={`${currentFilters.sortBy || "name"}-${
              currentFilters.sortOrder || "asc"
            }`}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages} ({totalItems} total)
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                let page = index + 1;
                if (totalPages > 5) {
                  const start = Math.max(1, currentPage - 2);
                  page = start + index;
                  if (page > totalPages) return null;
                }

                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#e78f03] text-black"
                        : "bg-[#2a2a2a] border border-gray-500 text-white hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveUsers;
