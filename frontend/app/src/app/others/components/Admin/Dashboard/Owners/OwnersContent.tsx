"use client";

import React from "react";
import ActiveOwners from "./ActiveOwners";
import OwnerRequests from "./OwnerRequests";
import Theaters from "./Theaters";
import InactiveOwners from "./InactiveOwners";
import RejectedRequests from "./RejectedOwners";
import { Owner, OwnerRequest, OwnerFilters, OwnerRequestFilters } from "./OwnerManager";

interface OwnersContentProps {
  activeView: "active" | "inactive" | "pending" | "approved" | "rejected" | "active-theaters" | "inactive-theaters";
  owners: Owner[];
  ownerRequests: OwnerRequest[];
  isLoading: boolean;
  ownerFilters: OwnerFilters;
  requestFilters: OwnerRequestFilters;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  ownerId: string;
  ownerSearchValue: string;
  requestSearchValue: string;
  onPageChange: (page: number) => void;
  onOwnerFiltersChange: (filters: OwnerFilters, resetPage?: boolean) => void;
  onRequestFiltersChange: (filters: OwnerRequestFilters, resetPage?: boolean) => void;
  onViewDetails: (item: Owner | OwnerRequest) => void;
  onToggleOwnerStatus: (owner: Owner) => void;
  onAcceptRequest: (request: OwnerRequest) => void;
  onRejectRequest: (request: OwnerRequest, reason: string) => void;
  setViewThaeter: (id: string) => void;
  setViewInactiveTheater: () => void;
  onClose: () => void;
}

const OwnersContent: React.FC<OwnersContentProps> = ({
  activeView,
  owners,
  ownerRequests,
  isLoading,
  ownerFilters,
  requestFilters,
  currentPage,
  totalPages,
  totalItems,
  ownerId,
  ownerSearchValue, 
  requestSearchValue, 
  onPageChange,
  onOwnerFiltersChange,
  onRequestFiltersChange,
  onViewDetails,
  onToggleOwnerStatus,
  onAcceptRequest,
  onRejectRequest,
  setViewThaeter,
  setViewInactiveTheater,
  onClose,
}) => {
  const ownerCommonProps = {
    isLoading,
    currentFilters: ownerFilters,
    ownerSearchValue, 
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onFiltersChange: onOwnerFiltersChange,
    onViewDetails,
  };

  const requestCommonProps = {
    isLoading,
    currentFilters: requestFilters,
    requestSearchValue, 
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onFiltersChange: onRequestFiltersChange,
    onViewDetails,
  };

  switch (activeView) {
    case "active":
      return (
        <ActiveOwners
          {...ownerCommonProps}
          owners={owners}
          onToggleStatus={onToggleOwnerStatus}
          setViewThaeter={setViewThaeter}
        />
      );
    case "inactive":
      return (
        <InactiveOwners
          {...ownerCommonProps}
          owners={owners}
          onToggleStatus={onToggleOwnerStatus}
          setViewThaeter={setViewThaeter}
        />
      );
    case "pending":
      return (
        <OwnerRequests
          {...requestCommonProps}
          requests={ownerRequests}
          onAcceptRequest={onAcceptRequest}
          onRejectRequest={onRejectRequest}
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
          onToggleStatus={onToggleOwnerStatus}
          setViewThaeter={setViewThaeter}
        />
      );
  }
};

export default OwnersContent;
