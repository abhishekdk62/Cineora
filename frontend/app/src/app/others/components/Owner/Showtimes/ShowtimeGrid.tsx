"use client";
import React from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { IShowtime } from "./showtime.interfaces";
import ShowtimeCard from "./ShowtimeCard";
import { ShowtimeResponseDto } from "@/app/others/dtos";

interface ShowtimeGridProps {
  groupedShowtimes: Record<string, ShowtimeResponseDto[]>;
  groupBy: string;
  collapsedGroups: Set<string>;
  onToggleGroupCollapse: (groupKey: string) => void;
  onEdit: (showtime: ShowtimeResponseDto) => void;
  onView: (showtime: ShowtimeResponseDto) => void;
  onToggleStatus: (showtimeId: string, isActive: boolean) => void;
  lexendMedium: any;
  lexendSmall: any;
}

const ShowtimeGrid: React.FC<ShowtimeGridProps> = ({
  groupedShowtimes,
  groupBy,
  collapsedGroups,
  onToggleGroupCollapse,
  onEdit,
  onView,
  onToggleStatus,
  lexendMedium,
  lexendSmall
}) => {
  if (Object.keys(groupedShowtimes).length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className={`${lexendMedium.className} text-gray-400 text-lg mb-2`}>
          No showtimes found
        </p>
        <p className={`${lexendSmall.className} text-gray-500`}>
          Create your first showtime to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedShowtimes).map(([groupKey, groupShowtimes]) => {
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
                  onClick={() => onToggleGroupCollapse(groupKey)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
              </div>
            )}
            {!isCollapsed && (
              <div className="space-y-4">
                {groupShowtimes.map((showtime) => (
                  <ShowtimeCard
                    key={showtime._id}
                    showtime={showtime}
                    onEdit={onEdit}
                    onView={onView}
                    onToggleStatus={onToggleStatus}
                    lexendMedium={lexendMedium}
                    lexendSmall={lexendSmall}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShowtimeGrid;
