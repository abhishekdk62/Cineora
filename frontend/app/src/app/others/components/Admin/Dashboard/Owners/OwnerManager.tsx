"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lexend } from "next/font/google";
import { User, UserCheck, UserX, Clock } from "lucide-react";
import ActiveOwners from "./ActiveOwners";
import OwnerRequests from "./OwnerRequests";
import InactiveOwners from "./InactiveOwners";
import { confirmAction, ConfirmDialog } from "@/app/others/Utils/ConfirmDialog";

import toast from "react-hot-toast";
import {
  getOwners,
  getOwnerRequests,
  getOwnerCounts,
  acceptOwnerRequest,
  rejectOwnerRequest,
  toggleOwnerStatus,
} from "@/app/others/services/adminServices/ownerServices";
import RejectedRequests from "./RejectedOwners";

export interface Owner {
  _id: string;
  ownerName: string; // ✅ Changed from 'name'
  phone: string;
  email: string;
  password?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  kycRequestId: string;
  approvedAt: string; // ✅ This is when they became an owner
  approvedBy: string;
  isActive: boolean; // ✅ Changed from status: "active" | "blocked"
  isVerified: boolean;
  theatres: string[]; // Array of theatre IDs
  lastLogin?: string;
  createdAt: string; // ✅ This is their join date
  updatedAt: string;
}

export interface OwnerRequest {
  _id: string;
  ownerName: string; // ✅ Changed from 'name' to match backend
  email: string;
  phone: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  declaration: boolean;
  agree: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: string; // ✅ Changed from 'requestDate'
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
}

export interface OwnerRequestFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
}

