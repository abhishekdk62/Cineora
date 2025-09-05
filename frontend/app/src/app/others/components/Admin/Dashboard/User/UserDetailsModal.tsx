"use client";

import React from "react";
import { Lexend } from "next/font/google";
import {
  X,
  User,
  Mail,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Activity,
  Star,
  Globe,
  CheckCircle,
  XCircle,
  Award
} from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});



interface UserDetailsModalProps {
  user: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastActiveText = (lastActive: string) => {
    if (!lastActive) return "Never active";
    const date = new Date(lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Active now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return formatDate(lastActive);
  };

  const getLocationString = (location: { coordinates: [number, number] }) => {
    if (!location?.coordinates) return "Unknown";
    const [lng, lat] = location.coordinates;
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  };

  const getLanguageDisplay = (langCode: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish',
      'fr': 'French'
    };
    return languages[langCode] || langCode.toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className={`${lexend.className} text-2xl font-bold text-white`}>
            User Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-6">
            <div className="relative">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#2a2a2a] border-4 border-gray-600 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
              )}
              {user.isVerified && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                  <Shield size={16} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`${lexend.className} text-3xl font-bold text-white`}>
                  {user.username}
                </h3>
                <div className="flex gap-2">
                  <div className="bg-purple-900/50 text-purple-400 border border-purple-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                    <Award size={12} />
                    <span className="text-xs">{user.xpPoints} XP</span>
                  </div>
                  <div className="bg-blue-900/50 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                    <Globe size={12} />
                    <span className="text-xs">{getLanguageDisplay(user.language)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${user.isActive
                      ? "bg-green-900/50 text-green-400 border border-green-500/30"
                      : "bg-red-900/50 text-red-400 border border-red-500/30"
                    }`}
                >
                  {user.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {user.isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${user.isVerified
                      ? "bg-blue-900/50 text-blue-400 border border-blue-500/30"
                      : "bg-gray-900/50 text-gray-400 border border-gray-500/30"
                    }`}
                >
                  <Shield size={14} />
                  {user.isVerified ? "Verified" : "Unverified"}
                </span>

              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
              <h4 className={`${lexend.className} text-lg font-semibold text-white mb-4 flex items-center gap-2`}>
                <User size={20} className="text-[#e78f03]" />
                Account Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Email:</span>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Username:</span>
                    <p className="text-white">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Auth Provider:</span>
                    <p className="text-white capitalize">{user.authProvider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Language:</span>
                    <p className="text-white">{getLanguageDisplay(user.language)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
              <h4 className={`${lexend.className} text-lg font-semibold text-white mb-4 flex items-center gap-2`}>
                <Activity size={20} className="text-[#e78f03]" />
                Activity Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Joined:</span>
                    <p className="text-white">{formatDate(user.joinedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Last Active:</span>
                    <p className="text-white">{getLastActiveText(user.lastActive)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">Last Updated:</span>
                    <p className="text-white">{formatDateTime(user.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-gray-400" />
                  <div>
                    <span className="text-gray-500 text-sm">XP Points:</span>
                    <p className="text-white font-bold ">{user.xpPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Additional Info */}
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
            <h4 className={`${lexend.className} text-lg font-semibold text-white mb-4 flex items-center gap-2`}>
              <MapPin size={20} className="text-[#e78f03]" />
              Location & Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-sm">Location:</span>
                <a
                  href={`https://www.google.com/maps?q=${user.location.coordinates[1]},${user.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                >
                  View Location on google maps
                </a>

              </div>
              <div>
                <span className="text-gray-500 text-sm">Account Status:</span>
                <p className={`text-sm font-medium ${user.isActive ? "text-green-400" : "text-red-400"
                  }`}>
                  {user.isActive ? "Active Account" : "Inactive Account"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-600 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
