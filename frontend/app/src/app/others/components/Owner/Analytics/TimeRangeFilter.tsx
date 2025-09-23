import React, { useState } from 'react';
import { Calendar, ChevronDown, AlertCircle } from 'lucide-react';

interface TimeRangeFilterProps {
  startDate: string;
  endDate: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onTimeframeChange: (timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom') => void;
  lexendMedium: string;
  lexendSmall: string;
}

export const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  startDate,
  endDate,
  timeframe,
  onStartDateChange,
  onEndDateChange,
  onTimeframeChange,
  lexendMedium,
  lexendSmall
}) => {
  const [dateError, setDateError] = useState<string>('');
  const isCustomRange = timeframe === 'custom';

  const handleTimeframeChange = (newTimeframe: string) => {
    setDateError(''); 
    
    if (newTimeframe !== 'custom') {
      const today = new Date();
      let startDate: Date;
      let endDate = today;

      switch (newTimeframe) {
        case 'daily':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'weekly': 
          startDate = new Date(today.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
          break;
        case 'quarterly':
          startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
          break;
        default:
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      onStartDateChange(startDate.toISOString().split('T')[0]);
      onEndDateChange(endDate.toISOString().split('T')[0]);
    }
    
    onTimeframeChange(newTimeframe as string);
  };

  const handleStartDateChange = (date: string) => {
    setDateError('');
    
    if (date && endDate && date > endDate) {
      setDateError('Start date cannot be after end date');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
      setDateError('Start date cannot be in the future');
      return;
    }

    onStartDateChange(date);
    if (timeframe !== 'custom') {
      onTimeframeChange('custom');
    }
  };

  const handleEndDateChange = (date: string) => {
    setDateError('');
    
    if (date && startDate && date < startDate) {
      setDateError('End date cannot be before start date');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
      setDateError('End date cannot be in the future');
      return;
    }

    onEndDateChange(date);
    if (timeframe !== 'custom') {
      onTimeframeChange('custom');
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
            <Calendar className="w-4 h-4" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            disabled={!isCustomRange}
            max={endDate || new Date().toISOString().split('T')[0]} 
            className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border ${
              dateError && dateError.includes('Start') ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 ${
              !isCustomRange ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
            <Calendar className="w-4 h-4" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            disabled={!isCustomRange}
            min={startDate} 
            max={new Date().toISOString().split('T')[0]} 
            className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border ${
              dateError && dateError.includes('End') ? 'border-red-500' : 'border-gray-500/30'
            } rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 ${
              !isCustomRange ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Timeframe */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} text-gray-400 text-sm flex items-center gap-2`}>
            Timeframe
          </label>
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className={`${lexendMedium.className} w-full px-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-white focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 appearance-none`}
            >
              <option value="custom" className="bg-gray-900">Custom Range</option>
              <option value="daily" className="bg-gray-900">Last 7 Days</option>
              <option value="weekly" className="bg-gray-900">Last 4 Weeks</option>
              <option value="monthly" className="bg-gray-900">Last 6 Months</option>
              <option value="quarterly" className="bg-gray-900">Last Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Quick Select - Only show when custom is selected */}
        {isCustomRange && (
          <div className="space-y-2">
            <label className={`${lexendSmall.className} text-gray-400 text-sm`}>
              Quick Select
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setDateError('');
                  const today = new Date();
                  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                  onStartDateChange(lastMonth.toISOString().split('T')[0]);
                  onEndDateChange(today.toISOString().split('T')[0]);
                }}
                className={`${lexendSmall.className} px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white text-xs hover:bg-white/20 transition-all duration-300 text-center`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  setDateError('');
                  const today = new Date();
                  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                  onStartDateChange(lastWeek.toISOString().split('T')[0]);
                  onEndDateChange(today.toISOString().split('T')[0]);
                }}
                className={`${lexendSmall.className} px-3 py-2 bg-white/10 border border-gray-500/30 rounded-lg text-white text-xs hover:bg-white/20 transition-all duration-300 text-center`}
              >
                Last 7 Days
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {dateError && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className={`${lexendSmall.className} text-red-400 text-sm`}>
              {dateError}
            </p>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-500/30">
        <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
          {isCustomRange 
            ? `Custom range: ${startDate} to ${endDate}`
            : `Preset range: ${timeframe} (${startDate} to ${endDate})`
          }
        </p>
      </div>
    </div>
  );
};
