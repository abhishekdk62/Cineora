"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Building, MapPin, ChevronRight } from "lucide-react";
import { getTheatersByOwnerId } from "@/app/others/services/ownerServices/theaterServices";

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  isActive: boolean;
  screens: number;
}

interface TheaterSelectionModalProps {
  onSelect: (theater: Theater) => void;
  onClose: () => void;
  lexendMedium: any;
  lexendSmall: any;
}

const TheaterSelectionModal: React.FC<TheaterSelectionModalProps> = ({
  onSelect,
  onClose,
  lexendMedium,
  lexendSmall,
}) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
     const data=await getTheatersByOwnerId({status:'active'})
      setTheaters(data.data.theaters);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTheaters = theaters.filter((theater) =>
    theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theater.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <h2 className={`${lexendMedium.className} text-lg text-white`}>
            Select Theater
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
              placeholder="Search theaters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Theater List */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTheaters.map((theater) => (
                <div
                  key={theater._id}
                  onClick={() => onSelect(theater)}
                  className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-500/30"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      theater.isActive ? "bg-green-500/20" : "bg-orange-500/20"
                    }`}
                  >
                    <Building
                      className={`w-6 h-6 ${
                        theater.isActive ? "text-green-400" : "text-orange-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3
                        className={`${lexendMedium.className} text-white text-lg truncate`}
                      >
                        {theater.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            theater.isActive ? "bg-green-400" : "bg-orange-400"
                          }`}
                        />
                        <span
                          className={`${lexendSmall.className} text-xs ${
                            theater.isActive ? "text-green-400" : "text-orange-400"
                          }`}
                        >
                          {theater.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className={`${lexendSmall.className} text-sm truncate`}>
                        {theater.city}, {theater.state}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`${lexendSmall.className} text-xs text-gray-400`}>
                        Screens
                      </p>
                      <p className={`${lexendMedium.className} text-sm text-white`}>
                        {theater.screens || 0}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))}

              {filteredTheaters.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className={`${lexendSmall.className} text-gray-400`}>
                    No theaters found matching your search.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheaterSelectionModal;
