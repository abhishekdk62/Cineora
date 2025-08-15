"use client";

import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import { Building, Plus, Search, Power } from "lucide-react";
import TheaterCard from "./TheaterCard";
import CreateTheaterModal from "./TheaterFormModal";
import EditTheaterModal from "./EditTheaterModal";
import TheaterFilters from "./TheaterFilters";
import {
  deleteTheaterOwner,
  getTheatersByOwnerId,
  toggleTheaterStatusOwner,
} from "@/app/others/services/ownerServices/theaterServices";
import TheaterFormModal from "./TheaterFormModal";
import toast from "react-hot-toast";
import TheaterViewModal from "./TheaterViewModal";
import { ITheater } from "@/app/others/Types";
import { confirmAction, ConfirmDialog } from "@/app/others/Utils/ConfirmDialog";

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

const TheaterManager: React.FC = () => {
  const [theaters, setTheaters] = useState<ITheater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<ITheater | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showTheaterDetails, setShowTheaterDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchTheaters();
  }, [debouncedSearchQuery, selectedFilter, pagination.currentPage]);

  const fetchTheaters = async () => {
    try {
      setIsLoading(true);

      const filters = {
        search: debouncedSearchQuery.trim() || undefined,
        status: selectedFilter !== "all" ? selectedFilter : undefined,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
      };

      const data = await getTheatersByOwnerId(filters);

      setTheaters(data.data.theaters || []);

      setPagination((prev) => ({
        ...prev,
        totalItems: data.total,
        totalPages: Math.ceil(data.total / prev.itemsPerPage),
      }));

      setStats({
        total: data.data.totalAll,
        active: data.data.activeAll,
        inactive: data.data.inactiveAll,
      });
    } catch (error) {
      console.error("Error fetching theaters:", error);
      setTheaters([]);
      setPagination((prev) => ({
        ...prev,
        totalItems: 0,
        totalPages: 1,
      }));
      setStats({ total: 0, active: 0, inactive: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleToggleTheaterStatus = async (theater: ITheater) => {
    try {
      if (!theater.isVerified) {
        toast.error(
          "The theater needs to be verified to activate.Please try again later"
        );
        return;
      }

      const confirmed = await confirmAction({
        title: theater.isActive ? "Disable Theater" : "Enable Theater",
        message: `Are you sure you want to ${
          theater.isActive ? `disable` : `enable`
        }'the theater?`,
        confirmText: theater.isActive ? "Disable" : "Enable",
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      const data = await toggleTheaterStatusOwner(theater._id);

      console.log(data);

      const updatedTheaters = theaters.map((theater) =>
        theater._id === theater._id
          ? { ...theater, isActive: !theater.isActive }
          : theater
      );
      setTheaters(updatedTheaters);
    } catch (error) {
      console.error("Error toggling theater status:", error);
      fetchTheaters();
    }
  };

  const handleDeleteTheater = async (theaterId: string) => {
    try {
      const data = await deleteTheaterOwner(theaterId);

      const updatedTheaters = theaters.filter(
        (theater) => theater._id !== theaterId
      );
      setTheaters(updatedTheaters);
      toast.success('Theater deleted succusfully')
    } catch (error) {
      console.error("Error deleting theater:", error);
      fetchTheaters();
    }
  };

  const handleCreateTheater = (newTheater: ITheater) => {
    fetchTheaters();
    setShowCreateModal(false);
  };
  const onView = (theater: ITheater) => {
    setSelectedTheater(theater);
    setShowTheaterDetails(true);
  };

  const handleEditTheater = (theater: ITheater) => {
    setSelectedTheater(theater);
    setShowEditModal(true);
  };
  const handleEditTheaterSave = () => {
    fetchTheaters();
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>
            Theater Management
          </h1>
          <p className={`${lexendSmall.className} text-gray-400`}>
            Manage your cinema theaters and their settings
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-medium`}
        >
          <Plus className="w-5 h-5" />
          Add New Theater
        </button>
      </div>

      {/* Theater Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Total Theaters
              </p>
              <p className={`${lexendBold.className} text-2xl text-white mt-1`}>
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Active Theaters
              </p>
              <p
                className={`${lexendBold.className} text-2xl text-green-400 mt-1`}
              >
                {stats.active}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Power className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Inactive Theaters
              </p>
              <p
                className={`${lexendBold.className} text-2xl text-orange-400 mt-1`}
              >
                {stats.inactive}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Power className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Theater Search and Filters */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search theaters by name, city, or state..."
              className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
            />
            {isLoading && debouncedSearchQuery !== searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <TheaterFilters
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 animate-pulse"
              >
                <div className="space-y-4">
                  <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : theaters.length === 0 ? (
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
              {searchQuery || selectedFilter !== "all"
                ? "No theaters found"
                : "No theaters yet"}
            </h3>
            <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
              {searchQuery || selectedFilter !== "all"
                ? `No theaters match your criteria`
                : "Add your first theater to get started"}
            </p>
            {!searchQuery && selectedFilter === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300`}
              >
                Add Your First Theater
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {theaters.map((theater) => (
              <TheaterCard
                key={theater._id}
                theater={theater}
                onToggleStatus={handleToggleTheaterStatus}
                onDelete={handleDeleteTheater}
                onEdit={handleEditTheater}
                onView={onView}
              />
            ))}
          </div>
        )}
      </div>

      {!isLoading && theaters.length > 0 && pagination.totalPages > 1 && (
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <p className={`${lexendSmall.className} text-gray-400`}>
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.itemsPerPage,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} theaters
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`${lexendMedium.className} px-4 py-2 rounded-lg border border-gray-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNumber = pagination.totalPages - 4 + i;
                    } else {
                      pageNumber = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`${
                          lexendMedium.className
                        } w-10 h-10 rounded-lg border border-gray-500/30 transition-all duration-300 ${
                          pagination.currentPage === pageNumber
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`${lexendMedium.className} px-4 py-2 rounded-lg border border-gray-500/30 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <TheaterFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateTheater}
          mode={"create"}
        />
      )}

      {showEditModal && selectedTheater && (
        <TheaterFormModal
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditTheaterSave}
          mode={"edit"}
          initialData={selectedTheater}
        />
      )}

      {showTheaterDetails && selectedTheater && (
        <TheaterViewModal
          theaterData={selectedTheater}
          onClose={() => setShowTheaterDetails(false)}
        />
      )}
    </div>
  );
};

export default TheaterManager;
