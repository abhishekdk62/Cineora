const ADMIN_ANALYTICS_ROUTES = {
  COMPREHENSIVE: '/admin/analytics/comprehensive' as const,
  
  REVENUE: '/admin/analytics/revenue' as const,
  REVENUE_MONTHLY: '/admin/analytics/revenue/monthly' as const,
  REVENUE_DAILY: '/admin/analytics/revenue/daily' as const,
  REVENUE_THEATER_WISE: '/admin/analytics/revenue/theater-wise' as const,
  REVENUE_OWNER_WISE: '/admin/analytics/revenue/owner-wise' as const,
  REVENUE_MOVIE_WISE: '/admin/analytics/revenue/movie-wise' as const,

  PERFORMANCE: '/admin/analytics/performance' as const,
  PERFORMANCE_OCCUPANCY: '/admin/analytics/performance/occupancy' as const,
  PERFORMANCE_TIME_SLOTS: '/admin/analytics/performance/time-slots' as const,

  CUSTOMERS: '/admin/analytics/customers' as const,
  CUSTOMERS_SATISFACTION: '/admin/analytics/customers/satisfaction' as const,

  MOVIES: '/admin/analytics/movies' as const,
  MOVIES_TOP_PERFORMING: '/admin/analytics/movies/top-performing' as const,
  MOVIES_FORMAT_PERFORMANCE: '/admin/analytics/movies/format-performance' as const,

  FINANCIAL: '/admin/analytics/financial' as const,

  GROWTH: '/admin/analytics/growth' as const,

  OPERATIONAL: '/admin/analytics/operational' as const,
} as const;

export default ADMIN_ANALYTICS_ROUTES;
