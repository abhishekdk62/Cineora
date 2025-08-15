import React from 'react';
import { Zap, Settings } from 'lucide-react';
import { Lexend } from "next/font/google";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });

interface SetupModeToggleProps {
  setupMode: 'quickstart' | 'manual';
  setSetupMode: (mode: 'quickstart' | 'manual') => void;
}

export const SetupModeToggle: React.FC<SetupModeToggleProps> = ({
  setupMode,
  setSetupMode
}) => {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="flex bg-white/5 border border-gray-500/30 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setSetupMode('quickstart')}
          className={`${lexendMedium.className} px-6 py-3 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium ${
            setupMode === 'quickstart'
              ? 'bg-white text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          Quick Start
        </button>
        <button
          type="button"
          onClick={() => setSetupMode('manual')}
          className={`${lexendMedium.className} px-6 py-3 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 font-medium ${
            setupMode === 'manual'
              ? 'bg-white text-black'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Custom Setup
        </button>
      </div>
    </div>
  );
};
