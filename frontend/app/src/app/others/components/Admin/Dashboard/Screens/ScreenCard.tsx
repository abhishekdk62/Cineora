import React, { useState } from "react";
import { Lexend } from "next/font/google";
import {
  Monitor,
  MapPin,
  Users,
  Grid3X3,
  Settings,
  Calendar,
  Eye,
  EyeOff,
  Power,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { LayoutPreview } from "../../../Owner/Screens/LayoutPreview";
import { IScreen } from "./inedx";
import { Screen } from "../../../Owner/Showtimes/ScreenSelectionModal";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface ScreenCardProps {
  handleToggleScreenStatus: (screenId: string, isActive: boolean) => void
  screen: Screen;
  onViewDetails: (screen: Screen) => void;
  onViewShowtimes: (screen: Screen) => void;
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
  const hasAisles = () => {
    const aisles = screen.layout.advancedLayout?.aisles;
    return aisles && (
      (aisles.vertical && aisles.vertical.length > 0) || 
      (aisles.horizontal && aisles.horizontal.length > 0)
    );
  };
  return (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 hover:bg-gray-700/50 hover:border-yellow-500/30 transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Monitor className="text-yellow-400" size={20} />
            </div>
            <div className="flex-1">
              <h3 className={`${lexend.className} text-xl font-medium text-white mb-1`}>
                {screen.name}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                  screen.isActive
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {screen.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {screen.isActive ? "Active" : "Disabled"}
                </div>
              </div>
            </div>
          </div>

          {/* Theater Information */}
          <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Monitor size={14} className="text-gray-400" />
                <span className="text-gray-400">Theater:</span>
                <span className="text-white font-medium">{getTheaterName()}</span>
              </div>
              
              {getTheaterLocation() && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-gray-400">Location:</span>
                  <span className="text-gray-300">{getTheaterLocation()}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users size={14} className="text-gray-400" />
                <span className="text-gray-400">Total Seats:</span>
                <span className="text-white font-medium">{screen.totalSeats}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Grid3X3 size={14} className="text-gray-400" />
                <span className="text-gray-400">Layout:</span>
                <span className="text-white font-medium">
                  {screen.layout?.rows || 0} rows × {screen.layout?.seatsPerRow || 0} seats/row
                </span>
              </div>
              
            
            </div>
          </div>

          {/* Features */}
          {screen.features && screen.features.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-yellow-400" size={16} />
                <span className="text-gray-400 text-sm">Features</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {screen.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 lg:min-w-[220px]">
          {/* Primary Actions */}
          <div className="flex gap-2">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
              onClick={() => onViewDetails(screen)}
            >
              <Eye size={14} />
              View Details
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 border border-yellow-500/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
              onClick={() => onViewShowtimes(screen)}
            >
              <Calendar size={14} />
              Showtimes
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            {screen.layout?.advancedLayout && (
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                onClick={() => setShowLayoutPreview(!showLayoutPreview)}
              >
                {showLayoutPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showLayoutPreview ? "Hide Layout" : "Show Layout"}
              </button>
            )}
            
            <button
              onClick={() => handleToggleScreenStatus(screen._id, screen.isActive)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                screen.isActive 
                  ? 'bg-red-500 hover:bg-red-400 text-white' 
                  : 'bg-green-500 hover:bg-green-400 text-white'
              }`}
            >
              <Power size={14} />
              {screen.isActive ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </div>
 
      {/* Layout Preview */}
      {showLayoutPreview && screen.layout?.advancedLayout && (
        <div className="mt-6 pt-6 border-t border-yellow-500/20">
          <div className="bg-gray-700/30 rounded-lg p-4 border border-yellow-500/10">
            <div className="flex items-center gap-2 mb-4">
              <Grid3X3 className="text-yellow-400" size={16} />
              <h4 className={`${lexend.className} text-white text-sm font-medium`}>
                Seating Layout Preview
              </h4>
            </div>
            <LayoutPreview
              advancedLayoutJSON={screen.layout.advancedLayout}
              maxCols={screen.layout.seatsPerRow || 24}
                 showAisles={hasAisles()} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenCard;
