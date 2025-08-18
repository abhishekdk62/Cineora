"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lexend } from "next/font/google";
import { User, UserCheck, UserX, Clock } from "lucide-react";
import ActiveOwners from "./ActiveOwners";
import OwnerRequests from "./OwnerRequests";
import Theaters from "./Theaters";
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
  ownerName: string;
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
  approvedAt: string;
  approvedBy: string;
  isActive: boolean;
  isVerified: boolean;
  theatres: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerRequest {
  _id: string;
  ownerName: string;
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
  otp: string;
  agree: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
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
  activeView?:
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "active-theaters"
    | "inactive-theaters";

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
    | "active"
    | "inactive"
    | "pending"
    | "approved"
    | "rejected"
    | "active-theaters"
    | "inactive-theaters"
  >("active");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerRequests, setOwnerRequests] = useState<OwnerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ownerFilters, setOwnerFilters] = useState<OwnerFilters>({});
  const [requestFilters, setRequestFilters] = useState<OwnerRequestFilters>({});
  const [ownerId, setOwnerId] = useState<string>("");
  const [countsLoading, setCountsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const setViewThaeter = (id: string) => {
    setActiveView("active-theaters");
    setOwnerId(id);
  };
  const setViewInactiveTheater = () => {
    if (activeView == "active-theaters") {
      setActiveView("inactive-theaters");
    } else {
      setActiveView("active-theaters");
    }
  };
  const onClose = () => {
    setActiveView("approved");
  };

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
      if (activeView === "inactive" || activeView === "active") {
        const filtersWithPage = { ...ownerFilters, page, limit: itemsPerPage };
        handleOwnerFiltersChange(filtersWithPage, false);
      } else {
        const filtersWithPage = {
          ...requestFilters,
          page,
          limit: itemsPerPage,
        };
        handleRequestFiltersChange(filtersWithPage, false);
      }
    },
    [ownerFilters, requestFilters, itemsPerPage, activeView]
  );

  const handleOwnerFiltersChange = async (
    filters: OwnerFilters,
    resetPage: boolean = true
  ) => {
    if (resetPage) {
      setCurrentPage(1);
      filters = { ...filters, page: 1, limit: itemsPerPage };
    } else {
      filters = { ...filters, limit: itemsPerPage };
    }

    setOwnerFilters(filters);

    try {
      setIsLoading(true);
      const ownerFiltersWithStatus = {
        ...filters,
        status: activeView as "active" | "inactive",
      };
      const response = await getOwners(ownerFiltersWithStatus);

      setOwners(response.data?.owners || response.owners || []);
      setOwnerRequests([]);

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
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestFiltersChange = async (
    filters: OwnerRequestFilters,
    resetPage: boolean = true
  ) => {
    if (resetPage) {
      setCurrentPage(1);
      filters = { ...filters, page: 1, limit: itemsPerPage };
    } else {
      filters = { ...filters, limit: itemsPerPage };
    }

    setRequestFilters(filters);

    try {
      setIsLoading(true);
      const requestFiltersWithStatus = {
        ...filters,
        status: activeView as "pending" | "approved" | "rejected",
      };
      const response = await getOwnerRequests(requestFiltersWithStatus);

      setOwnerRequests(response.data?.requests || response.requests || []);
      setOwners([]);

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
      setOwnerRequests([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOwnerFilters({});
    setRequestFilters({});
    setCurrentPage(1);
    setOwners([]);
    setOwnerRequests([]);

    if (activeView === "inactive" || activeView === "active") {
      handleOwnerFiltersChange({}, true);
    } else {
      handleRequestFiltersChange({}, true);
    }
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

      if (Object.keys(ownerFilters).length > 0) {
        handleOwnerFiltersChange(ownerFilters, false);
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

      if (Object.keys(requestFilters).length > 0) {
        handleRequestFiltersChange(requestFilters, false);
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

      if (Object.keys(requestFilters).length > 0) {
        handleRequestFiltersChange(requestFilters, false);
      }
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  const renderContent = () => {
    const ownerCommonProps = {
      isLoading,
      currentFilters: ownerFilters,
      currentPage,
      totalPages,
      totalItems,
      onPageChange: handlePageChange,
      onFiltersChange: handleOwnerFiltersChange,
      onViewDetails: handleViewDetails,
    };

    const requestCommonProps = {
      isLoading,
      currentFilters: requestFilters,
      currentPage,
      totalPages,
      totalItems,
      onPageChange: handlePageChange,
      onFiltersChange: handleRequestFiltersChange,
      onViewDetails: handleViewDetails,
    };

    switch (activeView) {
      case "active":
        return (
          <ActiveOwners
            {...ownerCommonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
            setViewThaeter={setViewThaeter}
          />
        );
      case "inactive":
        return (
          <InactiveOwners
            {...ownerCommonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
          />
        );
      case "pending":
        return (
          <OwnerRequests
            {...requestCommonProps}
            requests={ownerRequests}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
          />
        );
      case "rejected":
        return (
          <RejectedRequests {...requestCommonProps} requests={ownerRequests} />
        );
      case "active-theaters":
        return (
          <Theaters
            setViewInactiveTheater={setViewInactiveTheater}
            ownerId={ownerId}
            onClose={onClose}
            status="active"
          />
        );
      case "inactive-theaters":
        return (
          <Theaters
            setViewInactiveTheater={setViewInactiveTheater}
            ownerId={ownerId}
            onClose={onClose}
            status="inactive"
          />
        );
      default:
        return (
          <ActiveOwners
            {...ownerCommonProps}
            owners={owners}
            onToggleStatus={handleToggleOwnerStatus}
            setViewThaeter={setViewThaeter}
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
