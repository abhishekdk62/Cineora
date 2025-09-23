"use client";
import React, { useEffect, useState } from 'react';
import { Building2, ChevronRight, Loader2 } from 'lucide-react';
import { GetTheatersByOwnerIdResponseDto, TheaterFilters } from '@/app/others/dtos';
import { getTheatersByOwnerId } from '@/app/others/services/ownerServices/theaterServices';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';

// Font variables
const lexendMediumStyle = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface TheaterListProps {
  onTheaterSelect: (theater: { id: string; name: string }) => void;
}

export const TheaterList: React.FC<TheaterListProps> = ({ onTheaterSelect }) => {
  const [theaters, setTheaters] = useState<GetTheatersByOwnerIdResponseDto['data']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const filters: TheaterFilters = {};
        const response = await getTheatersByOwnerId(filters);
        console.log(response.data);

        setTheaters(response.data.theaters);
      } catch (err) {
        console.error('Error fetching theaters:', err);
        setError('Failed to load theaters');
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

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
            <Building2 className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-red-400" style={lexendSmallStyle}>{error}</p>
        </div>
      </div>
    );
  }

  if (!theaters || theaters.length === 0) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-8 text-center">
        <div className="p-3 bg-gray-500/20 rounded-xl w-fit mx-auto mb-4">
          <Building2 className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-white" style={lexendMediumStyle}>No theaters found</p>
        <p className="text-gray-400 text-sm mt-2" style={lexendSmallStyle}>
          Add your first theater to start managing revenue
        </p>
      </div>
    );
  }

  return (
    <div>
     <p className="text-2xl p-4 text-white mb-2 flex items-center gap-2" style={lexendMediumStyle}>
        Your Theaters
      </p>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {theaters.map((theater) => (
        <button
          key={theater?._id}
          onClick={() => onTheaterSelect({ id: theater._id, name: theater.name })}
          className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 text-left group hover:bg-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all duration-300">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
          </div>

          <div className="space-y-2">
            <h3 className="text-white text-lg" style={lexendMediumStyle}>
              {theater.name}
            </h3>
            <p className="text-gray-400 text-sm" style={lexendSmallStyle}>
              Click to view revenue details
            </p>
          </div>
        </button>
      ))}
    </div>
    </div>
 
  );
};
