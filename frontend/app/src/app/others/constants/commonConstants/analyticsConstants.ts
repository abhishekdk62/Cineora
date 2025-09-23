const ANALYTICS_ROUTES = {
  COMPREHENSIVE: '/analytics/comprehensive' as const,
  
  REVENUE: '/analytics/revenue' as const,
  REVENUE_MONTHLY: '/analytics/revenue/monthly' as const,
  REVENUE_WEEKLY: '/analytics/revenue/weekly' as const,
  REVENUE_DAILY: '/analytics/revenue/daily' as const,
  REVENUE_THEATER_WISE: '/analytics/revenue/theater-wise' as const,
  REVENUE_SCREEN_WISE: '/analytics/revenue/screen-wise' as const,
  REVENUE_MOVIE_WISE: '/analytics/revenue/movie-wise' as const,
  
  PERFORMANCE: '/analytics/performance' as const,
  PERFORMANCE_OCCUPANCY: '/analytics/performance/occupancy' as const,
  PERFORMANCE_AVG_TICKET_PRICE: '/analytics/performance/avg-ticket-price' as const,
  PERFORMANCE_TIME_SLOTS: '/analytics/performance/time-slots' as const,
  PERFORMANCE_WEEKDAY_WEEKEND: '/analytics/performance/weekday-weekend' as const,
  
  MOVIES: '/analytics/movies' as const,
  MOVIES_TOP_PERFORMING: '/analytics/movies/top-performing' as const,
  MOVIES_FORMAT_PERFORMANCE: '/analytics/movies/format-performance' as const,
  MOVIES_LANGUAGE_PERFORMANCE: '/analytics/movies/language-performance' as const,
  MOVIES_LIFECYCLE: '/analytics/movies/:movieId/lifecycle' as const,
  
  CUSTOMERS: '/analytics/customers' as const,
  CUSTOMERS_SATISFACTION: '/analytics/customers/satisfaction' as const,
  CUSTOMERS_REPEAT_RATE: '/analytics/customers/repeat-rate' as const,
  CUSTOMERS_ADVANCE_BOOKING: '/analytics/customers/advance-booking' as const,
  
  FINANCIAL: '/analytics/financial' as const,
  FINANCIAL_POTENTIAL_VS_ACTUAL: '/analytics/financial/potential-vs-actual' as const,
  FINANCIAL_DYNAMIC_PRICING: '/analytics/financial/dynamic-pricing' as const,
  FINANCIAL_DISCOUNT_IMPACT: '/analytics/financial/discount-impact' as const,
  
  OPERATIONAL: '/analytics/operational' as const,
  OPERATIONAL_LOW_PERFORMING_SLOTS: '/analytics/operational/low-performing-slots' as const,
  OPERATIONAL_REVENUE_GROWTH: '/analytics/operational/revenue-growth' as const,
  
  SUMMARY: '/analytics/summary' as const,
  REPORT: '/analytics/report' as const,
  EXPORT: '/analytics/export' as const,
} as const;

export default ANALYTICS_ROUTES;
export type AnalyticsRoutes = typeof ANALYTICS_ROUTES;
