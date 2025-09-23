import React from "react";
import { Eye, Play, Pause, Filter } from "lucide-react";
import { Movie } from "./MoviesList";
import { MovieResponseDto } from "@/app/others/dtos";

const lexendMedium = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface MoviesStatsCardsProps {
  allMovies: MovieResponseDto[];
  totalItems: number;
}

const MoviesStatsCards: React.FC<MoviesStatsCardsProps> = ({
  allMovies,
  totalItems,
}) => {
  const statsCards = [
    {
      label: "Total Movies",
      value: allMovies.length,
      icon: Eye,
      color: "text-yellow-400",
      iconColor: "text-yellow-400",
    },
    {
      label: "Active",
      value: allMovies.filter((m) => m.isActive).length,
      icon: Play,
      color: "text-green-400",
      iconColor: "text-green-400",
    },
    {
      label: "Inactive",
      value: allMovies.filter((m) => !m.isActive).length,
      icon: Pause,
      color: "text-red-400",
      iconColor: "text-red-400",
    },
    {
      label: "Search Results",
      value: totalItems,
      icon: Filter,
      color: "text-yellow-400",
      iconColor: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-gray-900/90 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6 hover:border-yellow-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p 
                  className="text-gray-400 text-sm"
                  style={lexendSmallStyle}
                >
                  {card.label}
                </p>
                <p 
                  className={`text-2xl font-bold ${card.color}`}
                  style={lexendMedium}
                >
                  {card.value}
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MoviesStatsCards;
