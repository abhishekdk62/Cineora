"use client"

import React from "react"
import { Lexend } from "next/font/google"
import { Filter } from "lucide-react"

const lexendMedium = Lexend({
  weight: "500",
  subsets: ["latin"],
})

interface TheaterFiltersProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const TheaterFilters: React.FC<TheaterFiltersProps> = ({ 
  selectedFilter, 
  onFilterChange 
}) => {
  const filterOptions = [
    { value: "all", label: "All Theaters" },
    { value: "active", label: "Active Only" },
    { value: "inactive", label: "Inactive Only" }
  ]

  return (
    <div className="flex items-center gap-3">
      <Filter className="w-5 h-5 text-gray-400" />
      <select
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className={`${lexendMedium.className} bg-white/10 border border-gray-500/30 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300`}
      >
        {filterOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-black text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TheaterFilters
