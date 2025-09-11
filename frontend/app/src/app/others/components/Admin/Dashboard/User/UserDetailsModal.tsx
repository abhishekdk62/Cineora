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
  Award,
  ExternalLink
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-yellow-500/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <User size={20} className="text-yellow-400" />
            </div>
            <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
              User Details
            </h2>
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
          {/* Profile Section */}
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500/30 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-700/50 border-4 border-yellow-500/30 flex items-center justify-center shadow-lg">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                {user.isVerified && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-gray-900 shadow-lg">
                    <Shield size={16} className="text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`${lexend.className} text-3xl font-medium text-white`}>
                    {user.username}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                    <Award size={14} />
                    <span className="text-sm font-medium">{user.xpPoints} XP</span>
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                    <Globe size={14} />
                    <span className="text-sm font-medium">{getLanguageDisplay(user.language)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      user.isActive
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                      user.isVerified
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    <Shield size={16} />
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
              <h4 className={`${lexend.className} text-lg text-yellow-400 font-medium mb-4 flex items-center gap-2`}>
                <User size={20} />
                Account Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Mail size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Email</span>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <User size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Username</span>
                    <p className="text-white font-medium">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Shield size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Auth Provider</span>
                    <p className="text-white font-medium capitalize">{user.authProvider}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Globe size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Language</span>
                    <p className="text-white font-medium">{getLanguageDisplay(user.language)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
              <h4 className={`${lexend.className} text-lg text-yellow-400 font-medium mb-4 flex items-center gap-2`}>
                <Activity size={20} />
                Activity Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Calendar size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Joined</span>
                    <p className="text-white font-medium">{formatDate(user.joinedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Clock size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Last Active</span>
                    <p className="text-white font-medium">{getLastActiveText(user.lastActive)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Activity size={16} className="text-gray-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">Last Updated</span>
                    <p className="text-white font-medium">{formatDateTime(user.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <Star size={16} className="text-yellow-400 mt-1" />
                  <div>
                    <span className="text-gray-400 text-sm">XP Points</span>
                    <p className="text-yellow-400 font-bold text-lg">{user.xpPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Additional Info */}
          <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
            <h4 className={`${lexend.className} text-lg text-yellow-400 font-medium mb-4 flex items-center gap-2`}>
              <MapPin size={20} />
              Location & Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400 text-sm block mb-2">Location</span>
                <a
                  href={`https://www.google.com/maps?q=${user.location.coordinates[1]},${user.location.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <MapPin size={16} />
                  View on Google Maps
                  <ExternalLink size={14} />
                </a>
                <p className="text-gray-300 text-xs mt-2">
                  {getLocationString(user.location)}
                </p>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400 text-sm block mb-2">Account Status</span>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                  user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {user.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {user.isActive ? "Active Account" : "Inactive Account"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-yellow-500/20 bg-gray-800/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
