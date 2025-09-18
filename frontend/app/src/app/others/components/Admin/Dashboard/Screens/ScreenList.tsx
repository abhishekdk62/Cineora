import React, { useState } from "react";
import ScreenCard from "./ScreenCard";
import ScreenFiltersBar from "./ScreenFiltersBar";
import ScreenPagination from "./ScreenPagination";
import { IScreen } from "./inedx";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import { toggleScreen } from "@/app/others/services/adminServices/screenServices";
import { isatty } from "tty";
import toast from "react-hot-toast";
import { Screen } from "../../../Owner/Showtimes/ScreenSelectionModal";


interface ScreenFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ScreenListProps {
  screens: Screen[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onViewDetails: (screen: Screen) => void;
  onViewShowtimes: (screen: Screen) => void;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: ScreenFilters) => void;
  fetchScreens:(page: number, currentFilters: ScreenFilters)=>void
}

const ScreenList: React.FC<ScreenListProps> = ({
  screens,
  totalItems,
  currentPage,
  totalPages,
  isLoading,
  onViewDetails,
  onViewShowtimes,
  onPageChange,
  onFiltersChange,
  fetchScreens
}) => {
  const [filters, setFilters] = useState<ScreenFilters>({
    search: "",
    sortBy: "name",
    sortOrder: "asc"
  });

  const handleFilterChange = (updated: ScreenFilters) => {
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleToggleScreenStatus = async (screenId: string, isActive: boolean) => {

    let verb = isActive ? 'disable' : 'enable'
    let capitalVerb = verb.toUpperCase()

    const confirmed = await confirmAction({
      title: `${capitalVerb} Owner?`,
      message: `Are you sure you want to ${verb} this screen?`,
      confirmText: capitalVerb,
      cancelText: "Cancel",
    });
    if (!confirmed) return;
    try {
      const data = await toggleScreen(screenId, isActive)
      console.log(data);

      toast.success(`Screen succusfully ${verb}d`)
      fetchScreens(0,{})


    } catch (error) {
      console.log(error);

    }

  }


  const groupedScreens = screens.reduce((acc, screen) => {
    const theater = typeof screen.theaterId === 'object'
      ? screen.theaterId?.name || 'Unknown Theater'
      : 'Unknown Theater';
    if (!acc[theater]) acc[theater] = [];
    acc[theater].push(screen);
    return acc;
  }, {} as Record<string, Screen[]>);

  return (
    <div className="space-y-6">
      <ScreenFiltersBar
        filters={filters}
        totalItems={totalItems}
        onChange={handleFilterChange}
      />
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
          </div>
        ) : Object.keys(groupedScreens).length === 0 ? (
          <div className="text-gray-400 text-center py-8">No screens available.</div>
        ) : (
          Object.entries(groupedScreens).map(([theaterName, theaterScreens]) => (
            <div key={theaterName} className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-gray-600 pb-2">
                {theaterName} ({theaterScreens.length} screens)
              </h3>
              <div className="space-y-3">
                {theaterScreens.map((screen) => (
                  <ScreenCard
                  handleToggleScreenStatus={handleToggleScreenStatus}
                    key={screen._id}
                    screen={screen}
                    onViewDetails={onViewDetails}
                    onViewShowtimes={onViewShowtimes}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <ScreenPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
export default ScreenList;
