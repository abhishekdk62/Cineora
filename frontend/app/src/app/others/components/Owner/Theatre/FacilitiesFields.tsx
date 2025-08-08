// components/FacilitiesFields.tsx
import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Plus, X } from "lucide-react";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "300", subsets: ["latin"] });

interface FacilitiesFieldsProps {
  facilities: string[];
  updateFacilities: (facilities: string[]) => void;
}

const FacilitiesFields: React.FC<FacilitiesFieldsProps> = ({
  facilities,
  updateFacilities,
}) => {
  const [newFacility, setNewFacility] = useState("");

  const facilityOptions = [
    "3D",
    "IMAX",
    "4DX",
    "Dolby Atmos",
    "Dolby Vision",
    "Parking",
    "Food Court",
    "AC",
    "Recliner Seats",
    "Premium Seating",
    "Wheelchair Access",
    "Online Booking",
  ];

  const handleAddFacility = (facility: string) => {
    if (!facilities.includes(facility)) {
      updateFacilities([...facilities, facility]);
    }
  };

  const handleRemoveFacility = (facility: string) => {
    updateFacilities(facilities.filter((f) => f !== facility));
  };

  const handleAddCustomFacility = () => {
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      updateFacilities([...facilities, newFacility.trim()]);
      setNewFacility("");
    }
  };

  return (
    <div>
      <label className={`${lexendMedium.className} block text-white text-sm mb-2`}>
        Facilities
      </label>

      {/* Quick Add Facilities */}
      <div className="mb-3">
        <p className={`${lexendSmall.className} text-gray-400 text-xs mb-2`}>
          Quick add:
        </p>
        <div className="flex flex-wrap gap-2">
          {facilityOptions.map((facility) => (
            <button
              key={facility}
              type="button"
              onClick={() => handleAddFacility(facility)}
              disabled={facilities.includes(facility)}
              className={`${lexendSmall.className} px-3 py-1 rounded-lg text-xs transition-all duration-200 ${
                facilities.includes(facility)
                  ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {facility}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Facility */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
          placeholder="Add custom facility"
          className={`${lexendSmall.className} flex-1 px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm`}
          onKeyPress={(e) =>
            e.key === "Enter" && (e.preventDefault(), handleAddCustomFacility())
          }
        />
        <button
          type="button"
          onClick={handleAddCustomFacility}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Selected Facilities */}
      {facilities.length > 0 && (
        <div>
          <p className={`${lexendSmall.className} text-gray-400 text-xs mb-2`}>
            Selected facilities:
          </p>
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility) => (
              <span
                key={facility}
                className={`${lexendSmall.className} px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1`}
              >
                {facility}
                <button
                  type="button"
                  onClick={() => handleRemoveFacility(facility)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesFields;
