"use client";
import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { lexendSmall } from '@/app/others/Utils/fonts';

interface DateRange {
  startDate: string;
  endDate: string;
}
type PeriodType = 'today' | 'week' | 'month' | 'custom';

interface DateRangePickerProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  defaultPeriod?: PeriodType;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  onDateRangeChange, 
  defaultPeriod = 'today' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriod);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getDateRange = (period: string): DateRange => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    switch (period) {
      case 'today':
        return {
          startDate: formatDate(today),
          endDate: formatDate(today)
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        return {
          startDate: formatDate(weekStart),
          endDate: formatDate(today)
        };
      case 'month':
        const monthStart = new Date(today);
        monthStart.setMonth(today.getMonth() - 1);
        return {
          startDate: formatDate(monthStart),
          endDate: formatDate(today)
        };
      default:
        return {
          startDate: customStartDate,
          endDate: customEndDate
        };
    }
  };

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
    setShowCustomRange(period === 'custom');
    
    if (period !== 'custom') {
      const dateRange = getDateRange(period);
      onDateRangeChange(dateRange);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      onDateRangeChange({
        startDate: customStartDate,
        endDate: customEndDate
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Period Buttons */}
      <div className="flex flex-wrap gap-2">
        {['today', 'week', 'month', 'custom'].map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period as PeriodType)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedPeriod === period
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:border-gray-400/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {period === 'custom' ? 'Custom Range' : period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Custom Date Range Inputs */}
      {showCustomRange && (
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}>
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className={`${lexendSmall.className} text-gray-400 text-sm block mb-2`}>
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleCustomDateChange}
            disabled={!customStartDate || !customEndDate}
            className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Apply Date Range
          </button>
        </div>
      )}
    </div>
  );
};
