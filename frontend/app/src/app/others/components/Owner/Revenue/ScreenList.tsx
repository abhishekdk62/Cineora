"use client";
import React, { useEffect, useState } from 'react';
import { Monitor, ChevronRight, Loader2 } from 'lucide-react';
import { GetScreensByTheaterIdResponseDto } from '@/app/others/dtos';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';
import { getScreensByTheaterId } from '@/app/others/services/ownerServices/screenServices';

// Font variables
const lexendMediumStyle = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface ScreenListProps {
  theaterId: string;
  onScreenSelect: (screen: { id: string; name: string; theaterId: string }) => void;
}

export const ScreenList: React.FC<ScreenListProps> = ({ theaterId, onScreenSelect }) => {
  const [screens, setScreens] = useState<GetScreensByTheaterIdResponseDto['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true);
        const response = await getScreensByTheaterId(theaterId);
        setScreens(response.data);
      } catch (err) {
        console.error('Error fetching screens:', err);
        setError('Failed to load screens');
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, [theaterId]);

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Monitor className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-400" style={lexendSmallStyle}>{error}</p>
        </div>
      </div>
    );
  }

  if (!screens || screens.length === 0) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8 text-center">
        <div className="p-3 bg-gray-500/20 rounded-xl w-fit mx-auto mb-4">
          <Monitor className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-white" style={lexendMediumStyle}>No screens found in this theater</p>
        <p className="text-gray-400 text-sm mt-2" style={lexendSmallStyle}>
          Add screens to this theater to view revenue data
        </p>
      </div>
    );
  }

  return (
    <div>

        <p className="text-2xl p-4 text-white mb-2 flex items-center gap-2" style={lexendMediumStyle}>
        Your Screens :
      </p>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {screens.map((screen) => (
        <button
          key={screen._id}
          onClick={() => onScreenSelect({ 
            id: screen._id, 
            name: screen.name, 
            theaterId: theaterId 
          })}
          className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 text-left group hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all duration-300">
              <Monitor className="w-6 h-6 text-purple-400" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-white text-lg" style={lexendMediumStyle}>
              {screen.name}
            </h3>
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>
              Click to view detailed revenue
            </p>
          </div>
        </button>
      ))}
    </div>
    </div>
  );
};
