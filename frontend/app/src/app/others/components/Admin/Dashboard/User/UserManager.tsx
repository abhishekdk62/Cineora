"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Lexend } from "next/font/google";
import { User, UserCheck, UserX, Clock } from "lucide-react";
import toast from "react-hot-toast";
import ActiveUsers from "./ActiveUsers";
// Import your user services here
// import {
//   getUsers,
//   getUserCounts,
//   toggleUserStatus,
// } from "@/app/others/services/adminServices/userServices";

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  bookingHistory?: string[]; // Array of booking IDs
  favoriteTheatres?: string[]; // Array of theatre IDs
}

export interface UserFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
  verified?: boolean;
}

export interface UserResponse {
  users: User[];
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

interface UsersTopBarProps {
  activeView: "active" | "inactive" | "verified" | "unverified";
  setActiveView: (
    view: "active" | "inactive" | "verified" | "unverified"
  ) => void;
  activeCounts: {
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
  };
}

const UsersTopBar: React.FC<UsersTopBarProps> = ({
  activeView,
  setActiveView,
  activeCounts,
}) => {
  const safeActiveCounts = activeCounts || {
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  };

  const tabs = [
    {
      id: "active" as const,
      label: "Active Users",
      icon: User,
      count: safeActiveCounts.activeUsers,
      color: "text-green-400",
    },
    {
      id: "inactive" as const,
      label: "Inactive Users",
      icon: Clock,
      count: safeActiveCounts.inactiveUsers,
      color: "text-orange-400",
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

const UsersManager: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "active" | "inactive" | "verified" | "unverified"
  >("active");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<UserFilters>({});
  const [countsLoading, setCountsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const [activeCounts, setActiveCounts] = useState({
    activeUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  });

  // Mock function - replace with actual API call
  const fetchCounts = async () => {
    try {
      setCountsLoading(true);
      // const response = await getUserCounts();
      // Mock data for now
      const mockCounts = {
        activeUsers: 1250,
        inactiveUsers: 45,
        verifiedUsers: 1100,
        unverifiedUsers: 195,
      };
      setActiveCounts(mockCounts);
    } catch (error: any) {
      console.error("Error fetching counts:", error);
      toast.error("Failed to load user counts");
      setActiveCounts({
        activeUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
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
    filters: UserFilters,
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

      // Determine filter based on active view
      let apiFilters = { ...filters };
      if (activeView === "active" || activeView === "inactive") {
        apiFilters.status = activeView;
      } else if (activeView === "verified") {
        apiFilters.verified = true;
      } else if (activeView === "unverified") {
        apiFilters.verified = false;
      }

      // const response = await getUsers(apiFilters);
      // Mock data for now
      const mockUsers: User[] = [
        {
          _id: "1",
          name: "John Doe",
          phone: "+91 9876543210",
          email: "john.doe@example.com",
          profilePicture: "https://via.placeholder.com/100",
          dateOfBirth: "1990-05-15",
          gender: "male",
          isActive: true,
          isVerified: true,
          emailVerified: true,
          phoneVerified: true,
          lastLogin: "2024-08-07T10:30:00Z",
          createdAt: "2024-01-15T08:00:00Z",
          updatedAt: "2024-08-07T10:30:00Z",
          bookingHistory: ["booking1", "booking2"],
          favoriteTheatres: ["theatre1", "theatre2"],
        },
        // Add more mock users as needed
      ];

      setUsers(mockUsers);
      setTotalPages(5);
      setTotalItems(50);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Filter error:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentFilters({});
    setCurrentPage(1);
    setUsers([]);
    handleFiltersChange({}, true);
    // eslint-disable-next-line
  }, [activeView]);

  const handleViewDetails = (user: User) => {
    console.log("View details for:", user.name);
    // Implement user details modal or navigation
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      // const confirmed = await confirmAction({
      //   title: `${user.isActive ? 'Deactivate' : 'Activate'} User?`,
      //   message: `Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} "${user.name}"?`,
      //   confirmText: user.isActive ? 'Deactivate' : 'Activate',
      //   cancelText: "Cancel",
      // });
      // if (!confirmed) return;

      // await toggleUserStatus(user._id);
      const action = user.isActive ? "deactivated" : "activated";
      toast.success(`User ${action} successfully!`);
      fetchCounts();
      if (Object.keys(currentFilters).length > 0) {
        handleFiltersChange(currentFilters, false);
      }
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
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

    return (
      <ActiveUsers
        {...commonProps}
        users={users}
        onToggleStatus={handleToggleUserStatus}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`${lexend.className} text-3xl font-bold text-white mb-2`}
        >
          Users Management
        </h1>
        <p className="text-gray-400">
          Manage platform users and their accounts
        </p>
      </div>

      {countsLoading ? (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading counts...</div>
          </div>
        </div>
      ) : (
        <UsersTopBar
          activeView={activeView}
          setActiveView={setActiveView}
          activeCounts={activeCounts}
        />
      )}

      {renderContent()}
    </div>
  );
};

export default UsersManager;
