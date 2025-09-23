"use client";

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import {
  Building,
  MapPin,
  Phone,
  Power,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  AlertCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { ITheater } from "@/app/others/types";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface TheaterCardProps {
  theater: ITheater;
  onToggleStatus: (theater: ITheater) => void;
  onDelete: (id: string) => void;
  onEdit: (theater: ITheater) => void;
  onView: (theater: ITheater) => void;
  openAddStaffModal: (theater: ITheater) => void;
}

const TheaterCard: React.FC<TheaterCardProps> = ({
  theater,
  onToggleStatus,
  onDelete,
  onEdit,
  onView,
  openAddStaffModal
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleView = () => {
    setShowActions(false);
    onView(theater);
  };

  const handleToggleStatus = () => {
    onToggleStatus(theater);
    setShowActions(false);
  };

  const handleDelete = async () => {
    const confirmed = await confirmAction({
      title: "Delete theater",
      message: "Do you want to permanently delete this theater?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!confirmed) {
      setShowActions(false);
      return
    }
    onDelete(theater._id);
    setShowActions(false);
  };

  const handleEdit = () => {
    onEdit(theater);
    setShowActions(false);
  };



  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-gray-400/50 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${theater.isActive ? "bg-green-500/20" : "bg-orange-500/20"
              }`}
          >
            <Building
              className={`w-6 h-6 ${theater.isActive ? "text-green-400" : "text-orange-400"
                }`}
            />
          </div>
          <div>
            <h3 className={`${lexendMedium.className} text-lg text-white`}>
              {theater.name}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${theater.isActive ? "bg-green-400" : "bg-orange-400"
                  }`}
              />
              <span
                className={`${lexendSmall.className} text-xs ${theater.isActive ? "text-green-400" : "text-orange-400"
                  }`}
              >
                {theater.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`${lexendSmall.className} text-xs flex gap-1 ${theater.isVerified ? "text-green-400" : "text-red-400"
                  }`}
              >
                {theater.isVerified ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}

                {theater.isVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-xl shadow-2xl z-10">
              <div className="p-2">
                <button
                  onClick={handleView}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className={`${lexendSmall.className} text-sm`}>
                    View Details
                  </span>
                </button>

                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                  <Edit className="w-4 h-4 text-green-400" />
                  <span className={`${lexendSmall.className} text-sm`}>
                    Edit Theater
                  </span>
                </button>

                <button
                  onClick={handleToggleStatus}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
                >
                  <Power
                    className={`w-4 h-4 ${theater.isActive ? "text-orange-400" : "text-green-400"
                      }`}
                  />
                  <span className={`${lexendSmall.className} text-sm`}>
                    {theater.isActive ? "Deactivate" : "Activate"}
                  </span>
                </button>
          <button
  onClick={() => openAddStaffModal(theater)} 
  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
>
  <User
    className={`w-4 h-4 ${"text-green-400"}`}
  />
  <span className={`${lexendSmall.className} text-sm`}>
    Add Staff
  </span>
</button>

                <div className="border-t border-gray-500/30 my-2" />

                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className={`${lexendSmall.className} text-sm`}>
                    Delete Theater
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-4">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className={`${lexendSmall.className} text-gray-300 text-sm`}>
            {theater.address}
          </p>
          <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
            {theater.city}, {theater.state}
          </p>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-4 h-4 text-gray-400" />
        <span className={`${lexendSmall.className} text-gray-300 text-sm`}>
          {theater.phone}
        </span>
      </div>

      {/* Facilities */}
      <div className="mb-4">
        <p className={`${lexendSmall.className} text-gray-400 text-xs mb-2`}>
          Facilities:
        </p>
        <div className="flex flex-wrap gap-1">
          {theater.facilities.slice(0, 3).map((facility, index) => (
            <span
              key={index}
              className={`${lexendSmall.className} px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-lg`}
            >
              {facility}
            </span>
          ))}
          {theater.facilities.length > 3 && (
            <span
              className={`${lexendSmall.className} px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-lg`}
            >
              +{theater.facilities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-500/30">
        <div className="text-center">
          <p className={`${lexendSmall.className} text-xs text-gray-400`}>
            Screens
          </p>
          <p className={`${lexendMedium.className} text-sm text-white`}>{theater.screens}</p>
        </div>
        <div className="text-center">
          <p className={`${lexendSmall.className} text-xs text-gray-400`}>
            Shows Today
          </p>
          <p className={`${lexendMedium.className} text-sm text-white`}>12</p>
        </div>
        <div className="text-center">
          <p className={`${lexendSmall.className} text-xs text-gray-400`}>
            Occupancy
          </p>
          <p className={`${lexendMedium.className} text-sm text-green-400`}>
            68%
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-500/30">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={`${lexendSmall.className} text-xs text-gray-400`}>
            Added {formatDate(theater.createdAt)}
          </span>
        </div>

        <button
          className={`${lexendSmall.className} text-xs text-blue-400 hover:text-blue-300 transition-colors`}
        >
          View Analytics
        </button>
      </div>

      {showActions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default TheaterCard;
