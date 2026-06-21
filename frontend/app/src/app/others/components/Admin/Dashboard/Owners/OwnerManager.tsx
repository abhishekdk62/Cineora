
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import toast from "react-hot-toast";
import {
  getOwners,
  getOwnerRequests,
  getOwnerCounts,
  acceptOwnerRequest,
  rejectOwnerRequest,
  toggleOwnerStatus,
} from "@/app/others/services/adminServices/ownerServices";
import {
  OwnerResponseDto,
  OwnerRequestResponseDto,
} from "@/app/others/dtos/owner.dto";
import { getApiErrorMessage } from "@/app/others/types/common.types";
import OwnersContent from "./OwnersContent";
import OwnersStats from "./OwnersStats";
import OwnersHeader from "./OwnersHeader";
import { useDebounce } from "@/app/others/Utils/debounce";

export type Owner = OwnerResponseDto;
export type OwnerRequest = OwnerRequestResponseDto & {
  otp?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export interface OwnerFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
}

export type ActiveView =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "active-theaters"
  | "inactive-theaters";

export interface OwnerRequestFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: "pending" | "approved" | "rejected";
}

const OwnersManager: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("active");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerRequests, setOwnerRequests] = useState<OwnerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ownerSearchValue, setOwnerSearchValue] = useState("");
  const [requestSearchValue, setRequestSearchValue] = useState("");

  const [ownerFilters, setOwnerFilters] = useState<OwnerFilters>({});
  const [requestFilters, setRequestFilters] = useState<OwnerRequestFilters>({});
  const [ownerId, setOwnerId] = useState<string>("");
  const [countsLoading, setCountsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(1);
  const [activeCounts, setActiveCounts] = useState({
    activeOwners: 0,
    inactiveOwners: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
  });

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
    setActiveView("active");
  };

  const fetchCounts = async () => {
    try {
      setCountsLoading(true);
      const response = await getOwnerCounts();
      if (response?.data) {
        setActiveCounts({
          activeOwners: response.data.activeOwners,
          inactiveOwners: response.data.inactiveOwners,
          pendingRequests: response.data.pendingRequests,
          rejectedRequests: response.data.rejectedRequests,
        });
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to load counts - invalid response format");
      }
    } catch (error: unknown) {
      console.error("Error fetching counts:", error);
      toast.error(getApiErrorMessage(error, "Failed to load counts"));
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

  const debouncedOwnerSearch = useDebounce(
    useCallback(async (filters: OwnerFilters, resetPage: boolean = true) => {
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

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.totalPages);
          setTotalItems(response.meta.pagination.total);
          setCurrentPage(response.meta.pagination.currentPage);
        }
      } catch (error: unknown) {
        console.error("Filter error:", error);
        toast.error(getApiErrorMessage(error, "Filter failed"));
        setOwners([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    }, [activeView, itemsPerPage]),
    500
  );

  const debouncedRequestSearch = useDebounce(
    useCallback(async (filters: OwnerRequestFilters, resetPage: boolean = true) => {
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

        setOwnerRequests(
          Array.isArray(response.data)
            ? response.data
            : (response as { requests?: OwnerRequest[] }).requests || []
        );
        setOwners([]);

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.totalPages);
          setTotalItems(response.meta.pagination.total);
          setCurrentPage(response.meta.pagination.currentPage);
        }
      } catch (error: unknown) {
        console.error("Filter error:", error);
        toast.error(getApiErrorMessage(error, "Filter failed"));
        setOwnerRequests([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    }, [activeView, itemsPerPage]),
    500
  );

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
    const isSearchChange = filters.search !== undefined && filters.search !== ownerFilters.search;

    if (isSearchChange) {
      setOwnerSearchValue(filters.search || "");
      debouncedOwnerSearch(filters, resetPage);
    } else {
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

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.totalPages);
          setTotalItems(response.meta.pagination.total);
          setCurrentPage(response.meta.pagination.currentPage);
        }
      } catch (error: unknown) {
        console.error("Filter error:", error);
        toast.error(getApiErrorMessage(error, "Filter failed"));
        setOwners([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    }

  };


  const handleRequestFiltersChange = async (
    filters: OwnerRequestFilters,
    resetPage: boolean = true
  ) => {
    const isSearchChange = filters.search !== undefined && filters.search !== requestFilters.search;

    if (isSearchChange) {
      debouncedRequestSearch(filters, resetPage);
    } else {
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

        setOwnerRequests(
          Array.isArray(response.data)
            ? response.data
            : (response as { requests?: OwnerRequest[] }).requests || []
        );
        setOwners([]);

        if (response.meta?.pagination) {
          setTotalPages(response.meta.pagination.totalPages);
          setTotalItems(response.meta.pagination.total);
          setCurrentPage(response.meta.pagination.currentPage);
        }
      } catch (error: unknown) {
        console.error("Filter error:", error);
        toast.error(getApiErrorMessage(error, "Filter failed"));
        setOwnerRequests([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
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
    } else if (activeView === "pending" || activeView === "rejected") {
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
    } catch (error: unknown) {
      console.error("Error toggling owner status:", error);
      toast.error(getApiErrorMessage(error, "Failed to update owner status"));
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
    } catch (error: unknown) {
      console.error("Error accepting request:", error);
      toast.error(getApiErrorMessage(error, "Failed to accept request"));
    }
  };

  const handleRejectRequest = async (
    request: OwnerRequest,
    rejectionReason: string
  ) => {
    try {
      await rejectOwnerRequest(request._id, { rejectionReason });
      toast.success("Owner request rejected!");
      fetchCounts();

      if (Object.keys(requestFilters).length > 0) {
        handleRequestFiltersChange(requestFilters, false);
      }
    } catch (error: unknown) {
      console.error("Error rejecting request:", error);
      toast.error(getApiErrorMessage(error, "Failed to reject request"));
    }
  };

  return (
    <div className="space-y-6">
      <OwnersHeader />

      <OwnersStats
        activeView={activeView}
        setActiveView={setActiveView}
        activeCounts={activeCounts}
        countsLoading={countsLoading}
      />

      <OwnersContent
        activeView={activeView}
        owners={owners}
        ownerRequests={ownerRequests}
        isLoading={isLoading}
        ownerSearchValue={ownerSearchValue}
        requestSearchValue={requestSearchValue}
        ownerFilters={ownerFilters}
        requestFilters={requestFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        ownerId={ownerId}
        onPageChange={handlePageChange}
        onOwnerFiltersChange={handleOwnerFiltersChange}
        onRequestFiltersChange={handleRequestFiltersChange}
        onViewDetails={handleViewDetails}
        onToggleOwnerStatus={handleToggleOwnerStatus}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
        setViewThaeter={setViewThaeter}
        setViewInactiveTheater={setViewInactiveTheater}
        onClose={onClose}
      />
    </div>
  );
};

export default OwnersManager;
