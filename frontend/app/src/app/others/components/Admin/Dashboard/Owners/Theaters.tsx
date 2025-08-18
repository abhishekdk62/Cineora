// Theaters.tsx
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
} from "lucide-react";
import toast from "react-hot-toast";
import { ITheater, TheaterFilters } from "@/app/others/Types";
import { getTheatersByOwnerIdAdmin } from "@/app/others/services/adminServices/theaterServices";
import TheaterDetailsModal from "./TheaterModal";

const lexend = Lexend({
  weight: "400",
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
  status: "active" | "inactive"; // New prop to determine status
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
  setIsModalOpen(false)
  fetchTheaters();
};

const handleVerifyTheater = async () => {
 setIsModalOpen(false)
  fetchTheaters();
};
const handleRejectTheater = async () => {
 setIsModalOpen(false)
  fetchTheaters();
};

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          title: "Active Theaters",
          icon: CheckCircle,
          iconColor: "text-green-400",
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
        status, // Use the dynamic status
        page: currentPage,
        limit: itemsPerPage,
        ...filters,
      };

      const response = await getTheatersByOwnerIdAdmin(ownerId, theaterFilters);
      console.log(response.data);

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
    } catch (error: any) {
      console.error("Error fetching theaters:", error);
      toast.error(error.response?.data?.message || "Failed to load theaters");
      setTheaters([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTheaters();
  }, [ownerId, currentPage, status]); 

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTheaters({
      search: searchTerm,
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);

    fetchTheaters({
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
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          theaters
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-[#e78f03] text-black font-medium"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h2
                className={`${lexend.className} text-xl font-bold text-white`}
              >
                {statusConfig.title}
              </h2>
            </div>
            <button
              className="px-4 py-2 ml-5 border-[#e78f03] border text-[#e78f03] rounded-lg transition-colors"
              onClick={() => setViewInactiveTheater()}
            >
              {status == "active" ? "Inactive" : "Active"} Theaters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search theaters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
              />
            </div>
          </form>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#e78f03]"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="theaterName">Sort by Name</option>
              <option value="verifiedAt">Sort by Verified Date</option>
              <option value="totalScreens">Sort by Screens</option>
              <option value="totalSeats">Sort by Seats</option>
            </select>
            <button
              onClick={() =>
                fetchTheaters({ search: searchTerm, sortBy, sortOrder })
              }
              className="px-4 py-2 bg-[#e78f03] hover:bg-[#d67e02] text-black rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
            <div className="ml-3 text-gray-400">Loading theaters...</div>
          </div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-12">
            <StatusIcon
              className={`mx-auto h-12 w-12 ${statusConfig.iconColor} mb-4`}
            />
            <h3 className="text-lg font-medium text-white mb-2">
              {statusConfig.emptyMessage}
            </h3>
            <p className="text-gray-400">
              {searchTerm
                ? `No theaters found matching "${searchTerm}"`
                : statusConfig.emptyDescription}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                  fetchTheaters({ sortBy, sortOrder, page: 1 });
                }}
                className="mt-3 px-4 py-2 bg-[#e78f03] hover:bg-[#d67e02] text-black rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {theaters.map((theater) => (
              <div
                key={theater._id}
                className="bg-[#2a2a2a] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3
                        className={`${lexend.className} text-lg font-semibold text-white`}
                      >
                        {theater.name}
                      </h3>
                      <StatusIcon
                        className={statusConfig.iconColor}
                        size={18}
                      />
                      {theater.isVerified && (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {theater.city}, {theater.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {theater.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Building size={16} className="text-gray-400" />
                        <span className={`${lexendSmall.className} text-sm`}>
                          {theater.screens} Screens
                        </span>
                      </div>
                    </div>

                    {theater.facilities && theater.facilities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-2">
                          Facilities:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {theater.facilities
                            .slice(0, 4)
                            .map((facility, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-xs rounded-full"
                              >
                                {facility}
                              </span>
                            ))}
                          {theater.facilities.length > 4 && (
                            <span className="px-2 py-1 bg-[#1a1a1a] text-gray-300 text-xs rounded-full">
                              +{theater.facilities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Theater Status */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            theater.isActive ? "bg-green-400" : "bg-red-400"
                          }`}
                        ></div>
                        <span
                          className={
                            theater.isActive ? "text-green-400" : "text-red-400"
                          }
                        >
                          {theater.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            theater.isVerified ? "bg-blue-400" : "bg-yellow-400"
                          }`}
                        ></div>
                        <span
                          className={
                            theater.isVerified
                              ? "text-blue-400"
                              : "text-yellow-400"
                          }
                        >
                          {theater.isVerified
                            ? "Verified"
                            : "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedTheater(theater);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-[#e78f03] hover:bg-[#d67e02] text-black rounded-lg transition-colors"
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
