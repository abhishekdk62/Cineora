"use client";

import React, { useMemo } from "react";
import { X, Monitor, Users, Calendar, Edit3, MapPin, Star } from "lucide-react";
import { IScreen } from "@/app/others/types/screen.types";
import { ITheater } from "@/app/others/types";
import { Lexend } from "next/font/google";
import { LayoutPreview } from "./LayoutPreview"; // Import the LayoutPreview component

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

interface ScreenViewModalProps {
  screen: IScreen;
  theater: ITheater | null;
  onClose: () => void;
  onEdit: (screen: IScreen) => void;
}

const ScreenViewModal: React.FC<ScreenViewModalProps> = ({
  screen,
  theater,
  onClose,
  onEdit,
}) => {
  const seatTypeStats = useMemo(() => {
    const stats: { [key: string]: { count: number; price: number } } = {};
    
    screen.layout.advancedLayout.rows.forEach((row) => {
      row.seats.forEach((seat) => {
        if (!stats[seat.type]) {
          stats[seat.type] = { count: 0, price: seat.price };
        }
        stats[seat.type].count++;
      });
    });
    
    return stats;
  }, [screen.layout.advancedLayout.rows]);

  // Calculate maxCols for the LayoutPreview component
  const getMaxCols = () => {
    if (!screen.layout.advancedLayout?.rows) return screen.layout.seatsPerRow;
    
    return Math.max(...screen.layout.advancedLayout.rows.map((row: any) => 
      (row.offset || 0) + (row.seats?.length || 0)
    ));
  };

  const getSeatTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vip':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-300';
      case 'premium':
        return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300';
      case 'normal':
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-300';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 pb-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full pb-5 max-w-7xl mx-4 h-[92vh] max-h-[950px] min-h-[700px]">
        <div className="backdrop-blur-sm bg-black/90 rounded-3xl border border-gray-500/30 shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`${lexendBold.className} text-2xl text-white`}>
                    {screen.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className={`${lexendSmall.className} text-gray-400`}>
                      {theater?.name} • {theater?.city}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                screen.isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {screen.isActive ? 'Active' : 'Inactive'}
              </div>
              <div className="text-gray-400 text-sm">
                ID: {screen._id.slice(-8)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Basic Information Cards - Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Basic Information */}
              <div className="bg-white/5 rounded-2xl p-6 border border-gray-500/20">
                <h3 className={`${lexendMedium.className} text-lg text-white mb-4 flex items-center gap-2`}>
                  <Users className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Total Seats
                    </label>
                    <p className={`${lexendMedium.className} text-white text-xl`}>
                      {screen.totalSeats.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Layout
                    </label>
                    <p className={`${lexendMedium.className} text-white`}>
                      {screen.layout.rows} rows × {screen.layout.seatsPerRow} max seats per row
                    </p>
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Screen Type
                    </label>
                    <p className={`${lexendMedium.className} text-white`}>
                      {screen.screenType || 'Standard'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seat Categories */}
              <div className="bg-white/5 rounded-2xl p-6 border border-gray-500/20">
                <h3 className={`${lexendMedium.className} text-lg text-white mb-4 flex items-center gap-2`}>
                  <Star className="w-5 h-5" />
                  Seat Categories
                </h3>
                <div className="space-y-3">
                  {Object.entries(seatTypeStats).map(([type, stats]) => (
                    <div
                      key={type}
                      className={`p-4 rounded-xl border ${getSeatTypeColor(type)}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`${lexendMedium.className} font-medium`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </p>
                          <p className={`${lexendSmall.className} text-sm opacity-80`}>
                            {stats.count} seats
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`${lexendMedium.className} font-medium`}>
                            ₹{stats.price}
                          </p>
                          <p className={`${lexendSmall.className} text-xs opacity-80`}>
                            per seat
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white/5 rounded-2xl p-6 border border-gray-500/20">
                <h3 className={`${lexendMedium.className} text-lg text-white mb-4 flex items-center gap-2`}>
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Created
                    </label>
                    <p className={`${lexendSmall.className} text-white`}>
                      {formatDate(screen.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
                      Last Updated
                    </label>
                    <p className={`${lexendSmall.className} text-white`}>
                      {formatDate(screen.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Layout Visualization using LayoutPreview */}
            <div className="mb-6">
              <LayoutPreview 
                advancedLayoutJSON={screen.layout.advancedLayout}
                maxCols={getMaxCols()}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-500/30">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`${lexendMedium.className} flex-1 py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10 transition-all duration-300 font-medium`}
              >
                Close
              </button>
              <button
                onClick={() => onEdit(screen)}
                className={`${lexendMedium.className} flex-1 bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center justify-center gap-2`}
              >
                <Edit3 className="w-4 h-4" />
                Edit Screen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenViewModal;
