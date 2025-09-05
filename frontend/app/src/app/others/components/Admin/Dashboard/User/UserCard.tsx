"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { User, Shield, Mail, Phone, Eye, Ban } from "lucide-react";
import { User as UserType } from "./UserManager";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface UserCardProps {
  user: UserType;
  onViewDetails: (user: UserType) => void;
  onToggleStatus: (user: UserType) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onViewDetails, onToggleStatus }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLastLoginText = (lastLogin?: string) => {
    if (!lastLogin || lastLogin === '0') return "Never logged in";
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Profile Picture */}
          <div className="relative">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border-2 border-gray-600 flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
            )}
            {user.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Shield size={10} className="text-white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`${lexend.className} text-lg font-medium text-white`}>
                {user.name}
              </h3>
              <div className="flex gap-1">
                {user.emailVerified && (
                  <Mail size={14} className="text-green-400" />
                )}
                {user.phoneVerified && (
                  <Phone size={14} className="text-green-400" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="text-gray-300">
                <span className="text-gray-500">Email:</span> {user.email}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Phone:</span> {user.phone}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Joined:</span> {formatDate(user.joinedAt)}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-500">Last Login:</span> {getLastLoginText(user.lastActive)}
              </div>
              {user.gender && (
                <div className="text-gray-300">
                  <span className="text-gray-500">Gender:</span> {user.gender}
                </div>
              )}
              {user.dateOfBirth && (
                <div className="text-gray-300">
                  <span className="text-gray-500">DOB:</span> {formatDate(user.dateOfBirth)}
                </div>
              )}
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive
                    ? "bg-green-900/50 text-green-400 border border-green-500/30"
                    : "bg-red-900/50 text-red-400 border border-red-500/30"
                  }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${user.isVerified
                    ? "bg-blue-900/50 text-blue-400 border border-blue-500/30"
                    : "bg-gray-900/50 text-gray-400 border border-gray-500/30"
                  }`}
              >
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
              {user.bookingHistory && user.bookingHistory.length > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-400 border border-purple-500/30">
                  {user.bookingHistory.length} Bookings
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <button
            onClick={() => onViewDetails(user)}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => onToggleStatus(user)}
            className={`px-3 py-2 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1 ${user.isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
              }`}
          >
            <Ban size={14} />
            {user.isActive ? "Block" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
