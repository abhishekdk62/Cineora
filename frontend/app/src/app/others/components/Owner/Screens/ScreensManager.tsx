import React, { useState, useEffect } from "react";
import {
  Building,
  Plus,
  ArrowLeft,
  Monitor,
  Search,
  Users,
  Grid,
  Power,
} from "lucide-react";
import TheatersList from "./TheatersList";
import ScreensList from "./ScreensList";
import ScreenFormModal from "./ScreenFormModal";
import ScreenViewModal from "./ScreenViewModal";
import { ITheater } from "@/app/others/Types";
import { IScreen } from "@/app/others/Types/screen.types";
import {
  lexendBold,
  lexendMedium,
  lexendSmall,
} from "@/app/others/Utils/fonts";
import { getTheatersByOwnerId } from "@/app/others/services/ownerServices/theaterServices";
import { getScreensStatsOwner } from "@/app/others/services/ownerServices/screenServices";

const ScreenManagement = () => {
  const [selectedTheater, setSelectedTheater] = useState<ITheater | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<IScreen | null>(null);
  const [theaters, setTheaters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshScreens, setRefreshScreens] = useState(0);
  const [screenStats, setScreenStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalSeats: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTheaters();
  }, []);

  useEffect(() => {
    if (selectedTheater) {
      fetchScreenStats();
    }
  }, [selectedTheater, refreshScreens]);

  const fetchTheaters = async () => {
    try {
      setIsLoading(true);
      const data = await getTheatersByOwnerId();
      setTheaters(data.data.theaters || []);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchScreenStats = async () => {
    if (!selectedTheater) return;

    try {
      const data = await getScreensStatsOwner(selectedTheater._id);
      setScreenStats({
        total: data.data.overview.totalScreens,
        active: data.data.overview.inactiveScreens,
        inactive: data.data.overview.inactiveScreens,
        totalSeats: data.data.overview.totalSeats,
      });
    } catch (error) {
      console.error("Error fetching screen stats:", error);
    }
  };

  const handleTheaterSelect = (theater: ITheater) => {
    setSelectedTheater(theater);
  };

  const handleBackToTheaters = () => {
    setSelectedTheater(null);
    setSearchQuery("");
  };

  const handleCreateScreen = () => {
    setShowCreateModal(true);
  };

  const handleEditScreen = (screen: IScreen) => {
    setShowViewModal(false)
    setSelectedScreen(screen);
    setShowEditModal(true);
  };

  const handleViewScreen = (screen: IScreen) => {
    setSelectedScreen(screen);
    setShowViewModal(true);
  };

  const handleRefreshScreens = () => {
    setRefreshScreens((prev) => prev + 1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="space-y-6">
      {!selectedTheater ? (
        <>
          {/* Main Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                className={`${lexendBold.className} text-3xl text-white mb-2`}
              >
                Screen Management
              </h1>
              <p className={`${lexendSmall.className} text-gray-400`}>
                Manage your theater screens and seating configurations
              </p>
            </div>
          </div>

          <TheatersList
            theaters={theaters}
            isLoading={isLoading}
            onTheaterSelect={handleTheaterSelect}
          />
        </>
      ) : (
        <>
          {/* Screen Management Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTheaters}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Theaters
              </button>
              <div>
                <h1
                  className={`${lexendBold.className} text-3xl text-white mb-2`}
                >
                  {selectedTheater.name}
                </h1>
                <p className={`${lexendSmall.className} text-gray-400`}>
                  Manage screens and seating for this theater
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateScreen}
              className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 font-medium`}
            >
              <Plus className="w-5 h-5" />
              Add New Screen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${lexendSmall.className} text-gray-400 text-sm`}
                  >
                    Total Screens
                  </p>
                  <p
                    className={`${lexendBold.className} text-2xl text-white mt-1`}
                  >
                    {screenStats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${lexendSmall.className} text-gray-400 text-sm`}
                  >
                    Active Screens
                  </p>
                  <p
                    className={`${lexendBold.className} text-2xl text-green-400 mt-1`}
                  >
                    {screenStats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Power className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${lexendSmall.className} text-gray-400 text-sm`}
                  >
                    Inactive Screens
                  </p>
                  <p
                    className={`${lexendBold.className} text-2xl text-orange-400 mt-1`}
                  >
                    {screenStats.inactive}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Power className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`${lexendSmall.className} text-gray-400 text-sm`}
                  >
                    Total Seats
                  </p>
                  <p
                    className={`${lexendBold.className} text-2xl text-purple-400 mt-1`}
                  >
                    {screenStats.totalSeats}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search screens by name..."
                  className={`${lexendMedium.className} w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-gray-500/30 rounded-xl">
                  <Grid className="w-4 h-4 text-gray-400" />
                  <span
                    className={`${lexendSmall.className} text-gray-400 text-sm`}
                  >
                    {screenStats.total} screens
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ScreensList
            theater={selectedTheater}
            onEditScreen={handleEditScreen}
            onViewScreen={handleViewScreen}
            refreshTrigger={refreshScreens}
            searchQuery={searchQuery}
          />
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <ScreenFormModal
          theater={selectedTheater}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            handleRefreshScreens();
          }}
          mode="create"
        />
      )}

      {showEditModal && selectedScreen && (
        <ScreenFormModal
          theater={selectedTheater}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            handleRefreshScreens();
          }}
          mode="edit"
          initialData={selectedScreen}
        />
      )}

      {showViewModal && selectedScreen && (
        <ScreenViewModal
          screen={selectedScreen}
          theater={selectedTheater}
          onClose={() => setShowViewModal(false)}
          onEdit={handleEditScreen}
        />
      )}
    </div>
  );
};

export default ScreenManagement;
