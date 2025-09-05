"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { Search, Eye, CheckCircle, XCircle, UserCheck, ChevronLeft, ChevronRight } from "lucide-react"
import OwnerRequestCard from "./OwnerRequestCard"
import toast from "react-hot-toast"
import { OwnerRequest, OwnerRequestFilters } from "./OwnerManager"
import { useDebounce } from "@/app/others/Utils/debounce"

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
})

interface OwnerRequestsProps {
  requests: OwnerRequest[]
  isLoading: boolean
  currentFilters: OwnerRequestFilters
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  onFiltersChange: (filters: OwnerRequestFilters, resetPage?: boolean) => void
  onViewDetails: (request: OwnerRequest) => void
  onAcceptRequest: (request: OwnerRequest) => void
  onRejectRequest: (request: OwnerRequest, rejectionReason: string) => void
}

const OwnerRequests: React.FC<OwnerRequestsProps> = ({
  requests,
  isLoading,
  currentFilters,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  onFiltersChange,
  onViewDetails,
  onAcceptRequest,
  onRejectRequest,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [pendingRejectRequest, setPendingRejectRequest] = useState<OwnerRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

const debouncedSearch = useDebounce((searchTerm: string) => {
  onFiltersChange({
    ...currentFilters,
    search: searchTerm,
  });
}, 500);

const handleSearch = (searchTerm: string) => {
  debouncedSearch(searchTerm);
};


  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...currentFilters,
      sortBy,
      sortOrder,
    })
  }

  const openRejectModal = (request: OwnerRequest) => {
    setPendingRejectRequest(request)
    setRejectionReason("")
    setShowRejectModal(true)
  }

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.")
      return
    }
    if (pendingRejectRequest) {
      onRejectRequest(pendingRejectRequest, rejectionReason.trim())
      setShowRejectModal(false)
      setPendingRejectRequest(null)
      setRejectionReason("")
    }
  }

  const closeRejectModal = () => {
    setShowRejectModal(false)
    setPendingRejectRequest(null)
    setRejectionReason("")
  }

  const renderRejectModal = () => {
    if (!showRejectModal || !pendingRejectRequest) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-red-400">Reject Owner Request</h2>
          
          <div className="mb-4 text-sm text-gray-300">
            Are you sure you want to reject <span className="font-semibold text-white">{pendingRejectRequest.ownerName}</span>'s request?
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rejection Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] resize-none"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              rows={4}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={closeRejectModal}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold transition-colors"
            >
              Reject Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={currentFilters.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
            />
          </div>
          
          <select
            value={`${currentFilters.sortBy || 'submittedAt'}-${currentFilters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("-")
              handleSortChange(sortBy, sortOrder as "asc" | "desc")
            }}
            className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
          >
            <option value="submittedAt-desc">Newest First</option>
            <option value="submittedAt-asc">Oldest First</option>
            <option value="ownerName-asc">Name (A-Z)</option>
            <option value="ownerName-desc">Name (Z-A)</option>
            <option value="reviewedAt-desc">Recently Reviewed</option>
          </select>
          
          <div className="text-sm text-gray-400">
            {totalItems} pending requests
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map(request => (
            <OwnerRequestCard
              key={request._id}
              request={request}
              actions={[
                {
                  label: "View Details",
                  icon: Eye,
                  onClick: onViewDetails,
                  className: "bg-blue-500 hover:bg-blue-600",
                },
                {
                  label: "Accept",
                  icon: CheckCircle,
                  onClick: onAcceptRequest,
                  className: "bg-green-500 hover:bg-green-600",
                },
                {
                  label: "Reject",
                  icon: XCircle,
                  onClick: openRejectModal, 
                  className: "bg-red-500 hover:bg-red-600",
                },
              ]}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-8 text-center">
              <UserCheck size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className={`${lexend.className} text-xl text-white mb-2`}>No pending requests</h3>
              <p className="text-gray-400">All owner requests have been processed.</p>
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

      {renderRejectModal()}
    </div>
  )
}

export default OwnerRequests
