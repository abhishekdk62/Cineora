import React from "react";
import { Lexend } from "next/font/google";
import {
  X,
  Monitor,
  Users,
  Grid3X3,
  Settings,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import { IScreen } from "./inedx";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface ScreenDetailsModalProps {
  screen: IScreen;
  onClose: () => void;
}

const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({ screen, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-gray-900/95 border border-yellow-500/30 rounded-lg w-full max-w-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500/20 p-2 rounded-lg">
            <Monitor className="text-yellow-400" size={24} />
          </div>
          <div>
            <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
              Screen Details
            </h2>
            <p className="text-gray-300 text-sm">{screen.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Card */}
        <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${screen.isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {screen.isActive ? (
                <CheckCircle className="text-green-400" size={20} />
              ) : (
                <XCircle className="text-red-400" size={20} />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Screen Status</p>
              <p className={`font-medium ${screen.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {screen.isActive ? "Active" : "Disabled"}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-sm">Screen Name</span>
            </div>
            <p className="text-white font-medium">{screen.name}</p>
          </div>

          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-sm">Total Seats</span>
            </div>
            <p className="text-white font-medium">{screen.totalSeats}</p>
          </div>

          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-sm">Screen Type</span>
            </div>
            <p className="text-white font-medium">{screen.screenType || "Standard"}</p>
          </div>

          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Grid3X3 className="text-yellow-400" size={16} />
              <span className="text-gray-400 text-sm">Layout</span>
            </div>
            <p className="text-white font-medium">
              {screen.layout
                ? `${screen.layout.rows} rows × ${screen.layout.seatsPerRow} seats/row`
                : "Not configured"}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Star className="text-yellow-400" size={16} />
            <span className="text-gray-400 text-sm">Features</span>
          </div>
          {screen.features && screen.features.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {screen.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No special features</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-yellow-500/20 bg-gray-800/30 flex justify-end">
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-all duration-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ScreenDetailsModal;
