import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import ShowtimeLine from "./ShowtimeLine";
import { IScreen } from "../Screens/inedx";
import { IShowtime } from ".";
import { getShowTimeByScreenIdAdmin } from "@/app/others/services/adminServices/showTimeServices";
import ScreenPagination from "../Screens/ScreenPagination";

interface ShowtimesModalProps {
  screen: IScreen;
  onClose: () => void;
}

export interface ShowtimeFilters {
  search?: string;
  showDate?: string;
  isActive?: boolean;
  format?: string;
  language?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ShowtimePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

const ShowtimesModal: React.FC<ShowtimesModalProps> = ({ screen, onClose }) => {
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<ShowtimePagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const [filters, setFilters] = useState<ShowtimeFilters>({
    search: "",
    sortBy: "showDate",
    sortOrder: "asc"
  });

  const fetchShowtimes = async (page: number = 1, currentFilters: ShowtimeFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.pageSize,
        ...currentFilters
      };

      const data = await getShowTimeByScreenIdAdmin(screen._id, params);

      if (data.success && data.data) {
        setShowtimes(data.data.showtimes || []);
        setPagination({
          currentPage: data.data.currentPage || page,
          totalPages: data.data.totalPages || 1,
          totalItems: data.data.total || data.data.totalItems || 0,
          pageSize: data.data.pageSize || 10
        });
      } else {
        setShowtimes([]);
        setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1 }));
      }
    } catch (e) {
      console.log(e);


      setError("Failed to load showtimes.");
      setShowtimes([]);
      setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes(1, filters);
  }, [screen._id]);

  const handleFilterChange = (field: keyof ShowtimeFilters, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchShowtimes(1, updatedFilters);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchShowtimes(page, filters);
  };

  const groupedShowtimes = showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.showDate).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showtime);
    return acc;
  }, {} as Record<string, IShowtime[]>);

  const getTheaterName = () => {
    return typeof screen.theaterId === 'object'
      ? screen.theaterId?.name || 'Unknown Theater'
      : 'Unknown Theater';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-gray-600 w-full max-w-6xl h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div>
            <h2 className="text-2xl text-white font-bold">
              Showtimes - {screen.name}
            </h2>
            <p className="text-gray-400 text-sm">
              Theater: {getTheaterName()} | Total Seats: {screen.totalSeats}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex flex-col lg:flex-row gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by time or format or language"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03]"
              />
            </div>

            {/* Date Filter */}
            <input
              type="date"
              value={filters.showDate || ""}
              onChange={(e) => handleFilterChange("showDate", e.target.value)}
              className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
            />

            {/* Status Filter */}
            <select
              value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
              onChange={(e) => {
                const value = e.target.value === "all" ? undefined : e.target.value === "true";
                handleFilterChange("isActive", value);
              }}
              className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Format Filter */}
            <select
              value={filters.format || "all"}
              onChange={(e) => {
                const value = e.target.value === "all" ? undefined : e.target.value;
                handleFilterChange("format", value);
              }}
              className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03]"
            >
              <option value="all">All Formats</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
              <option value="4DX">4DX</option>
              <option value="Dolby Atmos">Dolby Atmos</option>
            </select>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                handleFilterChange("sortBy", sortBy);
                handleFilterChange("sortOrder", sortOrder as "asc" | "desc");
              }}
              className="bg-[#2a2a2a] border border-gray-500 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-[#e78f03] min-w-[150px]"
            >
              <option value="showDate-asc">Date (Earliest)</option>
              <option value="showDate-desc">Date (Latest)</option>
              <option value="showTime-asc">Time (Earliest)</option>
              <option value="showTime-desc">Time (Latest)</option>
              <option value="availableSeats-desc">Most Available</option>
              <option value="availableSeats-asc">Least Available</option>
            </select>

            <div className="text-sm text-gray-400 whitespace-nowrap">
              {pagination.totalItems} showtimes
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e78f03]"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">{error}</div>
          ) : pagination.totalItems === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No showtimes scheduled for this screen.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => (
                <div key={date} className="space-y-3">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                    {date} ({dateShowtimes.length} shows)
                  </h3>
                  <div className="space-y-2">
                    {dateShowtimes.map((showtime) => (
                      <ShowtimeLine
                      
                      fetchShowtimes={fetchShowtimes}
                      key={showtime._id} showtime={showtime} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Fixed: Use pagination state values */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-600">
            <ScreenPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default ShowtimesModal;
