"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { X, Building, MapPin, Phone, Hash, ShieldCheck, AlertCircle, Film, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const MapLocationPicker = dynamic(() => import('../../Leaflet/MapLocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
  </div>
});

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "300", subsets: ["latin"] });

interface Theater {
  _id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: { type: "Point"; coordinates: [number, number] };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TheaterViewModalProps {
  theaterData: Theater;
  onClose: () => void;
}

const TheaterViewModal: React.FC<TheaterViewModalProps> = ({ theaterData, onClose }) => {
  const {
    name,
    address,
    city,
    state,
    pincode,
    location,
    phone,
    facilities,
    screens,
    isActive,
    isVerified,
    createdAt,
    updatedAt,
    _id,
  } = theaterData;

  const getStatusLabel = () =>
    isActive ? (
      <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium">
        Active
      </span>
    ) : (
      <span className="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-lg text-xs font-medium">
        Inactive
      </span>
    );

  const getVerifiedLabel = () =>
    isVerified ? (
      <span className="flex items-center gap-1 bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium">
        <ShieldCheck className="w-4 h-4" /> Verified
      </span>
    ) : (
      <span className="flex items-center gap-1 bg-gray-600/20 text-red-400 px-3 py-1 rounded-lg text-xs font-medium">
        <AlertCircle className="w-4 h-4" /> Not Verified
      </span>
    );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-black/90 border border-gray-500/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-500/30">
          <div>
            <h2 className={`${lexendBold.className} text-2xl text-white flex items-center gap-2`}>
              <Building className="w-6 h-6 text-blue-400" /> {name}
            </h2>
            <div className="flex gap-2 mt-2">
              {getStatusLabel()}
              {getVerifiedLabel()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Address + Location */}
          <section>
            <h3 className={`${lexendMedium.className} text-lg text-white mb-2`}>Address & Location</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <span className={`${lexendSmall.className} text-gray-300`}>{address}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs">City</label>
                    <p className="text-white">{city}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">State</label>
                    <p className="text-white">{state}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs">Pincode</label>
                    <p className="text-white">{pincode}</p>
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-xs">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{phone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-500/30 h-60">
                <MapLocationPicker
                  readOnly={true}
                  initialPosition={[
                    location?.coordinates?.[1] || 28.7041,
                    location?.coordinates?.[0] || 77.1025,
                  ]}

                />
              </div>
            </div>
          </section>

          {/* Facilities */}
          <section>
            <h3 className={`${lexendMedium.className} text-lg text-white mb-2 flex items-center gap-2`}>
              <Film className="w-5 h-5 text-blue-400" /> Facilities & Screens
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {facilities.length > 0 ? (
                facilities.map((fac) => (
                  <span
                    key={fac}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                  >
                    {fac}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-xs">None</span>
              )}
            </div>
            <p className="text-gray-300 text-sm">Screens: {screens || "N/A"}</p>
          </section>

          {/* Audit Info */}
          <section>
            <h3 className={`${lexendMedium.className} text-lg text-white mb-2`}>Audit Info</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <label className="text-gray-400 text-xs">Created At</label>
                <p>{new Date(createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-gray-400 text-xs">Last Updated</label>
                <p>{new Date(updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-gray-400 text-xs">Theater ID</label>
                <p>{_id}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-500/30">
          <button
            type="button"
            onClick={onClose}
            className={`${lexendMedium.className} w-full py-3 rounded-xl border border-gray-500/30 text-gray-300 hover:bg-white/10 transition-all`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheaterViewModal;
