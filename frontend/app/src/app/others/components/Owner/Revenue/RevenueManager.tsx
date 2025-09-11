// @ts-nocheck
"use client";
import React, { useState } from 'react';

import { DateRangePicker } from './DateRangePicker';
import { ArrowLeft, Filter, DollarSign } from 'lucide-react';
import { lexendBold, lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';
import { TheaterRevenueHeader } from './TheaterRevenueHeader';
import { TheaterList } from './TheaterList';
import { ScreenList } from './ScreenList';
import { ScreenRevenueDetails } from './ScreenRevenueDetails';

// Font variables
const lexendMediumStyle = { fontFamily: 'Lexend', fontWeight: '500' };
const lexendSmallStyle = { fontFamily: 'Lexend', fontWeight: '400' };

interface SelectedTheater { id: string; name: string; }
interface SelectedScreen { id: string; name: string; theaterId: string; }
interface DateRange { startDate: string; endDate: string; }

export const RevenueManager: React.FC = () => {
  const [selectedTheater, setSelectedTheater] = useState<SelectedTheater | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<SelectedScreen | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleTheaterSelect = (theater: SelectedTheater) => {
    setSelectedTheater(theater);
    setSelectedScreen(null);
  };
  const handleScreenSelect = (screen: SelectedScreen) => setSelectedScreen(screen);
  const handleBackToTheaters = () => { setSelectedTheater(null); setSelectedScreen(null); };
  const handleBackToScreens = () => setSelectedScreen(null);
  const handleDateRangeChange = (newDateRange: DateRange) => setDateRange(newDateRange);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="space-y-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl text-white mb-2 flex items-center gap-2" style={lexendMediumStyle}>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              Revenue Management
            </h1>
            <p className="text-gray-400" style={lexendSmallStyle}>
              View earnings, analyze trends and see your theater and screen revenue breakdown.
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
              showFilters
                ? "bg-white/20 text-white border border-white/30"
                : "hover:text-white hover:bg-white/10 text-gray-400 border border-gray-500/30"
            }`}
            style={lexendMediumStyle}
          >
            <Filter className="w-4 h-4" />
            Filter by Date
          </button>
        </div>

        {/* Date Range Filter Bar */}
        {showFilters && (
          <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
            <h3 className="text-xl text-white mb-4" style={lexendMediumStyle}>
              Date Range
            </h3>
            <DateRangePicker onDateRangeChange={handleDateRangeChange} />
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {selectedTheater && (
            <button
              onClick={handleBackToTheaters}
              className="px-4 py-3 rounded-xl transition-all duration-300 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-white/10"
              style={lexendSmallStyle}
            >
              <ArrowLeft className="inline w-4 h-4 mr-1" /> Theaters
            </button>
          )}
          {selectedTheater && (
            <>
              <span className="text-gray-400">/</span>
              <button
                onClick={selectedScreen ? handleBackToScreens : undefined}
                className={`px-4 py-3 rounded-xl transition-all duration-300 ${
                  selectedScreen
                    ? "text-blue-400 hover:bg-white/10"
                    : "text-white"
                }`}
                style={lexendSmallStyle}
              >
                {selectedTheater.name}
              </button>
            </>
          )}
          {selectedScreen && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-white px-4 py-3" style={lexendSmallStyle}>
                {selectedScreen.name}
              </span>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {selectedTheater && !selectedScreen && (
            <TheaterRevenueHeader
              theaterId={selectedTheater.id}
              dateRange={dateRange}
            />
          )}
          {!selectedTheater ? (
            <TheaterList onTheaterSelect={handleTheaterSelect} />
          ) : !selectedScreen ? (
            <ScreenList
              theaterId={selectedTheater.id}
              onScreenSelect={handleScreenSelect}
            />
          ) : (
            <ScreenRevenueDetails
              screenId={selectedScreen.id}
              screenName={selectedScreen.name}
              theaterId={selectedScreen.theaterId}
              dateRange={dateRange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
