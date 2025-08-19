import React, { useState } from "react";
import { LayoutPreview } from "../../../Owner/Screens/LayoutPreview";
import { IScreen } from "./inedx";

interface ScreenCardProps {
  handleToggleScreenStatus: (screenId: string, isActive: boolean) => void
  screen: IScreen;
  onViewDetails: (screen: IScreen) => void;
  onViewShowtimes: (screen: IScreen) => void;
}

const ScreenCard: React.FC<ScreenCardProps> = ({
  handleToggleScreenStatus,
  screen,
  onViewDetails,
  onViewShowtimes
}) => {
  const [showLayoutPreview, setShowLayoutPreview] = useState(false);

  const getTheaterName = () => {
    return typeof screen.theaterId === 'object'
      ? screen.theaterId?.name || 'Unknown Theater'
      : 'Unknown Theater';
  };

  const getTheaterLocation = () => {
    if (typeof screen.theaterId === 'object' && screen.theaterId?.city) {
      return `${screen.theaterId.city}, ${screen.theaterId.state || ''}`;
    }
    return '';
  };

  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg text-white font-bold">{screen.name}</div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${screen.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
              }`}>
              {screen.isActive ? "Active" : "Disabled"}
            </div>
          </div>

          <div className="text-gray-400 text-sm space-y-1">
            <div>Theater: <span className="text-white">{getTheaterName()}</span></div>
            {getTheaterLocation() && (
              <div>Location: <span className="text-gray-300">{getTheaterLocation()}</span></div>
            )}
            <div>Total Seats: <span className="text-white">{screen.totalSeats}</span></div>
            <div>Layout: <span className="text-white">{screen.layout?.rows || 0} rows × {screen.layout?.seatsPerRow || 0} seats/row</span></div>
            {screen.screenType && (
              <div>Type: <span className="text-white">{screen.screenType}</span></div>
            )}
          </div>

          {screen.features && screen.features.length > 0 && (
            <div className="text-gray-500 text-xs mt-2">
              Features: {screen.features.join(", ")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 md:min-w-[200px]">
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-[#e78f03] hover:bg-[#ffb300] text-black rounded font-medium transition-colors text-sm"
              onClick={() => onViewDetails(screen)}
            >
              View Details
            </button>
            <button
              className="px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded text-white hover:bg-[#3a3a3a] font-medium transition-colors text-sm"
              onClick={() => onViewShowtimes(screen)}
            >
              View Showtimes
            </button>
          </div>

          <div className="flex justify-center gap-2 items-center ">
            {screen.layout?.advancedLayout && (
              <button
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors text-sm"
                onClick={() => setShowLayoutPreview(!showLayoutPreview)}
              >
                {showLayoutPreview ? "Hide Layout" : "Show Layout"}
              </button>
            )}
            <button
              onClick={() => handleToggleScreenStatus(screen._id, screen.isActive)}
              className={`px-2 py-1 rounded-sm ${screen.isActive ? 'bg-red-500 text-white' : 'bg-green-400 text-black'}`}>
              {screen.isActive ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>

      {/* Layout Preview */}
      {showLayoutPreview && screen.layout?.advancedLayout && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <LayoutPreview
            advancedLayoutJSON={screen.layout.advancedLayout}
            maxCols={screen.layout.seatsPerRow || 24}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenCard;
