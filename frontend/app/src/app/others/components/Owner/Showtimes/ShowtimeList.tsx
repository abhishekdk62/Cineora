"use client";

import React, { useState } from "react";
import { Edit, Calendar, Clock, MapPin, Film, Monitor, Users, Eye, ChevronDown, ChevronUp, CircleX, CheckCircle } from "lucide-react";
import { IShowtime } from "./showtime.interfaces";
import { toggleShowtimeStatusOwner } from "@/app/others/services/ownerServices/showtimeServices";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import toast from "react-hot-toast";

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
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

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
          groupValue = new Date(showtime.showDate).toDateString();
          groupLabel = formatDate(showtime.showDate);
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
      if (filter === "active") return showtime.isActive;
      if (filter === "inactive") return !showtime.isActive;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.showDate).getTime() - new Date(b.showDate).getTime();
      }
      if (sortBy === "time") {
        return a.showTime.localeCompare(b.showTime);
      }
      return 0;
    });

  const groupedShowtimes = groupShowtimesBy(filteredAndSortedShowtimes, groupBy);

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderShowtimeCard = (showtime: IShowtime) => (
    <div
      key={showtime._id}
      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 ${showtime.isActive
        ? "border-gray-500/30 hover:border-blue-500/50"
        : "border-red-500/30 opacity-70"
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div
          className={`w-3 h-3 rounded-full mt-2 ${showtime.isActive ? "bg-green-400" : "bg-red-400"
            }`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Movie & Theater Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-blue-400" />
                <span className={`${lexendMedium.className} text-white truncate`}>
                  {getMovieName(showtime.movieId)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className={`${lexendSmall.className} text-sm truncate`}>
                  {getTheaterName(showtime.theaterId)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Monitor className="w-4 h-4" />
                <span className={`${lexendSmall.className} text-sm`}>
                  {getScreenName(showtime.screenId)}
                </span>
              </div>
            </div>

            {/* DateTime & Format */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className={`${lexendMedium.className} text-white`}>
                  {formatDate(showtime.showDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className={`${lexendSmall.className} text-sm`}>
                  {formatTime(showtime.showTime)} - {formatTime(showtime.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
                  {showtime.format}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg">
                  {showtime.language}
                </span>
              </div>
            </div>

            {/* Seats & Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className={`${lexendMedium.className} text-white`}>
                  {showtime.availableSeats}/{showtime.totalSeats} seats
                </span>
              </div>
              <div className="text-gray-400">
                <span className={`${lexendSmall.className} text-sm`}>
                  Booking: {((showtime.totalSeats - showtime.availableSeats) / showtime.totalSeats * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-gray-400">
                <span className={`${lexendSmall.className} text-sm`}>
                  Rows: {showtime.rowPricing?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Row Pricing Summary */}
          {showtime.rowPricing && showtime.rowPricing.length > 0 && (
            <div className="border-t border-gray-500/30 pt-3">
              <div className="flex items-center gap-4 text-sm">
                {showtime.rowPricing.slice(0, 3).map((row, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`${lexendSmall.className} text-gray-400`}>
                      {row.rowLabel}:
                    </span>
                    <span className={`${lexendMedium.className} text-white`}>
                      ₹{row.showtimePrice}
                    </span>
                  </div>
                ))}
                {showtime.rowPricing.length > 3 && (
                  <span className={`${lexendSmall.className} text-gray-500`}>
                    +{showtime.rowPricing.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit(showtime)}
            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
            title="Edit Showtime"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onView(showtime)}
            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>


          <button
            onClick={() => handleToggleStatus(showtime._id, showtime.isActive)}
            className={`p-2 rounded-lg transition-colors ${showtime.isActive
                ? "text-red-400 hover:bg-red-500/20"
                : "text-green-400 hover:bg-green-500/20"
              }`}
            title={showtime.isActive ? "Deactivate Showtime" : "Activate Showtime"}
          >
            {showtime.isActive ? (
              <CircleX className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>

        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${lexendMedium.className} text-xl text-white`}>
          Showtimes
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="none">No Grouping</option>
            <option value="theater">Group by Theater</option>
            <option value="movie">Group by Movie</option>
            <option value="screen">Group by Screen</option>

          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Showtimes</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="time">Sort by Time</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedShowtimes).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className={`${lexendMedium.className} text-gray-400 text-lg mb-2`}>
              No showtimes found
            </p>
            <p className={`${lexendSmall.className} text-gray-500`}>
              Create your first showtime to get started
            </p>
          </div>
        ) : (
          Object.entries(groupedShowtimes).map(([groupKey, groupShowtimes]) => {
            const [, groupLabel] = groupKey.split("|");
            const isCollapsed = collapsedGroups.has(groupKey);

            return (
              <div key={groupKey} className="space-y-4">
                {groupBy !== "none" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className={`${lexendMedium.className} text-lg text-blue-400`}>
                        {groupLabel}
                      </h4>
                      <span className={`${lexendSmall.className} px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg`}>
                        {groupShowtimes.length} show{groupShowtimes.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleGroupCollapse(groupKey)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {!isCollapsed && (
                  <div className="space-y-4">
                    {groupShowtimes.map(renderShowtimeCard)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShowtimeList;
