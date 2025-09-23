
"use client";

import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Search,
  Eye,
  Building,
  Users,
  Filter,
  SortAsc,
  RotateCcw,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { ITheater, TheaterFilters } from "@/app/others/types";
import { getTheatersByOwnerIdAdmin } from "@/app/others/services/adminServices/theaterServices";
import TheaterDetailsModal from "./TheaterModal";
import { useDebounce } from "@/app/others/Utils/debounce";
import { AxiosError } from "axios";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface TheatersProps {
  setViewInactiveTheater: () => void;
  ownerId: string;
  onClose: () => void;
  status: "active" | "inactive";
}

const Theaters: React.FC<TheatersProps> = ({
  setViewInactiveTheater,
  ownerId,
  onClose,
  status,
}) => {
  const [theaters, setTheaters] = useState<ITheater[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTheater, setSelectedTheater] = useState<ITheater | null>(null);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setSelectedTheater(null);
    setIsModalOpen(false);
  };

  const handleStatusToggle = async () => {
    setIsModalOpen(false);
    fetchTheaters();
  };

  const handleVerifyTheater = async () => {
    setIsModalOpen(false);
    fetchTheaters();
  };

  const handleRejectTheater = async () => {
    setIsModalOpen(false);
    fetchTheaters();
  };

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          title: "Active Theaters",
          icon: CheckCircle,
          iconColor: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          statusBadgeColor: "text-green-400",
          statusText: "Active",
          emptyMessage: "No Active Theaters",
          emptyDescription: "This owner doesn't have any active theaters yet.",
        };
      case "inactive":
        return {
          title: "Inactive Theaters",
          icon: XCircle,
          iconColor: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          statusBadgeColor: "text-red-400",
          statusText: "Inactive",
          emptyMessage: "No Inactive Theaters",
          emptyDescription: "This owner doesn't have any inactive theaters.",
        };
      default:
        return {
          title: "Theaters",
          icon: Building,
          iconColor: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          statusBadgeColor: "text-gray-400",
          statusText: "Unknown",
          emptyMessage: "No Theaters",
          emptyDescription: "No theaters found.",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const fetchTheaters = async (filters: TheaterFilters = {}) => {
    try {
      setIsLoading(true);

      const theaterFilters: TheaterFilters = {
        ownerId,
        status,
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
      };

      const response = await getTheatersByOwnerIdAdmin(ownerId, theaterFilters);
      setTheaters(response.data?.theaters || response.theaters || []);
      if (response.data?.meta?.pagination) {
        setTotalPages(response.data.meta.pagination.totalPages);
        setTotalItems(response.data.meta.pagination.total);
        setCurrentPage(response.data.meta.pagination.currentPage);
      } else if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.totalPages);
        setTotalItems(response.meta.pagination.total);
        setCurrentPage(response.meta.pagination.currentPage);
      } else {
        setTotalPages(1);
        setTotalItems(theaters.length);
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError)
      {

        console.error("Error fetching theaters:", error);
        toast.error(error.response?.data?.message || "Failed to load theaters");
        setTheaters([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, [ownerId, currentPage, status]);

  const debouncedFetchTheaters = useDebounce((filters: TheaterFilters) => {
    fetchTheaters(filters);
  }, 700);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    debouncedFetchTheaters({
      search: searchTerm,
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);

    fetchTheaters({
      ownerId: ownerId,
      search: searchTerm,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            Showing <span className="text-yellow-400 font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="text-yellow-400 font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
            <span className="text-yellow-400 font-medium">{totalItems}</span> theaters
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-200"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-1">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black"
                      : "bg-gray-800/50 border border-yellow-500/30 text-white hover:bg-gray-700/50 hover:border-yellow-500/50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-200"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`${statusConfig.bgColor} p-2 rounded-lg`}>
                <StatusIcon className={statusConfig.iconColor} size={20} />
              </div>
              <div>
                <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
                  {statusConfig.title}
                </h2>
                <p className="text-gray-300 text-sm">
                  Manage and monitor theater operations and status
                </p>
              </div>
            </div>
            <button
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setViewInactiveTheater()}
            >
              View {status === "active" ? "Inactive" : "Active"} Theaters
            </button>
          </div>
        </div>

        {/* Search and Filters Card */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Search & Filters
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search theaters by name, location..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                    debouncedFetchTheaters({
                      ownerId: ownerId,
                      search: e.target.value,
                      sortBy,
                      sortOrder,
                      page: 1,
                    });
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
                />
              </div>
            </form>

            <div className="flex gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white pl-10 pr-8 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 min-w-[180px] cursor-pointer hover:bg-gray-700/50"
                >
                  <option value="createdAt">Sort by Date</option>
                  <option value="theaterName">Sort by Name</option>
                  <option value="verifiedAt">Sort by Verified Date</option>
                  <option value="totalScreens">Sort by Screens</option>
                  <option value="totalSeats">Sort by Seats</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() =>
                  fetchTheaters({ ownerId: ownerId, search: searchTerm, sortBy, sortOrder })
                }
                className="flex items-center gap-2 bg-gray-800/50 border border-yellow-500/30 hover:bg-gray-700/50 hover:border-yellow-500/50 text-white px-4 py-3 rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />
                {isLoading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-fit">
            <span className="text-yellow-400 font-medium text-sm">
              {totalItems}
            </span>
            <span className="text-gray-300 text-sm">
              {statusConfig.statusText.toLowerCase()} theaters found
            </span>
          </div>
        </div>

        {/* Theaters List */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <Building className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Theaters List
            </h3>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
              <p className="text-gray-300 text-sm">Loading theaters...</p>
            </div>
          ) : theaters.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-8 text-center max-w-md mx-auto">
                <div className={`${statusConfig.bgColor} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  <StatusIcon size={32} className={statusConfig.iconColor} />
                </div>
                <h3 className={`${lexend.className} text-xl text-white mb-2`}>
                  {statusConfig.emptyMessage}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {searchTerm
                    ? `No theaters found matching "${searchTerm}"`
                    : statusConfig.emptyDescription}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                      fetchTheaters({ ownerId: ownerId, sortBy, sortOrder, page: 1 });
                    }}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {theaters.map((theater) => (
                <div
                  key={theater._id}
                  className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 hover:bg-gray-700/50 hover:border-yellow-500/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className={`${lexend.className} text-xl font-medium text-white`}>
                          {theater.name}
                        </h3>
                        <StatusIcon className={statusConfig.iconColor} size={18} />
                        {theater.isVerified && (
                          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 text-xs rounded-full flex items-center gap-1">
                            <Shield size={12} />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                          <MapPin size={16} className="text-gray-400" />
                          <span className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.city}, {theater.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                          <Phone size={16} className="text-gray-400" />
                          <span className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                          <Building size={16} className="text-gray-400" />
                          <span className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.screens} Screens
                          </span>
                        </div>
                      </div>

                      {theater.facilities && theater.facilities.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Facilities:</p>
                          <div className="flex flex-wrap gap-2">
                            {theater.facilities.slice(0, 4).map((facility, index) => (
                              <span
                                key={index}
                                className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 text-xs rounded-full"
                              >
                                {facility}
                              </span>
                            ))}
                            {theater.facilities.length > 4 && (
                              <span className="bg-gray-700/50 text-gray-300 px-3 py-1 text-xs rounded-full">
                                +{theater.facilities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Theater Status */}
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          theater.isActive 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            theater.isActive ? "bg-green-400" : "bg-red-400"
                          }`}></div>
                          <span className="text-sm font-medium">
                            {theater.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          theater.isVerified 
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            theater.isVerified ? "bg-blue-400" : "bg-yellow-400"
                          }`}></div>
                          <span className="text-sm font-medium">
                            {theater.isVerified ? "Verified" : "Pending Verification"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <button
                        onClick={() => {
                          setSelectedTheater(theater);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                      >
                        <Eye size={16} />
                        <span className={`${lexendSmall.className} text-sm`}>
                          View Details
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {renderPagination()}
        </div>
      </div>

      <TheaterDetailsModal
        theater={selectedTheater}
        isOpen={isModalOpen}
        onClose={closeModal}
        onStatusToggle={handleStatusToggle}
        onVerifyTheater={handleVerifyTheater}
        onRejectTheater={handleRejectTheater}
      />
    </div>
  );
};

export default Theaters;
