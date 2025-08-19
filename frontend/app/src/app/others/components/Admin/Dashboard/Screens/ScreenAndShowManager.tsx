import React, { useEffect, useState } from "react";
import ScreenList from "./ScreenList";
import ScreenDetailsModal from "./ScreenDetailsModal";
import ShowtimesModal from "../Showtimes/ShowtimesModal";
import { IScreen } from "./inedx";
import { getAllScreensAdmin } from "@/app/others/services/adminServices/screenServices";

export interface ScreenFilters {
  search?: string;
  isActive?: boolean;
  theaterId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const ScreenAndShowManager: React.FC = () => {
  const [screens, setScreens] = useState<IScreen[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<IScreen | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showShowtimesModal, setShowShowtimesModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filters, setFilters] = useState<ScreenFilters>({
    search: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  const fetchScreens = async (page: number, currentFilters: ScreenFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllScreensAdmin(page, currentFilters);

      const total = result.data.totalItems ?? result.data.total ?? 0;

      setScreens(result.data.screens || []);
      setCurrentPage(result.data.currentPage || page);
      setTotalPages(result.data.totalPages || 1);
      setTotalItems(total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load screens");
      setScreens([]);
      setTotalItems(0);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens(currentPage, filters);
  
  }, [filters, currentPage]);

  const handleFiltersChange = (newFilters: ScreenFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (screen: IScreen): void => {
    setSelectedScreen(screen);
    setShowDetailsModal(true);
  };

  const handleViewShowtimes = (screen: IScreen): void => {
    setSelectedScreen(screen);
    setShowShowtimesModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Screen & Showtime Management</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400 mb-4">
          {error}
        </div>
      )}

      <ScreenList
      fetchScreens={fetchScreens}
        screens={screens}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onViewShowtimes={handleViewShowtimes}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
      />

      {showDetailsModal && selectedScreen && (
        <ScreenDetailsModal
          screen={selectedScreen}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedScreen(null);
          }}
        />
      )}

      {showShowtimesModal && selectedScreen && (
        <ShowtimesModal
          screen={selectedScreen}
          onClose={() => {
            setShowShowtimesModal(false);
            setSelectedScreen(null);
          }}
        />
      )}
    </div>
  );
};

export default ScreenAndShowManager;
