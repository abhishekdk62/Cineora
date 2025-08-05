import React from "react"
import { Lexend } from "next/font/google"
import { Film, Clock, Plus } from "lucide-react"

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

interface MoviesTopBarProps {
  activeView: "current" | "expired" | "tmdb"
  setActiveView: (view: "current" | "expired" | "tmdb") => void
  currentCount: number
  expiredCount: number
}

const MoviesTopBar: React.FC<MoviesTopBarProps> = ({
  activeView,
  setActiveView,
  currentCount,
  expiredCount,
}) => {
  const tabs = [
    {
      id: "current" as const,
      label: "Current Movies",
      icon: Film,
      count: currentCount,
      color: "text-green-400",
    },
    {
      id: "expired" as const,
      label: "Inactive Movies",
      icon: Clock,
      count: expiredCount,
      color: "text-red-400",
    },
    {
      id: "tmdb" as const,
      label: "Add from TMDB",
      icon: Plus,
      color: "text-blue-400",
    },
  ]

  return (
    <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#e78f03] text-black font-medium shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-[#2a2a2a] border border-gray-500"
              }`}
            >
              <Icon size={16} className={isActive ? "text-black" : tab.color} />
              <span className={`${lexendSmall.className}`}>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`${
                    isActive 
                      ? "bg-black/20 text-black" 
                      : "bg-[#2a2a2a] text-gray-300"
                  } text-xs px-2 py-1 rounded-full ml-1`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MoviesTopBar