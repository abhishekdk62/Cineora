"use client";
import React from "react";
import { Edit, Calendar, Clock, MapPin, User, Monitor, Users, Eye, CircleX, CheckCircle, Mail } from "lucide-react";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: {
    _id: string;
    name: string;
    city: string;
    state: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface StaffCardProps {
  staff: StaffMember;
  onEdit: (staff: StaffMember) => void;
  onView: (staff: StaffMember) => void;
  onToggleStatus: (staffId: string, isActive: boolean) => void;
  lexendMedium: any;
  lexendSmall: any;
}

const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  onEdit,
  onView,
  onToggleStatus,
  lexendMedium,
  lexendSmall
}) => {
  const getTheaterName = (theaterId: any) => {
    if (typeof theaterId === "object" && theaterId?.name) return theaterId.name;
    return "Unknown Theater";
  };

  const getTheaterLocation = (theaterId: any) => {
    if (typeof theaterId === "object" && theaterId?.city && theaterId?.state) {
      return `${theaterId.city}, ${theaterId.state}`;
    }
    return "Unknown Location";
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 ${
        staff.isActive
          ? "border-gray-500/30 hover:border-blue-500/50"
          : "border-red-500/30 opacity-70"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div
          className={`w-3 h-3 rounded-full mt-2 ${
            staff.isActive ? "bg-green-400" : "bg-red-400"
          }`}
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Personal Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className={`${lexendMedium.className} text-white truncate`}>
                  {staff.firstName} {staff.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className={`${lexendSmall.className} text-sm truncate`}>
                  {staff.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-lg">
                  {staff.role}
                </span>
              </div>
            </div>
            
            {/* Theater Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-green-400" />
                <span className={`${lexendMedium.className} text-white truncate`}>
                  {staff.theaterId ? getTheaterName(staff.theaterId) : "No Theater"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className={`${lexendSmall.className} text-sm truncate`}>
                  {staff.theaterId ? getTheaterLocation(staff.theaterId) : "No Location"}
                </span>
              </div>
            </div>
            
            {/* Date Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className={`${lexendMedium.className} text-white`}>
                  Joined {formatDate(staff.createdAt)}
                </span>
              </div>
              <div className="text-gray-400">
                <span className={`${lexendSmall.className} text-sm`}>
                  Status: {staff.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
         
          <button
            onClick={() => onView(staff)}
            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(staff._id, staff.isActive)}
            className={`p-2 rounded-lg transition-colors ${
              staff.isActive
                ? "text-red-400 hover:bg-red-500/20"
                : "text-green-400 hover:bg-green-500/20"
            }`}
            title={staff.isActive ? "Deactivate Staff" : "Activate Staff"}
          >
            {staff.isActive ? (
              <CircleX className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;
