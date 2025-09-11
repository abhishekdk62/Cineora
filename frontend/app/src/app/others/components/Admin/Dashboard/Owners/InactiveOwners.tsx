"use client";

import React from "react";
import { Lexend } from "next/font/google";
import {
  Search,
  Eye,
  UserPlus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { Owner, OwnerFilters } from "./OwnerManager";
import OwnerCard from "./OwnerCard";
import { useDebounce } from "@/app/others/Utils/debounce";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface InactiveOwnersProps {
  owners: Owner[];
  isLoading: boolean;
  currentFilters: OwnerFilters;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: OwnerFilters, resetPage?: boolean) => void;
  onViewDetails: (owner: Owner) => void;
  onToggleStatus: (owner: Owner) => void;
  setViewThaeter: (id: string) => void;
}

const InactiveOwners: React.FC<InactiveOwnersProps> = ({
  owners,
  isLoading,
  currentFilters,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onFiltersChange,
  onViewDetails,
  onToggleStatus,
  setViewThaeter,
}) => {
  const handleSearch = (searchTerm: string) => {
    onFiltersChange({
      ...currentFilters,
      search: searchTerm,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm p-6">
      <div className="space-y-6">
  

        {/* Alert Banner */}
        {totalItems > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-400" size={20} />
              <div>
                <h3 className="text-orange-400 font-medium">Inactive Owners Alert</h3>
                <p className="text-orange-300 text-sm">
                  {totalItems} owner{totalItems > 1 ? 's' : ''} currently blocked. Their theaters may be affected.
                </p>
              </div>
            </div>
          </div>
        )}

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
                placeholder="Search inactive owners by name, email..."
                value={currentFilters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={`${currentFilters.sortBy || "createdAt"}-${
                  currentFilters.sortOrder || "desc"
                }`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  handleSortChange(sortBy, sortOrder as "asc" | "desc");
                }}
                className="appearance-none bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white pl-10 pr-8 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 min-w-[200px] cursor-pointer hover:bg-gray-700/50"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="ownerName-asc">Name (A-Z)</option>
                <option value="ownerName-desc">Name (Z-A)</option>
                <option value="approvedAt-desc">Recently Approved</option>
                <option value="approvedAt-asc">Oldest Approved</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <span className="text-orange-400 font-medium text-sm">
                {totalItems}
              </span>
              <span className="text-gray-300 text-sm whitespace-nowrap">
                inactive owners
              </span>
            </div>
          </div>
        </div>

        {/* Inactive Owners List */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Inactive Owners List
            </h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
                <p className="text-gray-300 text-sm">Loading inactive owners...</p>
              </div>
            ) : owners.length > 0 ? (
              owners.map((owner) => (
                <div key={owner._id} className="relative transition-all duration-200 hover:scale-[1.01]">
                  {/* Inactive Status Banner */}
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-t-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-500/30 p-2 rounded-lg">
                          <Clock className="text-orange-400" size={16} />
                        </div>
                        <div>
                          <span className="text-orange-400 font-medium text-sm block">
                            Owner Account Blocked
                          </span>
                          <span className="text-orange-300/80 text-xs">
                            Account status changed to inactive
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-lg">
                          <span className="text-orange-300 text-xs">
                            Theaters: {owner.theatres.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Card */}
                  <div className="border-t-0 rounded-t-none">
                    <OwnerCard
                      setViewThaeter={setViewThaeter}
                      owner={owner}
                      actions={[
                        {
                          label: "Reactivate Owner",
                          icon: UserPlus,
                          onClick: onToggleStatus,
                          className: "bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium",
                        },
                      ]}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-8 text-center max-w-md mx-auto transition-all duration-200">
                  <div className="bg-green-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Clock size={32} className="text-green-400" />
                  </div>
                  <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                    All Owners Active
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Great! All owners are currently active. No blocked accounts found.
                  </p>
                  <button 
                    onClick={() => handleSearch("")}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-300">
                Page <span className="text-yellow-400 font-medium">{currentPage}</span> of{" "}
                <span className="text-yellow-400 font-medium">{totalPages}</span> ({totalItems} total)
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex gap-1">
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
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                            : "bg-gray-800/50 border border-yellow-500/30 text-white hover:bg-gray-700/50 hover:border-yellow-500/50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InactiveOwners;
