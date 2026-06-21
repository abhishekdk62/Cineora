'use client';

import React from 'react';
import { OperationalAnalyticsSection } from './OperationalAnalyticsSection';
import { lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';

interface DateFilter {
  startDate?: string;
  endDate?: string;
  period: 'today' | 'week' | 'month' | 'custom';
}

interface OperationalAnalyticsProps {
  dateFilter: DateFilter;
}

const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({ dateFilter }) => {
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
