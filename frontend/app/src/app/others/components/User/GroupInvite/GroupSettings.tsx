import React from "react";
import { Lexend } from "next/font/google";
import { Settings, Star } from "lucide-react";

const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });

interface GroupSettingsProps {
  onRatingChange: (rating: number | undefined) => void;
  minRating?: number;
}

export const GroupSettings: React.FC<GroupSettingsProps> = ({ 
  onRatingChange, 
  minRating 
}) => {
  return (
    <div className="pt-6 border-t border-gray-600/30">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-white" />
        <h3 className={`${lexendMedium.className} text-white text-lg`}>
          Group Settings
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`${lexendMedium.className} text-white text-sm block mb-2`}>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-400" />
              Minimum Rating Required (Optional)
            </div>
          </label>
          <select
            value={minRating || ''}
            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full bg-black/30 border border-gray-600/30 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          >
            <option value="">Anyone can join</option>
            <option value="3">3.0+ Stars ⭐⭐⭐</option>
            <option value="3.5">3.5+ Stars ⭐⭐⭐✨</option>
            <option value="4">4.0+ Stars ⭐⭐⭐⭐</option>
            <option value="4.5">4.5+ Stars ⭐⭐⭐⭐✨</option>
            <option value="5">5.0 Stars ⭐⭐⭐⭐⭐</option>
          </select>
          <p className={`${lexendSmall.className} text-gray-400 text-xs mt-2`}>
            Only users with this rating or higher can join your group
          </p>
        </div>
      </div>
    </div>
  );
};
