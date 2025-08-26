// ScreensList.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Monitor, Edit, Eye, Trash2, Power } from "lucide-react";
import { ITheater } from "@/app/others/types";
import { IScreen } from "@/app/others/types/screen.types";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";
import {
  deleteScreenOwner,
  getScreensByTheaterId,
  toggleScreenStatusOwner,
} from "@/app/others/services/ownerServices/screenServices";
import toast from "react-hot-toast";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";

interface ScreensListProps {
  theater: ITheater;
  onEditScreen: (screen: IScreen) => void;
  onViewScreen: (screen: IScreen) => void;
  refreshTrigger: number;
  searchQuery?: string;
}

const ScreensList: React.FC<ScreensListProps> = ({
  theater,
  onEditScreen,
  onViewScreen,
  refreshTrigger,
  searchQuery = "",
}) => {
  const [screens, setScreens] = useState<IScreen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScreens();
  }, [theater._id, refreshTrigger]);

  const fetchScreens = async () => {
    try {
      setIsLoading(true);
      const result = await getScreensByTheaterId(theater._id);
      setScreens(result.data.data);
    } catch (error) {
      console.error("Error fetching screens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredScreens = useMemo(() => {
    if (!searchQuery) return screens;

    return screens.filter((screen) =>
      screen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [screens, searchQuery]);

  const toggleScreenStatus = async (
    screenId: string,
    currentStatus: boolean
  ) => {
    try {
      const verb = currentStatus ? "disable" : "enable";
      const capitalVerb = verb[0].toUpperCase() + verb.slice(1);

      const confirmed = await confirmAction({
        title: `${capitalVerb} Screen?`,
        message: `Are you sure you want to ${verb} this screen?`,
        confirmText: capitalVerb,
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      const result = await toggleScreenStatusOwner(screenId);

      const message = currentStatus
        ? "Screen successfully disabled"
        : "Screen successfully activated";

      fetchScreens();
      toast.success(message);
    } catch (error: any) {
      if (error.response.data.includes("Please enable the theater first")) {
        toast.error(error.response.data);
        return;
      }
      console.error("Error toggling screen status:", error);
      toast.error("Failed to toggle screen status");
    }
  };
  const deleteScreen = async (screenId: string) => {
    try {
      const confirmed = await confirmAction({
        title: "Delete Screen?",
        message:
          "Are you sure you want to delete this screen? This action cannot be undone.",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      if (!confirmed) return;

      const response = await deleteScreenOwner(screenId); // Fixed function name conflict

      toast.success("Screen deleted successfully");
      fetchScreens();
    } catch (error: any) {
      console.error("Error deleting screen:", error);
      toast.error(error.response?.data?.message || "Failed to delete screen");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle empty states with better messaging
  if (screens.length === 0) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
        <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
          No screens found
        </h3>
        <p className={`${lexendSmall.className} text-gray-400`}>
          Add your first screen to get started
        </p>
      </div>
    );
  }

  if (filteredScreens.length === 0 && searchQuery) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
        <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
          No screens match your search
        </h3>
        <p className={`${lexendSmall.className} text-gray-400 mb-4`}>
          No screens found for "{searchQuery}"
        </p>
        <p className={`${lexendSmall.className} text-gray-500 text-sm`}>
          Try adjusting your search terms or browse all {screens.length} screens
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      {/* Search Results Header */}
      {searchQuery && (
        <div className="mb-4 pb-4 border-b border-gray-500/30">
          <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
            Showing {filteredScreens.length} of {screens.length} screens for "
            {searchQuery}"
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filteredScreens.map((screen) => (
          <div
            key={screen._id}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-500/30"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                screen.isActive ? "bg-green-500/20" : "bg-gray-500/20"
              }`}
            >
              <Monitor
                className={`w-6 h-6 ${
                  screen.isActive ? "text-green-400" : "text-gray-400"
                }`}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`${lexendMedium.className} text-white text-lg`}>
                  {/* Highlight search term in screen name */}
                  {searchQuery ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: screen.name.replace(
                          new RegExp(searchQuery, "gi"),
                          `<mark class="bg-yellow-400/30 text-yellow-200 px-1 rounded">$&</mark>`
                        ),
                      }}
                    />
                  ) : (
                    screen.name
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      screen.isActive ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                  <span
                    className={`${lexendSmall.className} text-xs ${
                      screen.isActive ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {screen.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                {screen.totalSeats} seats • {screen.layout.rows} rows ×{" "}
                {screen.layout.seatsPerRow} seats
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewScreen(screen)}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-all"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEditScreen(screen)}
                className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-all"
                title="Edit Screen"
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleScreenStatus(screen._id, screen.isActive)}
                className={`p-2 rounded-lg transition-all ${
                  screen.isActive
                    ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400"
                    : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                }`}
                title={screen.isActive ? "Deactivate" : "Activate"}
              >
                <Power className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteScreen(screen._id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
                title="Delete Screen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom summary when searching */}
      {searchQuery && filteredScreens.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-500/30">
          <p
            className={`${lexendSmall.className} text-gray-500 text-center text-sm`}
          >
            {filteredScreens.length} screen
            {filteredScreens.length !== 1 ? "s" : ""} found
          </p>
        </div>
      )}
    </div>
  );
};

export default ScreensList;
