"use client";
import React, { useState } from "react";
import { IShowtime } from "./showtime.interfaces";
import { toggleShowtimeStatusOwner } from "@/app/others/services/ownerServices/showtimeServices";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import toast from "react-hot-toast";
import ShowtimeFilters from "./ShowtimeFilters";
import ShowtimeGrid from "./ShowtimeGrid";
import { ShowtimeResponseDto } from "@/app/others/dtos";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";

interface ShowtimeListProps {
  showtimes: ShowtimeResponseDto[];
  onEdit: (showtime: ShowtimeResponseDto) => void;
  onView: (showtime: ShowtimeResponseDto) => void;
  onRefresh: () => void;

}

const ShowtimeList: React.FC<ShowtimeListProps> = ({
  showtimeFilter,
  showtimes,
  onEdit,
  onRefresh,

  onView
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [groupBy, setGroupBy] = useState("none");
  const [timeFilter, setTimeFilter] = useState("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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

  const getMovieName = (movieId: {title:string}) => {
    if (typeof movieId === "object" && movieId?.title) return movieId.title;
    return typeof movieId === "string" ? movieId : "Unknown Movie";
  };

  const getTheaterName = (theaterId: {name:string}) => {
    if (typeof theaterId === "object" && theaterId?.name) return theaterId.name;
    return typeof theaterId === "string" ? theaterId : "Unknown Theater";
  };

  const getScreenName = (screenId: {name:string}) => {
    if (typeof screenId === "object" && screenId?.name) return screenId.name;
    return typeof screenId === "string" ? screenId : "Unknown Screen";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isShowtimePast = (showtime: ShowtimeResponseDto) => {
    try {
      
      const showDate = showtime.showDate 
      const showTime = showtime.showTime 
      if (!showDate) {
        return false;
      }
      let showtimeDateTime;
      if (showTime) {
        const dateStr = new Date(showDate).toISOString().split('T')[0];
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

  const groupShowtimesBy = (showtimes: ShowtimeResponseDto[], groupKey: string) => {
    if (groupKey === "none") return { "All Showtimes": showtimes };
    
    return showtimes.reduce((groups, showtime) => {

          let groupValue: string = "";
    let groupLabel: string = "";

  switch (groupKey) {
  case "theater":
    groupValue = typeof showtime.theaterId === "object" 
      ? (showtime.theaterId as {_id:string})._id 
      : showtime.theaterId;
    groupLabel = getTheaterName(showtime.theaterId);
    break;
  case "movie":
    groupValue = typeof showtime.movieId === "object" 
      ? (showtime.movieId as {_id:string})._id 
      : showtime.movieId;
    groupLabel = getMovieName(showtime.movieId);
    break;
  case "screen":
    groupValue = typeof showtime.screenId === "object" 
      ? (showtime.screenId as {_id:string})._id 
      : showtime.screenId;
    groupLabel = `${getTheaterName(showtime.theaterId)} - ${getScreenName(showtime.screenId)}`;
    break;
}

      
      const key = `${groupValue}|${groupLabel}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(showtime);
      return groups;
    }, {} as Record<string, ShowtimeResponseDto[]>);
  };

  const filteredAndSortedShowtimes = showtimes
    .filter((showtime) => {
      if (filter === "active" && !showtime.isActive) return false;
      if (filter === "inactive" && showtime.isActive) return false;
      
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
        const dateA = a.showDate 
        const dateB = b.showDate 
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      if (sortBy === "time") {
        const timeA = a.showTime 
        const timeB = b.showTime 
        return timeA.localeCompare(timeB);
      }
      return 0;
    });

  const groupedShowtimes = groupShowtimesBy(filteredAndSortedShowtimes, groupBy);

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
      showtimeFilter={showtimeFilter}
        groupedShowtimes={groupedShowtimes}
        groupBy={groupBy}
        collapsedGroups={collapsedGroups}
        onToggleGroupCollapse={toggleGroupCollapse}
        onEdit={onEdit}
        onView={onView}
        onToggleStatus={handleToggleStatus}
     
      />
    </div>
  );
};

export default ShowtimeList;
