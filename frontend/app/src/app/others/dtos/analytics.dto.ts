// dtos/analytics.dto.ts
import { ApiResponse } from './common.dto';

// Date Range Interface
export interface DateRange {
  start: Date;
  end: Date;
}

// Query Parameters
export interface AnalyticsQueryDto {
  startDate?: string;
  endDate?: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  format?: string;
  language?: string;
  limit?: number;
  threshold?: number;
  months?: number;
  weeks?: number;
  days?: number;
  period?: 'monthly' | 'quarterly';
}

// Revenue Analytics DTOs
export interface MonthlyRevenueDto {
  period: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  growthRate?: number;
}

export interface WeeklyRevenueDto {
  period: {
    year: number;
    week: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
}

export interface DailyRevenueDto {
  period: {
    year: number;
    month: number;
    day: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
}

export interface TheaterRevenueDto {
  theaterId: string;
  theaterName: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
}

export interface ScreenRevenueDto {
  screenId: string;
  theaterId: string;
  screenName: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  utilizationRate: number;
}

export interface MovieRevenueDto {
  movieId: string;
  movieTitle: string;
  totalRevenue: number;
  totalBookings: number;
  totalTickets: number;
  avgTicketPrice: number;
  revenueShare: number;
}

// Performance Metrics DTOs
export interface OccupancyDto {
  totalSeatsAvailable: number;
  totalSeatsBooked: number;
  occupancyPercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface TimeSlotDto {
  timeSlot: string;
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
  performance: 'high' | 'medium' | 'low';
}

export interface WeekdayWeekendDto {
  type: 'weekday' | 'weekend';
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  performanceRatio: number;
}

// Movie Analytics DTOs
export interface TopMovieDto {
  movieId: string;
  movieTitle: string;
  totalRevenue: number;
  totalTickets: number;
  totalShows: number;
  avgOccupancy: number;
  rank: number;
}

export interface FormatPerformanceDto {
  format: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
  profitability: 'high' | 'medium' | 'low';
}

export interface LanguagePerformanceDto {
  language: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
  audiencePreference: number;
}

export interface MovieLifecycleDto {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  performanceStage: 'opening' | 'peak' | 'declining' | 'steady';
}

// Customer Insights DTOs
export interface CustomerSatisfactionDto {
  theaterId: string;
  theaterName: string;
  avgRating: number;
  totalReviews: number;
  ratingDistribution: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  };
  satisfactionLevel: 'excellent' | 'good' | 'average' | 'poor';
}

export interface RepeatCustomerDto {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgSpendPerCustomer: number;
  loyaltyScore: number;
}

export interface AdvanceBookingDto {
  category: string;
  count: number;
  totalRevenue: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// Financial KPIs DTOs
export interface PotentialRevenueDto {
  potentialRevenue: number;
  actualRevenue: number;
  realizationPercentage: number;
  missedOpportunity: number;
  efficiency: 'high' | 'medium' | 'low';
}

export interface DynamicPricingDto {
  avgBasePrice: number;
  avgShowtimePrice: number;
  avgFinalPrice: number;
  pricingImpact: number;
  effectiveness: 'positive' | 'neutral' | 'negative';
}

export interface DiscountImpactDto {
  totalSubtotal: number;
  totalDiscount: number;
  totalFinal: number;
  discountPercentage: number;
  bookingsWithDiscount: number;
  totalBookings: number;
  roi: number;
}

// Operational Analytics DTOs
export interface ShowUtilizationDto {
  showtimeId: string;
  totalRevenue: number;
  utilizationRate: number;
  performance: 'excellent' | 'good' | 'poor';
}

export interface GrowthRateDto {
  period: string;
  totalRevenue: number;
  growthRate: number;
  trend: 'positive' | 'negative' | 'stable';
}

// Comprehensive DTOs
export interface RevenueAnalyticsDto {
  monthly: MonthlyRevenueDto[];
  weekly: WeeklyRevenueDto[];
  daily: DailyRevenueDto[];
  theaterWise: TheaterRevenueDto[];
  screenWise: ScreenRevenueDto[];
  movieWise: MovieRevenueDto[];
}

export interface PerformanceMetricsDto {
  occupancy: OccupancyDto;
  avgTicketPrice: number;
  revenuePerScreen: ScreenRevenueDto[];
  revenuePerShow: any[];
  timeSlotPerformance: TimeSlotDto[];
  weekdayWeekendComparison: WeekdayWeekendDto[];
}

export interface MovieAnalyticsDto {
  topMovies: TopMovieDto[];
  formatPerformance: FormatPerformanceDto[];
  languagePerformance: LanguagePerformanceDto[];
  movieLifecycle: MovieLifecycleDto[];
}

export interface CustomerInsightsDto {
  satisfaction: CustomerSatisfactionDto[];
  repeatCustomerRate: RepeatCustomerDto;
  advanceBookingTrends: AdvanceBookingDto[];
  avgSpendPerCustomer: number;
  cancellationRate: number;
}

export interface FinancialKPIsDto {
  potentialVsActual: PotentialRevenueDto;
  dynamicPricingImpact: DynamicPricingDto;
  discountImpact: DiscountImpactDto;
  peakHourRevenue: TimeSlotDto[];
  seasonalPatterns: any[];
}

export interface OperationalAnalyticsDto {
  showUtilization: ShowUtilizationDto[];
  lowPerformingTimeSlots: TimeSlotDto[];
  theaterEfficiency: any[];
  revenueGrowthRate: GrowthRateDto[];
}

export interface AnalyticsSummaryDto {
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
  topPerformingTheater: string;
  topPerformingMovie: string;
  revenueGrowth: number;
  customerSatisfaction: number;
  keyInsights: string[];
  recommendations: string[];
}

export interface ComprehensiveAnalyticsDto {
  revenueAnalytics: RevenueAnalyticsDto;
  performanceMetrics: PerformanceMetricsDto;
  movieAnalytics: MovieAnalyticsDto;
  customerInsights: CustomerInsightsDto;
  financialKPIs: FinancialKPIsDto;
  operationalAnalytics: OperationalAnalyticsDto;
  summary: AnalyticsSummaryDto;
}

// API Response DTOs
export interface ComprehensiveAnalyticsResponseDto extends ApiResponse<ComprehensiveAnalyticsDto> {}
export interface RevenueAnalyticsResponseDto extends ApiResponse<RevenueAnalyticsDto> {}
export interface MonthlyRevenueResponseDto extends ApiResponse<MonthlyRevenueDto[]> {}
export interface WeeklyRevenueResponseDto extends ApiResponse<WeeklyRevenueDto[]> {}
export interface DailyRevenueResponseDto extends ApiResponse<DailyRevenueDto[]> {}
export interface TheaterRevenueResponseDto extends ApiResponse<TheaterRevenueDto[]> {}
export interface ScreenRevenueResponseDto extends ApiResponse<ScreenRevenueDto[]> {}
export interface MovieRevenueResponseDto extends ApiResponse<MovieRevenueDto[]> {}
export interface PerformanceMetricsResponseDto extends ApiResponse<PerformanceMetricsDto> {}
export interface OccupancyResponseDto extends ApiResponse<OccupancyDto> {}
export interface AvgTicketPriceResponseDto extends ApiResponse<number> {}
export interface TimeSlotPerformanceResponseDto extends ApiResponse<TimeSlotDto[]> {}
export interface WeekdayWeekendResponseDto extends ApiResponse<WeekdayWeekendDto[]> {}
export interface MovieAnalyticsResponseDto extends ApiResponse<MovieAnalyticsDto> {}
export interface TopMoviesResponseDto extends ApiResponse<TopMovieDto[]> {}
export interface FormatPerformanceResponseDto extends ApiResponse<FormatPerformanceDto[]> {}
export interface LanguagePerformanceResponseDto extends ApiResponse<LanguagePerformanceDto[]> {}
export interface MovieLifecycleResponseDto extends ApiResponse<MovieLifecycleDto[]> {}
export interface CustomerInsightsResponseDto extends ApiResponse<CustomerInsightsDto> {}
export interface CustomerSatisfactionResponseDto extends ApiResponse<CustomerSatisfactionDto[]> {}
export interface RepeatCustomerResponseDto extends ApiResponse<RepeatCustomerDto> {}
export interface AdvanceBookingResponseDto extends ApiResponse<AdvanceBookingDto[]> {}
export interface FinancialKPIsResponseDto extends ApiResponse<FinancialKPIsDto> {}
export interface PotentialRevenueResponseDto extends ApiResponse<PotentialRevenueDto> {}
export interface DynamicPricingResponseDto extends ApiResponse<DynamicPricingDto> {}
export interface DiscountImpactResponseDto extends ApiResponse<DiscountImpactDto> {}
export interface OperationalAnalyticsResponseDto extends ApiResponse<OperationalAnalyticsDto> {}
export interface LowPerformingTimeSlotsResponseDto extends ApiResponse<TimeSlotDto[]> {}
export interface RevenueGrowthResponseDto extends ApiResponse<GrowthRateDto[]> {}
export interface AnalyticsSummaryResponseDto extends ApiResponse<AnalyticsSummaryDto> {}
export interface GenerateReportResponseDto extends ApiResponse<string> {}
export interface ExportDataResponseDto extends ApiResponse<Buffer> {}
