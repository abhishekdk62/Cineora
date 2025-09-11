// BookingsManager.tsx
"use client";
import React, { useState } from 'react';
import { Lexend } from "next/font/google";
import { 
  ArrowLeft, 
  DollarSign, 
  ChevronRight, 
  Home,
  TrendingUp,
  Users,
  Building,
} from 'lucide-react';
import OwnersList from './OwnersList';
import TheatersList from './TheatersList';
import TheaterAnalytics from './TheaterAnalytics';

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface Owner {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalTheaters?: number;
}

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  screens: number;
  facilities: string[];
  isActive: boolean;
  isVerified: boolean;
}

// Enhanced Breadcrumb Component
const NavigationBreadcrumb: React.FC<{
  items: {
    label: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}> = ({ items }) => {
  return (
    <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-4">
      <div className="flex items-center gap-2 text-sm">
        <div className="bg-yellow-500/20 p-1.5 rounded">
          <Home className="w-3 h-3 text-yellow-400" />
        </div>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={`${lexendSmall.className} transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-gray-800/50 ${
                  item.active 
                    ? 'text-yellow-400 font-medium bg-yellow-500/10 border border-yellow-500/20' 
                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                }`}
              >
                {item.label}
              </button>
            ) : (
              <span className={`${lexendSmall.className} text-white font-medium px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-600/50`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const BookingsManager: React.FC = () => {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);

  const handleOwnerSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    setSelectedTheater(null);
  };

  const handleTheaterSelect = (theater: Theater) => {
    setSelectedTheater(theater);
  };

  const handleBackToOwners = () => {
    setSelectedOwner(null);
    setSelectedTheater(null);
  };

  const handleBackToTheaters = () => {
    setSelectedTheater(null);
  };

  // Get the appropriate icon for the current view
  const getCurrentIcon = () => {
    if (!selectedOwner) return DollarSign;
    if (!selectedTheater) return Building;
    return TrendingUp;
  };

  const CurrentIcon = getCurrentIcon();

  // Breadcrumb items configuration
  const breadcrumbItems = [
    { 
      label: 'Bookings Management', 
      onClick: !selectedOwner ? undefined : handleBackToOwners,
      active: !selectedOwner 
    },
    ...(selectedOwner ? [{ 
      label: selectedOwner.name, 
      onClick: !selectedTheater ? undefined : handleBackToTheaters,
      active: !selectedTheater 
    }] : []),
    ...(selectedTheater ? [{ 
      label: selectedTheater.name,
      active: true 
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {selectedOwner && (
                <button
                  onClick={selectedTheater ? handleBackToTheaters : handleBackToOwners}
                  className="p-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-200 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <CurrentIcon className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h1 className={`${lexend.className} text-3xl text-yellow-400 font-medium flex items-center gap-3`}>
                    {!selectedOwner 
                      ? 'Bookings Management' 
                      : !selectedTheater 
                        ? `${selectedOwner.name}` 
                        : `${selectedTheater.name}`
                    }
                  </h1>
                  <p className={`${lexendSmall.className} text-gray-300 mt-1`}>
                    {!selectedOwner 
                      ? 'View and manage theater bookings and revenue analytics' 
                      : !selectedTheater 
                        ? 'Select a theater to view detailed booking analytics'
                        : 'Theater booking analytics and revenue breakdown'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {selectedTheater && (
              <button
                onClick={handleBackToTheaters}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Theaters
              </button>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-yellow-500/20">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">
                {!selectedOwner ? 'All Owners' : selectedOwner.name}
              </span>
            </div>
            
            {selectedOwner && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Building className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  {!selectedTheater ? 'Theater Selection' : selectedTheater.name}
                </span>
              </div>
            )}
            
            {selectedTheater && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">
                  Analytics View
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Breadcrumb */}
        <NavigationBreadcrumb items={breadcrumbItems} />

        {/* Content Area */}
        <div className="bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
          {!selectedOwner ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-yellow-400" size={20} />
                <h2 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                  Theater Owners
                </h2>
              </div>
              <OwnersList onOwnerSelect={handleOwnerSelect} />
            </>
          ) : !selectedTheater ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Building className="text-yellow-400" size={20} />
                <h2 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                  Theaters - {selectedOwner.name}
                </h2>
              </div>
              <TheatersList
                selectedOwner={selectedOwner} 
                onTheaterSelect={handleTheaterSelect}
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-yellow-400" size={20} />
                <h2 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
                  Analytics - {selectedTheater.name}
                </h2>
              </div>
              <TheaterAnalytics
                selectedTheater={selectedTheater}
                selectedOwner={selectedOwner}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManager;
