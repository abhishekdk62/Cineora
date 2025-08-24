"use client";

import React from "react";
import { Lexend } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const lexendMedium = Lexend({
    weight: "500",
    subsets: ["latin"],
});

const lexendSmall = Lexend({
    weight: "300",
    subsets: ["latin"],
});

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedFacilities: string[];
    onFacilityChange: (facilities: string[]) => void;
}

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

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    selectedFacilities,
    onFacilityChange,
}) => {
    const handleFacilityToggle = (facility: string) => {
        const updatedFacilities = selectedFacilities.includes(facility)
            ? selectedFacilities.filter((f) => f !== facility)
            : [...selectedFacilities, facility];
        onFacilityChange(updatedFacilities);
    };

    const handleClearAll = () => {
        onFacilityChange([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50  z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* Sidebar - Smooth slide from right */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-80 bg-black backdrop-blur-md border-l border-gray-500/30 z-50"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            duration: 0.4
                        }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
                                <h2 className={`${lexendMedium.className} text-xl text-white`}>
                                    Filter Theaters
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Facilities Section */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`${lexendMedium.className} text-lg text-white`}>
                                            Facilities
                                        </h3>
                                        {selectedFacilities.length > 0 && (
                                            <button
                                                onClick={handleClearAll}
                                                className={`${lexendSmall.className} text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200`}
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {facilityOptions.map((facility) => (
                                            <label
                                                key={facility}
                                                className="flex items-center space-x-3 cursor-pointer group"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFacilities.includes(facility)}
                                                        onChange={() => handleFacilityToggle(facility)}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${selectedFacilities.includes(facility)
                                                            ? "bg-blue-500 border-blue-500"
                                                            : "border-gray-400 group-hover:border-gray-300"
                                                            }`}
                                                    >
                                                        {selectedFacilities.includes(facility) && (
                                                            <svg
                                                                className="w-3 h-3 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`${lexendSmall.className} text-gray-300 group-hover:text-white transition-colors duration-200`}
                                                >
                                                    {facility}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Selected Count */}
                                {selectedFacilities.length > 0 && (
                                    <div className="mt-6 p-4 border-white border bg-white/20 rounded-lg">
                                        <p className={`${lexendSmall.className} text-blue-300`}>
                                            {selectedFacilities.length} filter{selectedFacilities.length !== 1 ? 's' : ''} selected
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-500/30">
                                <button
                                    onClick={onClose}
                                    className={`${lexendMedium.className} w-full px-4 py-3 bg-white text-black border border-black rounded-lg transition-colors duration-200`}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterSidebar;
