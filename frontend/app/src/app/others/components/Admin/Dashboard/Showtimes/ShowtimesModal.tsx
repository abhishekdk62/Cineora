
import React, { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { 
  Search, 
  X, 
  Monitor, 
  Users, 
  Calendar, 
  Filter,
  Clock,
} from "lucide-react";
import ShowtimeLine from "./ShowtimeLine";
import { IScreen } from "../Screens/inedx";
import { IShowtime } from ".";
import { getShowTimeByScreenIdAdmin } from "@/app/others/services/adminServices/showTimeServices";
import ScreenPagination from "../Screens/ScreenPagination";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

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
export interface ParamsType{
  page:number;
  currentFilters:ShowtimeFilters;
  limit:number
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

  const handleFilterChange = (field: keyof ShowtimeFilters, value: ShowtimeFilters) => {
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-yellow-500/30 rounded-lg w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gray-800/50">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Monitor className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
                Showtimes - {screen.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                <span>Theater: {getTheaterName()}</span>
                <span>•</span>
                <span>Total Seats: {screen.totalSeats}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800/50 border-b border-yellow-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-yellow-400" size={20} />
            <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
              Filters & Search
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by movie, time, format..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                value={filters.showDate || ""}
                onChange={(e) => handleFilterChange("showDate", e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.isActive === undefined ? "all" : filters.isActive.toString()}
              onChange={(e) => {
                const value = e.target.value === "all" ? undefined : e.target.value === "true";
                handleFilterChange("isActive", value);
              }}
              className="bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
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
              className="bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
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
              className="bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white px-3 py-2 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
            >
              <option value="showDate-asc">Date (Earliest)</option>
              <option value="showDate-desc">Date (Latest)</option>
              <option value="showTime-asc">Time (Earliest)</option>
              <option value="showTime-desc">Time (Latest)</option>
              <option value="availableSeats-desc">Most Available</option>
              <option value="availableSeats-asc">Least Available</option>
            </select>
          </div>

          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-fit">
            <span className="text-yellow-400 font-medium text-sm">
              {pagination.totalItems}
            </span>
            <span className="text-gray-300 text-sm">
              showtimes found
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
              <p className="text-gray-300 text-sm">Loading showtimes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          ) : pagination.totalItems === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-8 max-w-md mx-auto">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Showtimes Found</h3>
                <p className="text-gray-400 text-sm">
                  No showtimes scheduled for this screen match your current filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => (
                <div key={date} className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-yellow-500/20">
                    <Calendar className="text-yellow-400" size={20} />
                    <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                      {date}
                    </h3>
                    <span className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                      {dateShowtimes.length} shows
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dateShowtimes.map((showtime) => (
                      <ShowtimeLine
                        fetchShowtimes={fetchShowtimes}
                        key={showtime._id} 
                        showtime={showtime} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-6 border-t border-yellow-500/20 bg-gray-800/30">
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
