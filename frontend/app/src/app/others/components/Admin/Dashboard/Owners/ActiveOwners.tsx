"use client"

import React from "react"
import { Lexend } from "next/font/google"
import { Search, Eye, Ban, User, ChevronLeft, ChevronRight } from "lucide-react"

import OwnerCard from "./OwnerCard"
import { Owner, OwnerFilters } from "./OwnerManager"

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
})

interface ActiveOwnersProps {
  owners: Owner[]
  isLoading: boolean
  currentFilters: OwnerFilters
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  onFiltersChange: (filters: OwnerFilters, resetPage?: boolean) => void
  onViewDetails: (owner: Owner) => void
  onToggleStatus: (owner: Owner) => void
}

const ActiveOwners: React.FC<ActiveOwnersProps> = ({
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
}) => {
  const handleSearch = (searchTerm: string) => {
    onFiltersChange({
      ...currentFilters,
      search: searchTerm,
    })
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder,
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search active owners..."
              value={currentFilters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
            />
          </div>
          
          <select
            value={`${currentFilters.sortBy || 'ownerName'}-${currentFilters.sortOrder || 'asc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-")
              handleSortChange(sortBy, sortOrder as "asc" | "desc")
            }}
            className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
          >
            <option value="ownerName-asc">Name (A-Z)</option>
            <option value="ownerName-desc">Name (Z-A)</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="approvedAt-desc">Recently Approved</option>
            <option value="approvedAt-asc">Oldest Approved</option>
            <option value="lastLogin-desc">Recently Active</option>
          </select>
          
          <div className="text-sm text-gray-400">
            {totalItems} active owners
          </div>
        </div>
      </div>

      {/* Owners List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
          </div>
        ) : owners.length > 0 ? (
          owners.map(owner => (
            <OwnerCard
              key={owner._id}
              owner={owner}
              actions={[
          
                {
                  label: "Block Owner",
                  icon: Ban,
                  onClick: onToggleStatus,
                  className: "bg-red-500 hover:bg-red-600",
                },
              ]}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-8 text-center">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className={`${lexend.className} text-xl text-white mb-2`}>No active owners found</h3>
              <p className="text-gray-400">No owners match your current search criteria.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages} ({totalItems} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a]"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                let page = index + 1
                if (totalPages > 5) {
                  const start = Math.max(1, currentPage - 2)
                  page = start + index
                  if (page > totalPages) return null
                }
                
                const isActive = page === currentPage
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      isActive
                        ? "bg-[#e78f03] text-black"
                        : "bg-[#2a2a2a] border border-gray-500 text-white hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActiveOwners
