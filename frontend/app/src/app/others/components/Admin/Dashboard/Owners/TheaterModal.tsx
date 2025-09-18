import React from "react";
import { Lexend } from "next/font/google";
import {
  X,
  MapPin,
  Phone,
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Camera,
  Navigation,
  Power,
  ShieldCheck,
  Loader2,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";
import { ITheater, ITheaterModal } from "@/app/others/types";
import toast from "react-hot-toast";
import { confirmAction } from "@/app/others/components/utils/ConfirmDialog";
import {
  rejectTheaterAdmin,
  toggleTheaterStatusAdmin,
  verifyTheaterAdmin,
} from "@/app/others/services/adminServices/theaterServices";
import dynamic from "next/dynamic";
import { AxiosError } from "axios";

const MapLocationPicker = dynamic(() => import('../../../../components/Leaflet/MapLocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800/50 border border-yellow-500/20 rounded-lg flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
  </div>
});

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface TheaterDetailsModalProps {
  theater?: ITheaterModal | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusToggle?: () => Promise<void>;
  onVerifyTheater?: () => Promise<void>;
  onRejectTheater?: () => Promise<void>;
}

const TheaterDetailsModal: React.FC<TheaterDetailsModalProps> = ({
  theater,
  isOpen,
  onClose,
  onStatusToggle,
  onVerifyTheater,
  onRejectTheater
}) => {
  if (!isOpen || !theater) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFacilityIcon = (facility: string) => {
    const facilityLower = facility.toLowerCase();
    if (facilityLower.includes("wifi") || facilityLower.includes("internet"))
      return Wifi;
    if (facilityLower.includes("parking")) return Car;
    if (facilityLower.includes("cafe") || facilityLower.includes("food"))
      return Coffee;
    if (facilityLower.includes("security")) return Shield;
    if (facilityLower.includes("cctv") || facilityLower.includes("camera"))
      return Camera;
    return Star;
  };

  const handleToggleStatus = async () => {
    const isCurrentlyActive = theater.isActive;
    const verb = isCurrentlyActive ? "disable" : "enable";
    const capitalVerb = isCurrentlyActive ? "Disable" : "Enable";

    const confirmed = await confirmAction({
      title: `${capitalVerb} Theater?`,
      message: `Are you sure you want to ${verb} "${theater.name}"?`,
      confirmText: capitalVerb,
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      if (onStatusToggle) {
        await toggleTheaterStatusAdmin(theater._id);
        toast.success(`Theater ${verb}d successfully!`);
        onStatusToggle();
      }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {

      toast.error(error.message || `Failed to ${verb} theater`);
        }
    }
  };

  const handleVerifyTheater = async () => {
    const confirmed = await confirmAction({
      title: "Verify Theater?",
      message: `Are you sure you want to verify "${theater.name}"? This action cannot be undone and will allow the theater to operate fully.`,
      confirmText: "Verify",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      if (onVerifyTheater) {
        await verifyTheaterAdmin(theater._id);
        toast.success("Theater verified successfully!");
        onVerifyTheater();
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError)
      {

        toast.error(error.message || "Failed to verify theater");
      }
    }
  };

  const handleRejectTheater = async () => {
    const confirmed = await confirmAction({
      title: "Reject Theater?",
      message: `Are you sure you want to reject "${theater.name}"?`,
      confirmText: "Reject",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      if (onRejectTheater) {
        await rejectTheaterAdmin(theater._id);
        toast.success("Theater rejected successfully!");
        onRejectTheater();
      }
    } catch (error: unknown) {
      if(error instanceof AxiosError)
      {

        toast.error(error.message || "Failed to reject theater");
      }
    }
  };

  const latitude = theater.location?.coordinates?.[1];
  const longitude = theater.location?.coordinates?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-gray-900/95 border border-yellow-500/30 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-yellow-500/20 bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Building className="text-yellow-400" size={24} />
              </div>
              <div>
                <h2 className={`${lexend.className} text-2xl text-yellow-400 font-medium`}>
                  {theater.name}
                </h2>
                <p className={`${lexendSmall.className} text-gray-300`}>
                  Theater Details & Management
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    {theater.isActive ? (
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <CheckCircle className="text-green-400" size={20} />
                      </div>
                    ) : (
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <XCircle className="text-red-400" size={20} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className={`font-medium ${
                        theater.isActive ? "text-green-400" : "text-red-400"
                      }`}>
                        {theater.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    {theater.isVerified ? (
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <CheckCircle className="text-blue-400" size={20} />
                      </div>
                    ) : (
                      <div className="bg-yellow-500/20 p-2 rounded-lg">
                        <Clock className="text-yellow-400" size={20} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Verification</p>
                      <p className={`font-medium ${
                        theater.isVerified ? "text-blue-400" : "text-yellow-400"
                      }`}>
                        {theater.isVerified ? "Verified" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-500/20 p-2 rounded-lg">
                      <Building className="text-yellow-400" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Screens</p>
                      <p className="font-medium text-white">
                        {theater.screens} {theater.screens === 1 ? "Screen" : "Screens"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-yellow-400" size={20} />
                  <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                    Basic Information
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Address</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {theater.address}
                          </p>
                          <p className={`${lexendSmall.className} text-gray-300`}>
                            {theater.city}, {theater.state} - {theater.pincode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Phone className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Contact Number</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {theater.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Calendar className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Created</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {formatDate(theater.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Last Updated</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {formatDate(theater.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Map Section */}
                {latitude && longitude && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Navigation className="text-yellow-400" size={16} />
                        <p className="text-sm text-gray-400">Location on Map</p>
                      </div>
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                          window.open(url, "_blank");
                        }}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                      >
                        View on Google Maps
                      </button>
                    </div>
                    <div className="border border-yellow-500/20 rounded-lg overflow-hidden">
                      <MapLocationPicker
                        readOnly={true}
                        initialPosition={[latitude, longitude]} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Owner Information */}
              {typeof theater.ownerId === "object" && theater.ownerId && (
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-yellow-400" size={20} />
                    <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                      Owner Information
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Owner Name</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {theater.ownerId.ownerName}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="text-gray-400" size={16} />
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Owner Email</p>
                          <p className={`${lexendSmall.className} text-white font-medium`}>
                            {theater.ownerId.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Facilities Section */}
              <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-yellow-400" size={20} />
                  <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                    Facilities & Amenities
                  </h3>
                </div>
                
                {theater.facilities && theater.facilities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {theater.facilities.map((facility, index) => {
                      const FacilityIcon = getFacilityIcon(facility);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-yellow-500/10 hover:border-yellow-500/20 transition-all duration-200"
                        >
                          <div className="bg-yellow-500/20 p-1.5 rounded">
                            <FacilityIcon className="text-yellow-400 flex-shrink-0" size={14} />
                          </div>
                          <span className={`${lexendSmall.className} text-gray-300`}>
                            {facility}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-700/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Building className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-400">No facilities information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-yellow-500/20 bg-gray-800/30">
            <div className="flex items-center gap-3">
              {/* Verification Actions */}
              {!theater.isVerified && (
                <>
                  <button
                    onClick={handleVerifyTheater}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    <ShieldCheck size={16} />
                    Verify Theater
                  </button>
                  
                  <button
                    onClick={handleRejectTheater}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    <XCircle size={16} />
                    Reject Theater
                  </button>
                </>
              )}

              {/* Status Toggle for Verified Theaters */}
              {theater.isVerified && (
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                    theater.isActive
                      ? "bg-red-500 hover:bg-red-400 text-white"
                      : "bg-green-500 hover:bg-green-400 text-white"
                  }`}
                >
                  <Power size={16} />
                  {theater.isActive ? "Disable Theater" : "Enable Theater"}
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterDetailsModal;
