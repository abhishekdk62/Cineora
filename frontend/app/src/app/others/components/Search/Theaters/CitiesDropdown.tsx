"use client";

import React from "react";
import { ChevronDown, LucideIcon, MapPin, Navigation } from "lucide-react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

export type LocationOption = {
  value: "current" | "mumbai" | "delhi" | "bangalore" | "chennai" | "hyderabad" | "pune" | "kolkata" | "ahmedabad" | "kochi" | "jaipur"
  label: string;
  coordinates?: [number, number]
  icon: LucideIcon;
}

interface LocationDropdownProps {
  selectedLocation: LocationOption;
  onLocationChange: (location: LocationOption) => void;
}

const locationOptions: LocationOption[] = [
  { 
    value: "current", 
    label: "Current Location", 
    icon: Navigation 
  },
  { 
    value: "mumbai", 
    label: "Mumbai", 
    coordinates: [72.8777, 19.0760], 
    icon: MapPin 
  },
  { 
    value: "delhi", 
    label: "Delhi", 
    coordinates: [77.1025, 28.7041], 
    icon: MapPin 
  },
  { 
    value: "bangalore", 
    label: "Bangalore", 
    coordinates: [77.5946, 12.9716], 
    icon: MapPin 
  },
  { 
    value: "chennai", 
    label: "Chennai", 
    coordinates: [80.2707, 13.0827], 
    icon: MapPin 
  },
  { 
    value: "hyderabad", 
    label: "Hyderabad", 
    coordinates: [78.4867, 17.3850], 
    icon: MapPin 
  },
  { 
    value: "pune", 
    label: "Pune", 
    coordinates: [73.8567, 18.5204], 
    icon: MapPin 
  },
  { 
    value: "kolkata", 
    label: "Kolkata", 
    coordinates: [88.3639, 22.5726], 
    icon: MapPin 
  },
  { 
    value: "ahmedabad", 
    label: "Ahmedabad", 
    coordinates: [72.5714, 23.0225], 
    icon: MapPin 
  },
  { 
    value: "kochi", 
    label: "Kochi", 
    coordinates: [76.2673, 9.9312], 
    icon: MapPin 
  },
  { 
    value: "jaipur", 
    label: "Jaipur", 
    coordinates: [75.7873, 26.9124], 
    icon: MapPin 
  },
]

const LocationDropdown: React.FC<LocationDropdownProps> = ({ selectedLocation, onLocationChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentOption = locationOptions.find(option => option.value === selectedLocation.value);

  return (
    <div className="relative scale-50 sm:scale-100 origin-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${lexendSmall.className} flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 min-w-[120px] justify-between text-sm`}
      >
        <div className="flex items-center gap-1.5">
          {currentOption?.icon && <currentOption.icon className="h-3.5 w-3.5" />}
          <span className="truncate">{currentOption?.label}</span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full mt-1 w-full bg-gray-900/95 border border-white/20 rounded-lg backdrop-blur-sm z-20 overflow-hidden max-h-52 overflow-y-auto">
            {locationOptions.map((option: LocationOption) => (
              <button
                key={option.value}
                onClick={() => {
                  onLocationChange(option);
                  setIsOpen(false);
                }}
                className={`${lexendSmall.className} w-full flex items-center gap-1.5 px-3 py-2 text-left hover:bg-white/10 transition-colors text-sm ${
                  selectedLocation.value === option.value ? 'bg-white/20 text-white' : 'text-gray-300'
                } ${option.value === 'current' ? 'border-b border-white/10' : ''}`}
              >
                {option.icon && <option.icon className="h-3.5 w-3.5" />}
                <span className="truncate">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LocationDropdown;
