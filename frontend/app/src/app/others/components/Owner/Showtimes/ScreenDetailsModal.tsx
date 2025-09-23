
"use client";

import React from "react";
import { X, Monitor, Users, MapPin, Calendar, Settings, Layout } from "lucide-react";
import { LayoutPreview } from "../Screens/LayoutPreview";

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
}

interface Layout {
  rows: number;
  seatsPerRow: number;
  advancedLayout: string;
}

interface Screen {
  _id: string;
  name: string;
  theaterId: Theater;
  totalSeats: number;
  layout: Layout;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ScreenDetailsModalProps {
  screen: Screen;
  onSelect: (screen: Screen) => void;
  onClose: () => void;
  lexendMedium: string;
  lexendSmall: string;
}

const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({
  screen,
  onSelect,
  onClose,
  lexendMedium,
  lexendSmall,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaxCols = () => {
    if (!screen.layout.advancedLayout?.rows) return screen.layout.seatsPerRow;
    
    return Math.max(...screen.layout.advancedLayout.rows.map((row: string) => 
      (row.offset || 0) + (row.seats?.length || 0)
    ));
  };
  const hasAisles = () => {
    const aisles = screen.layout.advancedLayout?.aisles;
    return aisles && (
      (aisles.vertical && aisles.vertical.length > 0) || 
      (aisles.horizontal && aisles.horizontal.length > 0)
    );
  };

  const renderLayoutSection = () => {
    if (screen.layout.advancedLayout && screen.layout.advancedLayout.rows) {
      return (
        <div className="mb-6">
          <LayoutPreview
            advancedLayoutJSON={screen.layout.advancedLayout}
            maxCols={getMaxCols()}
            showAisles={hasAisles()} 
          />
        </div>
      );
    }
    
    return (
      <div className="mb-6">
        <h3 className={`${lexendMedium.className} text-white text-lg mb-3 flex items-center gap-2`}>
          <Layout className="w-5 h-5" />
          Basic Layout Configuration
        </h3>
        <div className="p-4 bg-white/5 rounded-xl border border-gray-600/30">
          <div className="text-center">
            <div className="inline-block px-8 py-2 bg-white/10 rounded text-gray-300 text-sm font-medium mb-4">
              SCREEN
            </div>
            <div className="text-gray-400 text-sm">
              {screen.layout.rows} rows × {screen.layout.seatsPerRow} seats per row
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-70 flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-sm border border-gray-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <h2 className={`${lexendMedium.className} text-xl text-white`}>
            Screen Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Screen Header Section */}
            <div className="flex gap-6 mb-6">
              {/* Screen Icon */}
              <div className="w-32 h-32 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-16 h-16 text-purple-400" />
              </div>

              {/* Screen Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className={`${lexendMedium.className} text-3xl text-white mb-2`}>
                      {screen.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        screen.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {screen.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Theater Information */}
                <div className="mb-4 p-4 bg-white/5 rounded-xl border border-gray-600/30">
                  <h3 className={`${lexendMedium.className} text-white text-lg mb-2 flex items-center gap-2`}>
                    <MapPin className="w-5 h-5" />
                    Theater Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                        Theater Name
                      </p>
                      <p className={`${lexendMedium.className} text-white`}>
                        {screen.theaterId.name}
                      </p>
                    </div>
                    <div>
                      <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                        Location
                      </p>
                      <p className={`${lexendMedium.className} text-white`}>
                        {screen.theaterId.city}, {screen.theaterId.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seating Configuration */}
            <div className="mb-6">
              <h3 className={`${lexendMedium.className} text-white text-lg mb-3 flex items-center gap-2`}>
                <Layout className="w-5 h-5" />
                Seating Configuration
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 bg-white/5 border border-gray-600/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className={`${lexendMedium.className} text-white text-xl`}>
                    {screen.totalSeats}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Total Seats
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-gray-600/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Layout className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className={`${lexendMedium.className} text-white text-xl`}>
                    {screen.layout.rows}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Total Rows
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-gray-600/30 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Settings className="w-6 h-6 text-green-400" />
                  </div>
                  <p className={`${lexendMedium.className} text-white text-xl`}>
                    {screen.layout.seatsPerRow}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                    Seats per Row
                  </p>
                </div>
              </div>
            </div>

            {/* Layout Preview Section - Replaces renderAdvancedLayout() */}
            {renderLayoutSection()}

            {/* Features */}
            <div className="mb-6">
              <h3 className={`${lexendMedium.className} text-white text-lg mb-3 flex items-center gap-2`}>
                <Settings className="w-5 h-5" />
                Screen Features
              </h3>
              {screen.features && screen.features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {screen.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-lg border border-blue-500/30"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-700/20 border border-gray-600/30 rounded-lg">
                  <p className={`${lexendSmall.className} text-gray-400 text-center`}>
                    No special features configured for this screen
                  </p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-gray-600/30">
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                  Created Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    {formatDate(screen.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-sm mb-1`}>
                  Last Updated
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    {formatDate(screen.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Select Button */}
        <div className="p-6 border-t border-gray-500/30 bg-black/50">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className={`${lexendMedium.className} px-6 py-3 text-gray-300 hover:text-white transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSelect(screen)}
              className={`${lexendMedium.className} px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2`}
            >
              <Monitor className="w-4 h-4" />
              Select Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetailsModal;
