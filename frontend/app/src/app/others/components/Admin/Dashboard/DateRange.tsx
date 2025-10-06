'use client'
import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  setDateRange: (range: { startDate: string; endDate: string }) => void;
  lexend: any;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, setDateRange, lexend }) => {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange({
      ...dateRange,
      [field]: value
    });
  };

  const clearFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
  };

  const setPresetRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  return (
    <div className="bg-gray-800/50 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className={`${lexend.className} text-lg text-white font-semibold`}>
          Date Range Filter
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Date inputs */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            From:
          </label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
            style={{ fontFamily: lexend.style.fontFamily }}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
            To:
          </label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500/50 focus:outline-none"
            style={{ fontFamily: lexend.style.fontFamily }}
          />
        </div>

        {/* Preset buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setPresetRange(7)}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all duration-300"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setPresetRange(30)}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all duration-300"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setPresetRange(90)}
            className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-all duration-300"
            style={{ fontFamily: lexend.style.fontFamily }}
          >
            Last 3 months
          </button>
        </div>

        <button
          onClick={clearFilters}
          className="px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg text-sm transition-all duration-300"
          style={{ fontFamily: lexend.style.fontFamily }}
        >
          Clear Filters
        </button>
      </div>

      {(dateRange.startDate || dateRange.endDate) && (
        <div className="mt-3 text-sm text-gray-400">
          <span style={{ fontFamily: lexend.style.fontFamily }}>
            Filtering data from {dateRange.startDate || 'beginning'} to {dateRange.endDate || 'now'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
