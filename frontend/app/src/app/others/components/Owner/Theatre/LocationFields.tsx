// @ts-nocheck

import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Navigation, Loader2, AlertCircle, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const MapLocationPicker = dynamic(() => import('../../Leaflet/MapLocationPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center">
    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
  </div>
});

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "300", subsets: ["latin"] });

interface LocationFieldsProps {
  formData: {
    location: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  errors: { [key: string]: string };
  updateFormData: (updates: string) => void;
  clearError: (field: string) => void;
}

const LocationFields: React.FC<LocationFieldsProps> = ({
  formData,
  errors,
  updateFormData,
  clearError,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState<"auto" | "map">("map");

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        updateFormData({
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        });
        clearError("location");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please select location on map.");
        setLocationMethod("map");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    updateFormData({
      location: {
        type: "Point",
        coordinates: [lng, lat], 
      },
    });
    clearError("location");
  };

  return (
    <div>
      <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
        Location Coordinates *
      </label>
      
      {/* Location Method Toggle - Only Map and Auto Detect */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setLocationMethod("map")}
          className={`${lexendSmall.className} px-3 py-1 rounded-lg text-xs transition-all duration-200 flex items-center gap-1 ${
            locationMethod === "map"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          <MapPin className="w-3 h-3" />
          Pick on Map
        </button>
        <button
          type="button"
          onClick={() => setLocationMethod("auto")}
          className={`${lexendSmall.className} px-3 py-1 rounded-lg text-xs transition-all duration-200 flex items-center gap-1 ${
            locationMethod === "auto"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          <Navigation className="w-3 h-3" />
          Auto Detect
        </button>
      </div>

      {/* Map Picker (Default) */}
      {locationMethod === "map" && (
        <div className="space-y-3">
          <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
            Click anywhere on the map to select theater location:
          </p>
          <MapLocationPicker
            onLocationSelect={handleMapLocationSelect}
            initialPosition={[
              formData.location.coordinates[1] || 28.7041, 
              formData.location.coordinates[0] || 77.1025  
            ]}
          />
          {(formData.location.coordinates[0] !== 0 || formData.location.coordinates[1] !== 0) && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
              <p className={`${lexendSmall.className} text-green-400 text-xs`}>
                📍 Selected Location: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Auto Detect */}
      {locationMethod === "auto" && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className={`${lexendMedium.className} w-full py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Get Your Current Location
              </>
            )}
          </button>
          {(formData.location.coordinates[0] !== 0 || formData.location.coordinates[1] !== 0) && (
            <p className={`${lexendSmall.className} text-green-400 text-xs`}>
              Location: {formData.location.coordinates[1].toFixed(6)}, {formData.location.coordinates[0].toFixed(6)}
            </p>
          )}
        </div>
      )}
      
      {errors.location && (
        <p className={`${lexendSmall.className} text-red-400 text-xs mt-1 flex items-center gap-1`}>
          <AlertCircle className="w-3 h-3" />
          {errors.location}
        </p>
      )}
    </div>
  );
};

export default LocationFields;
