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
const MapLocationPicker = dynamic(() => import('../../../../components/Leaflet/MapLocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
  </div>
});
const lexend = Lexend({
  weight: "400",
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
      message: `Are you sure you want to ${verb} "${theater.name}"? `,
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
    } catch (error: any) {
      toast.error(error.message || `Failed to ${verb} theater`);
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
    } catch (error: any) {
      toast.error(error.message || "Failed to verify theater");
    }
  };
  const handleRejectTheater = async () => {
    const confirmed = await confirmAction({
      title: "Reject Theater?",
      message: `Are you sure you want to reject "${theater.name}"? .`,
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
    } catch (error: any) {
      toast.error(error.message || "Failed to reject theater");
    }
  };

  const latitude = theater.location?.coordinates?.[1];
  const longitude = theater.location?.coordinates?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#1a1a1a] border border-gray-600 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <div className="flex items-center gap-3">
              <Building className="text-[#e78f03]" size={24} />
              <div>
                <h2
                  className={`${lexend.className} text-2xl font-bold text-white`}
                >
                  {theater.name}
                </h2>
                <p className={`${lexendSmall.className} text-gray-400`}>
                  Theater Details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="text-gray-400 hover:text-white" size={20} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    {theater.isActive ? (
                      <CheckCircle className="text-green-400" size={20} />
                    ) : (
                      <XCircle className="text-red-400" size={20} />
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p
                        className={`font-medium ${theater.isActive ? "text-green-400" : "text-red-400"
                          }`}
                      >
                        {theater.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    {theater.isVerified ? (
                      <CheckCircle className="text-blue-400" size={20} />
                    ) : (
                      <Clock className="text-yellow-400" size={20} />
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Verification</p>
                      <p
                        className={`font-medium ${theater.isVerified
                          ? "text-blue-400"
                          : "text-yellow-400"
                          }`}
                      >
                        {theater.isVerified ? "Verified" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <Building className="text-[#e78f03]" size={20} />
                    <div>
                      <p className="text-sm text-gray-400">Screens</p>
                      <p className="font-medium text-white">
                        {theater.screens}{" "}
                        {theater.screens === 1 ? "Screen" : "Screens"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
                <h3
                  className={`${lexend.className} text-lg font-semibold text-white mb-4`}
                >
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className={`${lexendSmall.className} text-white`}>
                          {theater.address}
                        </p>
                        <p className={`${lexendSmall.className} text-gray-300`}>
                          {theater.city}, {theater.state} - {theater.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-400">Contact Number</p>
                        <p className={`${lexendSmall.className} text-white`}>
                          {theater.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {latitude && longitude && (
                      <div className="flex items-start gap-3">
                        <Navigation
                          className="text-gray-400 mt-1 flex-shrink-0"
                          size={16}
                        />

                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Calendar
                        className="text-gray-400 mt-1 flex-shrink-0"
                        size={16}
                      />
                      <div>
                        <p className="text-sm text-gray-400">Created</p>
                        <p className={`${lexendSmall.className} text-white`}>
                          {formatDate(theater.createdAt)}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Last Updated
                        </p>
                        <p className={`${lexendSmall.className} text-gray-300`}>
                          {formatDate(theater.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Location
                  </p>


                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                      window.open(url, "_blank");
                    }}
                    className="mt-2 text-xs text-[#e78f03] hover:text-[#d67e02] underline"
                  >
                    View on Google Maps
                  </button>
                </div>
                <div>
                  <MapLocationPicker

                    readOnly={true}
                    initialPosition={[latitude, longitude]} />
                </div>
              </div>

              {theater.facilities && theater.facilities.length > 0 && (
                <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
                  <h3
                    className={`${lexend.className} text-lg font-semibold text-white mb-4`}
                  >
                    Facilities & Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {theater.facilities.map((facility, index) => {
                      const FacilityIcon = getFacilityIcon(facility);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
                        >
                          <FacilityIcon
                            className="text-[#e78f03] flex-shrink-0"
                            size={16}
                          />
                          <span
                            className={`${lexendSmall.className} text-gray-300`}
                          >
                            {facility}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No facilities message */}
              {(!theater.facilities || theater.facilities.length === 0) && (
                <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
                  <h3
                    className={`${lexend.className} text-lg font-semibold text-white mb-4`}
                  >
                    Facilities & Amenities
                  </h3>
                  <div className="text-center py-6">
                    <Building className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-400">
                      No facilities information available
                    </p>
                  </div>
                </div>
              )}

              {/* System Information */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
                <h3
                  className={`${lexend.className} text-lg font-semibold text-white mb-4`}
                >
                  System Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Theater ID</p>
                    <p
                      className={`${lexendSmall.className} text-gray-300 font-mono text-xs break-all`}
                    >
                      {theater._id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Owner ID</p>
                    <p
                      className={`${lexendSmall.className} text-gray-300 font-mono text-xs break-all`}
                    >
                      {typeof theater.ownerId === "string"
                        ? theater.ownerId
                        : theater.ownerId?._id || "N/A"}
                    </p>
                  </div>

                  {/* Add Owner Details Section if ownerId is populated */}
                  {typeof theater.ownerId === "object" && theater.ownerId && (
                    <>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Owner Name</p>
                        <p className={`${lexendSmall.className} text-gray-300`}>
                          {theater.ownerId.ownerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">
                          Owner Email
                        </p>
                        <p className={`${lexendSmall.className} text-gray-300`}>
                          {theater.ownerId.email}
                        </p>
                      </div>
                    </>
                  )}

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location Type</p>
                    <p className={`${lexendSmall.className} text-gray-300`}>
                      {theater.location?.type || "Not specified"}
                    </p>
                  </div>
                  {theater.__v !== undefined && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Version</p>
                      <p className={`${lexendSmall.className} text-gray-300`}>
                        v{theater.__v}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-600">
            <div className="flex items-center gap-3">
              {/* Toggle Status Button */}
              {theater.isVerified && (
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${theater.isActive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  <Power size={16} />
                  {theater.isActive ? "Disable Theater" : "Enable Theater"}
                </button>
              )}

              {!theater.isVerified && (
                <button
                  onClick={handleVerifyTheater}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ShieldCheck size={16} />
                  Verify Theater
                </button>
              )}

              {!theater.isVerified && (
                <button
                  onClick={handleRejectTheater}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <ShieldCheck size={16} />
                  Reject Theater
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
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
