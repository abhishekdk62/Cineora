import React, { useState } from "react";
import { Lexend } from "next/font/google";
import { Users } from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface CastManagerProps {
  cast: string[];
  onCastChange: (castArray: string[]) => void;
  castError?: string; 
}

const CastManager: React.FC<CastManagerProps> = ({
  cast,
  onCastChange,
  castError, 
}) => {
  const [castInput, setCastInput] = useState(cast.join(", "));

  const handleCastInputChange = (value: string) => {
    setCastInput(value);
    const castArray = value
      .split(",")
      .map((actor) => actor.trim())
      .filter((actor) => actor);
    onCastChange(castArray);
  };

  React.useEffect(() => {
    setCastInput(cast.join(", "));
  }, [cast]);

  return (
    <div className={`bg-[#1a1a1a] border ${
      castError ? 'border-red-400' : 'border-gray-600' 
    } rounded-lg p-4`}>
      <h3 className={`${lexend.className} text-lg text-white mb-4`}>
        Cast <span className="text-red-400">*</span> 
      </h3>
      <div className="space-y-2">
        <label
          className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
        >
          Cast Members (comma-separated)
        </label>
        <textarea
          value={castInput}
          onChange={(e) => handleCastInputChange(e.target.value)} 
          rows={6}
          className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
            castError ? 'border-red-400' : 'border-gray-500' 
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] resize-none`}
          placeholder="Actor 1, Actor 2, Actor 3..."
        />
        {/* 🔥 Add error message display */}
        {castError && (
          <p className="text-red-400 text-sm mt-1">{castError}</p>
        )}
      </div>
      <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
        {cast.map((actor, index) => (
          <div
            key={index}
            className="bg-[#2a2a2a] border border-gray-500 rounded-md p-2 flex items-center gap-2"
          >
            <Users className="h-4 w-4 text-purple-400" />
            <span
              className={`${lexendSmall.className} text-gray-300 text-sm`}
            >
              {actor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastManager;
