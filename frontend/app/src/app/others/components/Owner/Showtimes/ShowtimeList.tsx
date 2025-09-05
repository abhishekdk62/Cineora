"use client";
import React, { useState } from "react";
import { IShowtime } from "./showtime.interfaces";
import { toggleShowtimeStatusOwner } from "@/app/others/services/ownerServices/showtimeServices";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import toast from "react-hot-toast";
import ShowtimeFilters from "./ShowtimeFilters";
import ShowtimeGrid from "./ShowtimeGrid";

interface ShowtimeListProps {
  showtimes: IShowtime[];
  onEdit: (showtime: IShowtime) => void;
  onView: (showtime: IShowtime) => void;
  onRefresh: () => void;
  lexendMedium: any;
  lexendSmall: any;
}

const ShowtimeList: React.FC<ShowtimeListProps> = ({
  showtimes,
  onEdit,
  onRefresh,
  lexendMedium,
  lexendSmall,
  onView
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [groupBy, setGroupBy] = useState("none");
  const [timeFilter, setTimeFilter] = useState("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Debug: Log your showtime structure
  React.useEffect(() => {
    if (showtimes.length > 0) {
      console.log("Sample showtime structure:", showtimes[0]);
    }
  }, [showtimes]);

  const handleToggleStatus = async (showtimeId: string, isActive: boolean) => {
    try {
      const verb = isActive ? "Deactivate" : "Activate";
      const message = isActive
        ? "Are you sure you want to deactivate this showtime?"
        : "Are you sure you want to activate this showtime?";
      
      const confirmed = await confirmAction({
        title: `${verb} Showtime?`,
        message,
        confirmText: verb,
        cancelText: "Cancel",
      });
      
      if (!confirmed) return;
      
      const result = await toggleShowtimeStatusOwner(showtimeId, !isActive); 
      console.log(result);
      
      if (result.success) {
        toast.success(
          !isActive
            ? "Showtime activated successfully "
            : "Showtime deactivated successfully "
        );
      } else {
        toast.error(result.message || "Failed to update showtime status");
      }
      onRefresh();
    } catch (error) {
      console.error("Error toggling showtime status:", error);
      toast.error("Something went wrong while updating showtime");
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

  const getMovieName = (movieId: any) => {
    if (typeof movieId === "object" && movieId?.title) return movieId.title;
    return typeof movieId === "string" ? movieId : "Unknown Movie";
  };

  const getTheaterName = (theaterId: any) => {
    if (typeof theaterId === "object" && theaterId?.name) return theaterId.name;
    return typeof theaterId === "string" ? theaterId : "Unknown Theater";
  };

  const getScreenName = (screenId: any) => {
    if (typeof screenId === "object" && screenId?.name) return screenId.name;
    return typeof screenId === "string" ? screenId : "Unknown Screen";
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isShowtimePast = (showtime: IShowtime) => {
    try {
      const showDate = showtime.showDate || showtime.date || showtime.showdate;
      const showTime = showtime.showTime || showtime.time || showtime.showtime;
      if (!showDate) {
        return false;
      }
      let showtimeDateTime;
      if (showTime) {
        const dateStr = new Date(showDate).toISOString().split('T')[0]; // Get YYYY-MM-DD
        showtimeDateTime = new Date(`${dateStr}T${showTime}`);
      } else {
        showtimeDateTime = new Date(showDate);
        showtimeDateTime.setHours(23, 59, 59, 999);
      }

      const now = new Date();
      const isPast = showtimeDateTime < now;
      return isPast;
    } catch (error) {
      console.error("Error checking if showtime is past:", error, showtime);
      return false;
    }
  };

  const groupShowtimesBy = (showtimes: IShowtime[], groupKey: string) => {
    if (groupKey === "none") return { "All Showtimes": showtimes };
    
    return showtimes.reduce((groups, showtime) => {
      let groupValue: string;
      let groupLabel: string;
      
      switch (groupKey) {
        case "theater":
          groupValue = typeof showtime.theaterId === "object" ? showtime.theaterId._id : showtime.theaterId;
          groupLabel = getTheaterName(showtime.theaterId);
          break;
        case "movie":
          groupValue = typeof showtime.movieId === "object" ? showtime.movieId._id : showtime.movieId;
          groupLabel = getMovieName(showtime.movieId);
          break;
        case "screen":
          groupValue = typeof showtime.screenId === "object" ? showtime.screenId._id : showtime.screenId;
          groupLabel = `${getTheaterName(showtime.theaterId)} - ${getScreenName(showtime.screenId)}`;
          break;
        case "date":
          const showDate = showtime.showDate || showtime.date || showtime.showdate;
          groupValue = new Date(showDate).toDateString();
          groupLabel = formatDate(showDate);
          break;
        default:
          groupValue = "default";
          groupLabel = "All Showtimes";
      }
      
      const key = `${groupValue}|${groupLabel}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(showtime);
      return groups;
    }, {} as Record<string, IShowtime[]>);
  };

  const filteredAndSortedShowtimes = showtimes
    .filter((showtime) => {
      // Filter by active/inactive status
      if (filter === "active" && !showtime.isActive) return false;
      if (filter === "inactive" && showtime.isActive) return false;
      
      // Filter by time (past/upcoming) - THIS IS THE KEY PART
      if (timeFilter === "past") {
        const isPast = isShowtimePast(showtime);
        if (!isPast) return false;
      }
      if (timeFilter === "upcoming") {
        const isPast = isShowtimePast(showtime);
        if (isPast) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.showDate || a.date || a.showdate;
        const dateB = b.showDate || b.date || b.showdate;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      if (sortBy === "time") {
        const timeA = a.showTime || a.time || a.showtime || "00:00";
        const timeB = b.showTime || b.time || b.showtime || "00:00";
        return timeA.localeCompare(timeB);
      }
      return 0;
    });

  const groupedShowtimes = groupShowtimesBy(filteredAndSortedShowtimes, groupBy);

  // Debug: Log filtered results
  React.useEffect(() => {
    console.log(`Time filter: ${timeFilter}, Filtered showtimes:`, filteredAndSortedShowtimes.length);
  }, [timeFilter, filteredAndSortedShowtimes]);

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${lexendMedium.className} text-xl text-white`}>
          Showtimes {timeFilter !== "all" && `(${timeFilter})`}
        </h3>
        <ShowtimeFilters
          filter={filter}
          sortBy={sortBy}
          groupBy={groupBy}
          timeFilter={timeFilter}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
          onGroupChange={setGroupBy}
          onTimeFilterChange={setTimeFilter}
        />
      </div>
      
      <ShowtimeGrid
        groupedShowtimes={groupedShowtimes}
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

export default ShowtimeList;
