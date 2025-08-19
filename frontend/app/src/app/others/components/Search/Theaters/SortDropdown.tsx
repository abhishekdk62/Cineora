"use client";

import React from "react";
import { ChevronDown, MapPin, Star } from "lucide-react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

type SortOption = "a-z" | "z-a" | "nearby" | "rating-high" | "rating-low";

interface SortDropdownProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: "nearby" as SortOption, label: "Nearest First", icon: MapPin },
  { value: "a-z" as SortOption, label: "Name (A-Z)", icon: null },
  { value: "z-a" as SortOption, label: "Name (Z-A)", icon: null },
  { value: "rating-high" as SortOption, label: "Highest Rated", icon: Star },
  { value: "rating-low" as SortOption, label: "Lowest Rated", icon: Star },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, onSortChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentOption = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${lexendSmall.className} flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 min-w-[200px] justify-between`}
      >
        <div className="flex items-center gap-2">
          {currentOption?.icon && <currentOption.icon className="h-4 w-4" />}
          <span>Sort by: {currentOption?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full mt-2 w-full bg-gray-900/95 border border-white/20 rounded-lg backdrop-blur-sm z-20 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                className={`${lexendSmall.className} w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                  sortBy === option.value ? 'bg-white/20 text-white' : 'text-gray-300'
                }`}
              >
                {option.icon && <option.icon className="h-4 w-4" />}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;
