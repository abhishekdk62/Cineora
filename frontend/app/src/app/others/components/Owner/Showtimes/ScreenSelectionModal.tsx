// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Monitor, Users, ChevronRight } from "lucide-react";
import { getScreensByTheaterId } from "@/app/others/services/ownerServices/screenServices";
import ScreenDetailsModal from "./ScreenDetailsModal"; 

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

export interface Screen {
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

interface ScreenSelectionModalProps {
  theaterId: string;
  onSelect: (screen: Screen) => void;
  onClose: () => void;
  lexendMedium: string;
  lexendSmall: string;
}

const ScreenSelectionModal: React.FC<ScreenSelectionModalProps> = ({
  theaterId,
  onSelect,
  onClose,
  lexendMedium,
  lexendSmall,
}) => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null); 

  useEffect(() => {
    if (theaterId) {
      fetchScreens();
    }
  }, [theaterId]);

  const fetchScreens = async () => {
    try {
      const result = await getScreensByTheaterId(theaterId);
      console.log(result.data);
      
      setScreens(result.data);
    } catch (error) {
      console.error("Error fetching screens:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScreens = screens.filter((screen) =>
    screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    screen.theaterId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScreenClick = (screen: Screen) => {
    setSelectedScreen(screen);
  };

  const handleFinalSelect = (screen: Screen) => {
    onSelect(screen);
    setSelectedScreen(null);
  };

  const closeDetailsModal = () => {
    setSelectedScreen(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
            <h2 className={`${lexendMedium.className} text-lg text-white`}>
              Select Screen
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-500/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search screens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Screen List */}
          <div className="p-6 overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredScreens.map((screen) => (
                  <div
                    key={screen._id}
                    onClick={() => handleScreenClick(screen)} 
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-500/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-purple-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`${lexendMedium.className} text-white text-lg truncate`}>
                          {screen.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          screen.isActive 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {screen.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className={`${lexendSmall.className} text-sm`}>
                            {screen.totalSeats} seats
                          </span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className={`${lexendSmall.className} text-sm`}>
                          {screen.layout.rows} × {screen.layout.seatsPerRow}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                ))}

                {filteredScreens.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className={`${lexendSmall.className} text-gray-400`}>
                      No screens found matching your search.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screen Details Modal */}
      {selectedScreen && (
        <ScreenDetailsModal
          screen={selectedScreen}
          onSelect={handleFinalSelect}
          onClose={closeDetailsModal}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
    </>
  );
};

export default ScreenSelectionModal;
