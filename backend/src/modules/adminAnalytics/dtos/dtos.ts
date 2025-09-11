import { Types } from "mongoose";

export interface IComprehensiveAnalyticsDTO {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  totalOwners: number;
  totalTheaters: number;
  avgOccupancy: number;
  revenueGrowthRate: number;
  topPerformingTheater: string;
  topPerformingMovie: string;
  platformHealth: {
    paymentSuccessRate: number;
    cancellationRate: number;
    customerSatisfactionScore: number;
  };
}

export interface IRevenueAnalyticsDTO {
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  convenienceFees: number;
  taxes: number;
  platformCommission: number;
  refunds: number;
  netRevenue: number;
  growthRate: number;
}

export interface IMonthlyRevenueDTO {
  trends: Array<{
    month: string;
    revenue: number;
    bookings: number;
    growthRate: number;
  }>;
  totalRevenue: number;
  avgMonthlyRevenue: number;
  bestPerformingMonth: string;
}

export interface IDailyRevenueDTO {
  trends: Array<{
    date: string;
    revenue: number;
    bookings: number;
    occupancy: number;
  }>;
  totalRevenue: number;
  avgDailyRevenue: number;
}

export interface ITheaterRevenueDTO {
  theaters: Array<{
    theaterId: Types.ObjectId;
    theaterName: string;
    location: string;
    revenue: number;
    bookings: number;
    occupancy: number;
    screens: number;
    avgTicketPrice: number;
  }>;
  totalTheaters: number;
  totalRevenue: number;
}

export interface IOwnerRevenueDTO {
  owners: Array<{
    ownerId: Types.ObjectId;
    ownerName: string;
    email: string;
    revenue: number;
    bookings: number;
    theatersCount: number;
    avgOccupancy: number;
    marketShare: number;
  }>;
  totalOwners: number;
  totalRevenue: number;
}

export interface IMovieRevenueDTO {
  movies: Array<{
    movieId: Types.ObjectId;
    movieName: string;
    revenue: number;
    bookings: number;
    avgRating: number;
    format: string;
    language: string;
    screens: number;
  }>;
  totalMovies: number;
  totalRevenue: number;
}

export interface ICustomerInsightsDTO {
  totalCustomers: number;
  newCustomers: number;
  retentionRate: number;
  avgBookingsPerCustomer: number;
  customerLifetimeValue: number;
  segments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  satisfaction: {
    avgRating: number;
    totalReviews: number;
    distribution: Array<{ rating: number; count: number }>;
  };
  demographics: {
    ageGroups: Array<{ range: string; count: number }>;
    locations: Array<{ city: string; count: number }>;
  };
}

export interface IMoviePerformanceDTO {
  topMovies: Array<{
    movieId: Types.ObjectId;
    movieName: string;
    totalBookings: number;
    revenue: number;
    avgRating: number;
    occupancyRate: number;
  }>;
  formatPerformance: Array<{
    format: string;
    bookings: number;
    revenue: number;
    avgOccupancy: number;
  }>;
  languagePerformance: Array<{
    language: string;
    bookings: number;
    revenue: number;
    popularity: number;
  }>;
}

export interface IFinancialKPIsDTO {
  totalRevenue: number;
  platformCommission: number;
  totalRefunds: number;
  totalDiscounts: number;
  convenienceFees: number;
  taxes: number;
  netPlatformRevenue: number;
  avgTicketPrice: number;
  revenuePerCustomer: number;
  monthlyRecurringRevenue: number;
}

export interface IPerformanceMetricsDTO {
  avgOccupancy: number;
  avgTicketPrice: number;
  peakHours: Array<{
    timeSlot: string;
    bookings: number;
    occupancy: number;
  }>;
  weekdayWeekendComparison: {
    weekday: { bookings: number; revenue: number; occupancy: number };
    weekend: { bookings: number; revenue: number; occupancy: number };
  };
  theaterUtilization: number;
  screenEfficiency: number;
}

export interface IGrowthRatesDTO {
  monthlyGrowthRate: number;
  quarterlyGrowthRate: number;
  yearlyGrowthRate: number;
  revenueGrowth: number;
  customerGrowth: number;
  bookingGrowth: number;
  projectedGrowth: {
    nextMonth: number;
    nextQuarter: number;
  };
}

export interface IOperationalAnalyticsDTO {
  platformHealth: {
    systemUptime: number;
    avgResponseTime: number;
    errorRate: number;
  };
  paymentAnalytics: {
    successRate: number;
    failureRate: number;
    avgProcessingTime: number;
    gatewayPerformance: Array<{ gateway: string; successRate: number }>;
  };
  cancellationAnalytics: {
    cancellationRate: number;
    refundAmount: number;
    topCancellationReasons: Array<{ reason: string; count: number }>;
  };
  seasonalTrends: Array<{
    season: string;
    bookings: number;
    revenue: number;
    avgOccupancy: number;
  }>;
}
export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