export interface OwnerResponse {
  owners: Owner[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface OwnerRequestResponse {
  requests: OwnerRequest[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface OwnersTopBarProps {
  activeView: "active" | "inactive" | "pending" | "approved" | "rejected";
  setActiveView: (
    view: "active" | "inactive" | "pending" | "approved" | "rejected"
  ) => void;
  activeCounts: {
    activeOwners: number;
    inactiveOwners: number;
    pendingRequests: number;
    rejectedRequests: number;
  };
}

const OwnersTopBar: React.FC<OwnersTopBarProps> = ({
  activeView,
  setActiveView,
  activeCounts,
}) => {
  // ✅ Add safety check for activeCounts
  const safeActiveCounts = activeCounts || {
    activeOwners: 0,
    inactiveOwners: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  };

  const tabs = [
    {
      id: "active" as const,
      label: "Active Owners",
      icon: User,
      count: safeActiveCounts.activeOwners,
      color: "text-green-400",
    },
    {
      id: "inactive" as const,
      label: "Inactive Owners",
      icon: Clock,
      count: safeActiveCounts.inactiveOwners,
      color: "text-orange-400",
    },
    {
      id: "pending" as const,
      label: "Pending Requests",
      icon: UserCheck,
      count: safeActiveCounts.pendingRequests,
      color: "text-blue-400",
    },

    {
      id: "rejected" as const,
      label: "Rejected Requests",
      icon: UserX,
      count: safeActiveCounts.rejectedRequests,
      color: "text-red-400",
    },
  ];

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveView(tab.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#e78f03] text-black font-medium shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-gray-500"
              }`}
            >
              <Icon size={16} className={isActive ? "text-black" : tab.color} />
              <span className={`${lexendSmall.className}`}>{tab.label}</span>
              <span
                className={`${
                  isActive
                    ? "bg-black/20 text-black"
                    : "bg-[#2a2a2a] text-gray-300"
                } text-xs px-2 py-1 rounded-full ml-1`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const OwnersManager: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "active" | "inactive" | "pending" | "approved" | "rejected"
  >("active");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerRequests, setOwnerRequests] = useState<OwnerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<
    OwnerFilters | OwnerRequestFilters
  >({});

  const [countsLoading, setCountsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const [activeCounts, setActiveCounts] = useState({
    activeOwners: 0,
    inactiveOwners: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });

  const fetchCounts = async () => {
    try {
      setCountsLoading(true);
      const response = await getOwnerCounts();
      if (response?.data?.counts) {
        setActiveCounts(response.data.counts);
      } else if (response?.counts) {
        setActiveCounts(response.counts);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to load counts - invalid response format");
      }
    } catch (error: any) {
      console.error("Error fetching counts:", error);
      toast.error(error.response?.data?.message || "Failed to load counts");
      setActiveCounts({
        activeOwners: 0,
        inactiveOwners: 0,
        pendingRequests: 0,
        rejectedRequests: 0,
      });
    } finally {
      setCountsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      const filtersWithPage = { ...currentFilters, page, limit: itemsPerPage };
      handleFiltersChange(filtersWithPage, false);
    },
    [currentFilters, itemsPerPage]
  );

  const handleFiltersChange = async (
    filters: OwnerFilters | OwnerRequestFilters,
    resetPage: boolean = true
  ) => {
    if (resetPage) {
      setCurrentPage(1);
      filters = { ...filters, page: 1, limit: itemsPerPage };
    } else {
      filters = { ...filters, limit: itemsPerPage };
    }

    setCurrentFilters(filters);

    try {
      setIsLoading(true);
      let response;

      if (activeView === "inactive" || activeView === "active") {
        const ownerFilters = {
          ...filters,
          status: activeView,
        } as OwnerFilters;
        response = await getOwners(ownerFilters);

        setOwners(response.data?.owners || response.owners || []);
        setOwnerRequests([]);
      } else {
        const requestFilters = {
          ...filters,
          status: activeView,
        } as OwnerRequestFilters;
        response = await getOwnerRequests(requestFilters);
        setOwnerRequests(response.data?.requests || response.requests || []);
        setOwners([]);
      }

      if (response.data?.meta?.pagination) {
        setTotalPages(response.data.meta.pagination.totalPages);
        setTotalItems(response.data.meta.pagination.total);
        setCurrentPage(response.data.meta.pagination.currentPage);
      } else if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.totalPages);
        setTotalItems(response.meta.pagination.total);
        setCurrentPage(response.meta.pagination.currentPage);
      }
    } catch (error: any) {
      console.error("Filter error:", error);
      toast.error(error.response?.data?.message || "Filter failed");
      setOwners([]);
      setOwnerRequests([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentFilters({});
    setCurrentPage(1);
    setOwners([]);
    setOwnerRequests([]);
    handleFiltersChange({}, true);
    // eslint-disable-next-line
  }, [activeView]);

  const handleViewDetails = (item: Owner | OwnerRequest) => {
    console.log("View details for:", item.ownerName);
  };

  const handleToggleOwnerStatus = async (owner: Owner) => {
    try {
      const willDisable = owner.isActive;
      const verb = willDisable ? "disable" : "activate";
      const capitalVerb = verb[0].toUpperCase() + verb.slice(1);

      const confirmed = await confirmAction({
        title: `${capitalVerb} Owner?`,
        message: `Are you sure you want to ${verb} "${owner.ownerName}"?`,
        confirmText: capitalVerb,
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      await toggleOwnerStatus(owner._id);
      const action = owner.isActive ? "blocked" : "activated";
      toast.success(`Owner ${action} successfully!`);
      fetchCounts();
      if (Object.keys(currentFilters).length > 0) {
        handleFiltersChange(currentFilters, false);
      }
    } catch (error: any) {
      console.error("Error toggling owner status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update owner status"
      );
    }
  };

  const handleAcceptRequest = async (request: OwnerRequest) => {
    try {
      const confirmed = await confirmAction({
        title: `Accept Owner Request?`,
        message: `Are you sure you want to accept "${request.ownerName}"'s request?`,
        confirmText: "Accept",
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      await acceptOwnerRequest(request._id);
      toast.success("Owner request accepted! New owner account created.");
      fetchCounts();
      if (Object.keys(currentFilters).length > 0) {
        handleFiltersChange(currentFilters, false);
      }
    } catch (error: any) {
      console.error("Error accepting request:", error);
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (
    request: OwnerRequest,
    rejectionReason: string
  ) => {
    try {
      await rejectOwnerRequest(request._id, rejectionReason);
      toast.success("Owner request rejected!");
      fetchCounts();
      if (Object.keys(currentFilters).length > 0) {
        handleFiltersChange(currentFilters, false);
      }
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  const renderContent = () => {
    const commonProps = {
      isLoading,
      currentFilters,
      currentPage,
      totalPages,
      totalItems,
      onPageChange: handlePageChange,
      onFiltersChange: handleFiltersChange,
      onViewDetails: handleViewDetails,
    };

    switch (activeView) {
      case "active":
        return (
          <ActiveOwners
            {...commonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
          />
        );
      case "inactive":
        return (
          <InactiveOwners
            {...commonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
          />
        );
      case "pending":
        return (
          <OwnerRequests
            {...commonProps}
            requests={ownerRequests}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
        );
      case "rejected":
        return (
          <RejectedRequests {...commonProps} requests={ownerRequests} />
        );
      default:
        return (
          <ActiveOwners
            {...commonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`${lexend.className} text-3xl font-bold text-white mb-2`}
        >
          Owners Management
        </h1>
        <p className="text-gray-400">Manage cinema owners and their requests</p>
      </div>

      {countsLoading ? (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading counts...</div>
          </div>
        </div>
      ) : (
        <OwnersTopBar
          activeView={activeView}
          setActiveView={setActiveView}
          activeCounts={activeCounts}
        />
      )}

      {renderContent()}
    </div>
  );
};

export default OwnersManager;
