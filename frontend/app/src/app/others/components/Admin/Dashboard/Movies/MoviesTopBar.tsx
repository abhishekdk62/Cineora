import React from "react"
import { Lexend } from "next/font/google"
import { Film, Clock, Plus } from "lucide-react"

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

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
    <div className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeView === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-yellow-500 text-black font-medium"
                  : "text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 border border-yellow-500/30"
              }`}
            >
              <Icon 
                size={18} 
                className={isActive ? "text-black" : "text-yellow-400"}
              />
              <span style={lexendSmallStyle}>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isActive 
                      ? "bg-black/20 text-black" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                  style={lexendSmallStyle}
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
