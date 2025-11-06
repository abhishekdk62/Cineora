"use client";
import React from "react";
import { Edit, Calendar, Clock, MapPin, Film, Monitor, Users, Eye, CircleX, CheckCircle } from "lucide-react";
import { IShowtime } from "./showtime.interfaces";
import { ShowtimeResponseDto } from "@/app/others/dtos";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";

interface ShowtimeCardProps {
  showtime: ShowtimeResponseDto;
  onEdit: (showtime: ShowtimeResponseDto) => void;
  onView: (showtime: ShowtimeResponseDto) => void;
  onToggleStatus: (showtimeId: string, isActive: boolean) => void;

}

const ShowtimeCard: React.FC<ShowtimeCardProps> = ({
  showtimeFilter,
  showtime,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  const isEditable = () => {
    const now = new Date();
    const showDate = new Date(showtime.showDate);
    const [hours, minutes] = showtime.showTime.split(':');
    const showDateTime = new Date(showDate);
    showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (showDateTime < now) {
      return { canEdit: false, reason: "Cannot edit past showtimes" };
    }

    const hasBookings = (showtime.totalSeats - showtime.availableSeats) > 0;
    if (hasBookings) {
      return { canEdit: false, reason: "Cannot edit showtimes with bookings" };
    }

    const hoursUntilShow = (showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilShow < 24) {
      return { canEdit: false, reason: "Cannot edit within 24 hours of showtime" };
    }

    return { canEdit: true, reason: "" };
  };

  const { canEdit, reason } = isEditable();

  const getMovieName = (movieId: string) => {
    if (typeof movieId === "object" && movieId?.title) return movieId.title;
    return typeof movieId === "string" ? movieId : "Unknown Movie";
  };

  const getTheaterName = (theaterId: string) => {
    if (typeof theaterId === "object" && theaterId?.name) return theaterId.name;
    return typeof theaterId === "string" ? theaterId : "Unknown Theater";
  };

  const getScreenName = (screenId: string) => {
    if (typeof screenId === "object" && screenId?.name) return screenId.name;
    return typeof screenId === "string" ? screenId : "Unknown Screen";
  };

  const formatDate = (date: string) => {
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

  return (
    <div
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
          {/* Edit Button - Enabled */}
          {showtimeFilter === 'upcoming' && canEdit && (
            <button
              onClick={() => onEdit(showtime)}
              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
              title="Edit Showtime"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Edit Button - Disabled */}
          {showtimeFilter === 'upcoming' && !canEdit && (
            <div className="relative group">
              <button
                disabled
                className="p-2 text-gray-600 bg-gray-800/50 rounded-lg cursor-not-allowed opacity-50"
              >
                <Edit className="w-4 h-4" />
              </button>
              {/* ✅ Tooltip BELOW button */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2 z-10 whitespace-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                {reason}
              </div>
            </div>
          )}

          {/* View Button */}
          <button
            onClick={() => onView(showtime)}
            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Toggle Status - Enabled */}
          {showtimeFilter === 'upcoming' && canEdit && (
            <button
              onClick={() => onToggleStatus(showtime._id, showtime.isActive)}
              className={`p-2 rounded-lg transition-colors ${showtime.isActive
                  ? "text-red-400 hover:bg-red-500/20"
                  : "text-green-400 hover:bg-green-500/20"
                }`}
              title={showtime.isActive ? "Deactivate Showtime" : "Activate Showtime"}
            >
              {showtime.isActive ? <CircleX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            </button>
          )}

          {/* Toggle Status - Disabled */}
          {showtimeFilter === 'upcoming' && !canEdit && (
            <div className="relative group">
              <button
                disabled
                className="p-2 text-gray-600 bg-gray-800/50 rounded-lg cursor-not-allowed opacity-50"
              >
                {showtime.isActive ? <CircleX className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
              {/* ✅ Tooltip BELOW button */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2 z-10 whitespace-normal">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                {reason}
              </div>
            </div>
          )}
        </div>



      </div>
    </div>
  );
};

export default ShowtimeCard;
