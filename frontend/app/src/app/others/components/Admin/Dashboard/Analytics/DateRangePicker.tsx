// components/admin/analytics/DateRangePicker.tsx
import React from 'react';
import { Calendar, CalendarDays } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = ""
}) => {
  const handleQuickSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onStartDateChange(start.toISOString().split('T')[0]);
    onEndDateChange(end.toISOString().split('T')[0]);
  };

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-yellow-400" />
        <h3 className="text-2xl text-yellow-400 font-medium">Date Range</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            From
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-gray-800/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none w-full transition-all duration-200"
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            To
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-gray-800/50 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none w-full transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => handleQuickSelect(7)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
        >
          Last 7 days
        </button>
        <button
          onClick={() => handleQuickSelect(30)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
        >
          Last 30 days
        </button>
        <button
          onClick={() => handleQuickSelect(90)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
        >
          Last 90 days
        </button>
      </div>
    </div>
  );
};
