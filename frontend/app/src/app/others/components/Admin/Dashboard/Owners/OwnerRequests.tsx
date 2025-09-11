"use client"

import React, { useState } from "react"
import { Lexend } from "next/font/google"
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SortAsc,
  Clock,
  AlertCircle,
  X
} from "lucide-react"
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-gray-900/95 border border-red-500/30 rounded-lg w-full max-w-md shadow-2xl">
   

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-400 mt-0.5" size={20} />
                <div>
                  <p className="text-red-400 font-medium text-sm">
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-red-300/80 text-sm mt-1">
                    Are you sure you want to reject <span className="font-semibold text-white">{pendingRejectRequest.ownerName}</span>'s request?
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rejection Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                className="w-full p-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 resize-none transition-all duration-200"
                placeholder="Please provide a detailed reason for rejection..."
                value={rejectionReason}
                rows={4}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-1">
                This reason will be sent to the applicant via email.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-red-500/20 bg-gray-800/30 flex justify-end gap-3">
            <button
              onClick={closeRejectModal}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectConfirm}
              className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Reject Request
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm p-6">
      <div className="space-y-6">


        {/* Alert Banner */}
        {totalItems > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <div>
                <h3 className="text-blue-400 font-medium">Pending Requests</h3>
                <p className="text-blue-300 text-sm">
                  {totalItems} request{totalItems > 1 ? 's' : ''} awaiting your review and approval.
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
                placeholder="Search pending requests by name, email..."
                value={currentFilters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={`${currentFilters.sortBy || 'submittedAt'}-${currentFilters.sortOrder || 'desc'}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-")
                  handleSortChange(sortBy, sortOrder as "asc" | "desc")
                }}
                className="appearance-none bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white pl-10 pr-8 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 min-w-[200px] cursor-pointer hover:bg-gray-700/50"
              >
                <option value="submittedAt-desc">Newest First</option>
                <option value="submittedAt-asc">Oldest First</option>
                <option value="ownerName-asc">Name (A-Z)</option>
                <option value="ownerName-desc">Name (Z-A)</option>
                <option value="reviewedAt-desc">Recently Reviewed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <span className="text-blue-400 font-medium text-sm">
                {totalItems}
              </span>
              <span className="text-gray-300 text-sm whitespace-nowrap">
                pending requests
              </span>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Pending Requests
            </h3>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
                <p className="text-gray-300 text-sm">Loading pending requests...</p>
              </div>
            ) : requests.length > 0 ? (
              requests.map(request => (
                <div 
                  key={request._id}
                  className="transition-all duration-200 hover:scale-[1.01]"
                >
                  <OwnerRequestCard
                    request={request}
                    actions={[
                      {
                        label: "View Details",
                        icon: Eye,
                        onClick: onViewDetails,
                        className: "bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-all duration-200",
                      },
                      {
                        label: "Accept",
                        icon: CheckCircle,
                        onClick: onAcceptRequest,
                        className: "bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition-all duration-200",
                      },
                      {
                        label: "Reject",
                        icon: XCircle,
                        onClick: openRejectModal, 
                        className: "bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition-all duration-200",
                      },
                    ]}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-8 text-center max-w-md mx-auto transition-all duration-200">
                  <div className="bg-green-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <UserCheck size={32} className="text-green-400" />
                  </div>
                  <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                    All Requests Processed
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Great! All owner requests have been reviewed and processed.
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
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                            : "bg-gray-800/50 border border-yellow-500/30 text-white hover:bg-gray-700/50 hover:border-yellow-500/50"
                        }`}
                      >
                        {page}
                      </button>
                    )
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

        {renderRejectModal()}
      </div>
    </div>
  )
}

export default OwnerRequests
