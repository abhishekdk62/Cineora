'use client';

import React from 'react';
import { OperationalAnalyticsSection } from './OperationalAnalyticsSection';

const lexendMedium = { fontFamily: 'Lexend', fontSize: '16px' };
const lexendSmall = { fontFamily: 'Lexend', fontSize: '14px' };

interface DateFilter {
  startDate?: string;
  endDate?: string;
  period: 'today' | 'week' | 'month' | 'custom';
}

interface OperationalAnalyticsProps {
  dateFilter: DateFilter;
}

const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({ dateFilter }) => {
  // Convert dateFilter to dateRange format that OperationalAnalyticsSection expects
  const dateRange = {
    startDate: dateFilter.startDate,
    endDate: dateFilter.endDate,
  };

  return (
    <OperationalAnalyticsSection
      dateRange={dateRange}
      lexendMedium={lexendMedium}
      lexendSmall={lexendSmall}
    />
  );
};

export default OperationalAnalytics;
