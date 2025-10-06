"use client";
import React, { useState } from "react";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import toast from "react-hot-toast";
import StaffFilters from "./StaffFilters";
import StaffGrid from "./StaffGrid";

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
}

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: Theater;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffListProps {
  staffs: StaffMember[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: 'all' | 'active' | 'inactive';
  setActiveFilter: (filter: 'all' | 'active' | 'inactive') => void;
  selectedTheater: string;
  setSelectedTheater: (theaterId: string) => void;
  theaters: Theater[];
  totalCount: number;
  onEdit: (staff: StaffMember) => void;
  onView: (staff: StaffMember) => void;
  onToggleStatus: (staffId: string) => void;
  onRefresh: () => void;
  lexendMedium: any;
  lexendSmall: any;
}

const StaffList: React.FC<StaffListProps> = ({
  staffs,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  selectedTheater,
  setSelectedTheater,
  theaters,
  totalCount,
  onEdit,
  onView,
  onToggleStatus,
  onRefresh,
  lexendMedium,
  lexendSmall
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [groupBy, setGroupBy] = useState("none");
  const [timeFilter, setTimeFilter] = useState("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const handleToggleStatus = async (staffId: string, isActive: boolean) => {
    try {
      const verb = isActive ? "Deactivate" : "Activate";
      const message = isActive
        ? "Are you sure you want to deactivate this staff member?"
        : "Are you sure you want to activate this staff member?";
      
      const confirmed = await confirmAction({
        title: `${verb} Staff?`,
        message,
        confirmText: verb,
        cancelText: "Cancel",
      });
      
      if (!confirmed) return;
      
      onToggleStatus(staffId);
      toast.success(
        !isActive
          ? "Staff member activated successfully"
          : "Staff member deactivated successfully"
      );
    } catch (error) {
      console.error("Error toggling staff status:", error);
      toast.error("Something went wrong while updating staff");
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey);
    } else {
      newCollapsed.add(groupKey);
    }
    setCollapsedGroups(newCollapsed);
  };

  const getTheaterName = (theaterId: any) => {
    if (typeof theaterId === "object" && theaterId?.name) return theaterId.name;
    return typeof theaterId === "string" ? theaterId : "Unknown Theater";
  };

  const groupStaffsBy = (staffs: StaffMember[], groupKey: string) => {
    if (groupKey === "none") return { "All Staff": staffs };
    
    return staffs.reduce((groups, staff) => {
      let groupValue: string = "";
      let groupLabel: string = "";

      switch (groupKey) {
        case "theater":
          groupValue = typeof staff.theaterId === "object" 
            ? staff.theaterId._id 
            : staff.theaterId || "no-theater";
          groupLabel = getTheaterName(staff.theaterId) || "No Theater";
          break;
        case "status":
          groupValue = staff.isActive ? "active" : "inactive";
          groupLabel = staff.isActive ? "Active Staff" : "Inactive Staff";
          break;
      }
      
      const key = `${groupValue}|${groupLabel}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(staff);
      return groups;
    }, {} as Record<string, StaffMember[]>);
  };

  const filteredAndSortedStaffs = staffs
    .filter((staff) => {
      if (filter === "active" && !staff.isActive) return false;
      if (filter === "inactive" && staff.isActive) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "date") {
        const dateA = a.createdAt || "";
        const dateB = b.createdAt || "";
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
      return 0;
    });

  const groupedStaffs = groupStaffsBy(filteredAndSortedStaffs, groupBy);

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${lexendMedium.className} text-xl text-white`}>
          Staff Members {timeFilter !== "all" && `(${timeFilter})`}
        </h3>
        <StaffFilters
          filter={filter}
          sortBy={sortBy}
          groupBy={groupBy}
          timeFilter={timeFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedTheater={selectedTheater}
          setSelectedTheater={setSelectedTheater}
          theaters={theaters}
          totalCount={totalCount}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
          onGroupChange={setGroupBy}
          onTimeFilterChange={setTimeFilter}
        />
      </div>
      
      <StaffGrid
        groupedStaffs={groupedStaffs}
        groupBy={groupBy}
        collapsedGroups={collapsedGroups}
        onToggleGroupCollapse={toggleGroupCollapse}
        onEdit={onEdit}
        onView={onView}
        onToggleStatus={handleToggleStatus}
        lexendMedium={lexendMedium}
        lexendSmall={lexendSmall}
      />
    </div>
  );
};

export default StaffList;
