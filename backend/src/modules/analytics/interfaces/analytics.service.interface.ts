// interfaces/analytics.service.interface.ts
import { ServiceResponse } from "../../../interfaces/interface";
import { IDateRange } from "../../adminAnalytics/dtos/dtos";


export interface IRevenueAnalyticsDTO {
  monthly: IMonthlyRevenueDTO[];
  weekly: IWeeklyRevenueDTO[];
  daily: IDailyRevenueDTO[];
  theaterWise: ITheaterRevenueDTO[];
  screenWise: IScreenRevenueDTO[];
  movieWise: IMovieRevenueDTO[];
}

export interface IPerformanceMetricsDTO {
  occupancy: IOccupancyDTO;
  avgTicketPrice: number;
  revenuePerScreen: IScreenRevenueDTO[];
  revenuePerShow: IShowRevenueDTO[];
  timeSlotPerformance: ITimeSlotDTO[];
  weekdayWeekendComparison: IWeekdayWeekendDTO[];
}

export interface IMovieAnalyticsDTO {
  topMovies: ITopMovieDTO[];
  formatPerformance: IFormatPerformanceDTO[];
  languagePerformance: ILanguagePerformanceDTO[];
  movieLifecycle: IMovieLifecycleDTO[];
}

export interface ICustomerInsightsDTO {
  satisfaction: ICustomerSatisfactionDTO[];
  repeatCustomerRate: IRepeatCustomerDTO;
  advanceBookingTrends: IAdvanceBookingDTO[];
  avgSpendPerCustomer: number;
  cancellationRate: number;
}

export interface IFinancialKPIsDTO {
  potentialVsActual: IPotentialRevenueDTO;
  dynamicPricingImpact: IDynamicPricingDTO;
  discountImpact: IDiscountImpactDTO;
  peakHourRevenue: ITimeSlotDTO[];
  seasonalPatterns: ISeasonalPatternDTO[];
}

export interface IOperationalAnalyticsDTO {
  showUtilization: IShowUtilizationDTO[];
  lowPerformingTimeSlots: ITimeSlotDTO[];
  theaterEfficiency: ITheaterEfficiencyDTO[];
  revenueGrowthRate: IGrowthRateDTO[];
}

// Individual DTO interfaces
export interface IMonthlyRevenueDTO {
  period: {
    year: number;
    month: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  growthRate?: number;
}

export interface IWeeklyRevenueDTO {
  period: {
    year: number;
    week: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
}

export interface IDailyRevenueDTO {
  period: {
    year: number;
    month: number;
    day: number;
  };
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
}

export interface ITheaterRevenueDTO {
  theaterId: string;
  theaterName: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
}

export interface IScreenRevenueDTO {
  screenId: string;
  theaterId: string;
  screenName: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  utilizationRate: number;
}

export interface IMovieRevenueDTO {
  movieId: string;
  movieTitle: string;
  totalRevenue: number;
  totalBookings: number;
  totalTickets: number;
  avgTicketPrice: number;
  revenueShare: number;
}

export interface IOccupancyDTO {
  totalSeatsAvailable: number;
  totalSeatsBooked: number;
  occupancyPercentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface IShowRevenueDTO {
  showtimeId: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  occupancyRate: number;
}

export interface ITimeSlotDTO {
  timeSlot: string;
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
  performance: "high" | "medium" | "low";
}

export interface IWeekdayWeekendDTO {
  type: "weekday" | "weekend";
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  performanceRatio: number;
}

export interface ITopMovieDTO {
  movieId: string;
  movieTitle: string;
  totalRevenue: number;
  totalTickets: number;
  totalShows: number;
  avgOccupancy: number;
  rank: number;
}

export interface IFormatPerformanceDTO {
  format: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
  profitability: "high" | "medium" | "low";
}

export interface ILanguagePerformanceDTO {
  language: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
  marketShare: number;
  audiencePreference: number;
}

export interface IMovieLifecycleDTO {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  performanceStage: "opening" | "peak" | "declining" | "steady";
}

export interface ICustomerSatisfactionDTO {
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
  satisfactionLevel: "excellent" | "good" | "average" | "poor";
}

export interface IRepeatCustomerDTO {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgSpendPerCustomer: number;
  loyaltyScore: number;
}

export interface IAdvanceBookingDTO {
  category: string;
  count: number;
  totalRevenue: number;
  percentage: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface IPotentialRevenueDTO {
  potentialRevenue: number;
  actualRevenue: number;
  realizationPercentage: number;
  missedOpportunity: number;
  efficiency: "high" | "medium" | "low";
}

export interface IDynamicPricingDTO {
  avgBasePrice: number;
  avgShowtimePrice: number;
  avgFinalPrice: number;
  pricingImpact: number;
  effectiveness: "positive" | "neutral" | "negative";
}

export interface IDiscountImpactDTO {
  totalSubtotal: number;
  totalDiscount: number;
  totalFinal: number;
  discountPercentage: number;
  bookingsWithDiscount: number;
  totalBookings: number;
  roi: number;
}

export interface ISeasonalPatternDTO {
  period: string;
  totalRevenue: number;
  seasonality: "peak" | "off-peak" | "normal";
  yearOverYearGrowth: number;
}

export interface IShowUtilizationDTO {
  showtimeId: string;
  totalRevenue: number;
  utilizationRate: number;
  performance: "excellent" | "good" | "poor";
}

export interface ITheaterEfficiencyDTO {
  theaterId: string;
  theaterName: string;
  totalRevenue: number;
  efficiencyScore: number;
  ranking: number;
}

export interface IGrowthRateDTO {
  period: string;
  totalRevenue: number;
  growthRate: number;
  trend: "positive" | "negative" | "stable";
}

export interface IAnalyticsFilterDTO {
  ownerId: string;
  dateRange?: IDateRange;
  timeframe?: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  theaterId?: string;
  screenId?: string;
  movieId?: string;
  format?: string;
  language?: string;
  limit?: number;
  threshold?: number;
}

export interface IComprehensiveAnalyticsDTO {
  revenueAnalytics: IRevenueAnalyticsDTO;
  performanceMetrics: IPerformanceMetricsDTO;
  movieAnalytics: IMovieAnalyticsDTO;
  customerInsights: ICustomerInsightsDTO;
  financialKPIs: IFinancialKPIsDTO;
  operationalAnalytics: IOperationalAnalyticsDTO;
  summary: IAnalyticsSummaryDTO;
}

export interface IAnalyticsSummaryDTO {
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

export interface IAnalyticsService {
  // Main analytics methods
  getComprehensiveAnalytics(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IComprehensiveAnalyticsDTO>>;

  // Revenue Analytics
  getRevenueAnalytics(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IRevenueAnalyticsDTO>>;
  getMonthlyRevenueTrends(
    ownerId: string,
    months?: number
  ): Promise<ServiceResponse<IMonthlyRevenueDTO[]>>;
  getWeeklyRevenue(
    ownerId: string,
    weeks?: number
  ): Promise<ServiceResponse<IWeeklyRevenueDTO[]>>;
  getDailyRevenue(
    ownerId: string,
    days?: number
  ): Promise<ServiceResponse<IDailyRevenueDTO[]>>;
  getTheaterWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITheaterRevenueDTO[]>>;
  getScreenWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IScreenRevenueDTO[]>>;
  getMovieWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IMovieRevenueDTO[]>>;

  // Performance Metrics
  getPerformanceMetrics(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IPerformanceMetricsDTO>>;
  getOverallOccupancy(
    ownerId: string,
    dateRange: IDateRange
  ): Promise<ServiceResponse<IOccupancyDTO>>;
  getAverageTicketPrice(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<number>>;
  getRevenuePerScreen(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IScreenRevenueDTO[]>>;
  getRevenuePerShow(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IShowRevenueDTO[]>>;
  getTimeSlotPerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITimeSlotDTO[]>>;
  getWeekdayWeekendComparison(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IWeekdayWeekendDTO[]>>;

  // Movie & Content Analytics
  getMovieAnalytics(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IMovieAnalyticsDTO>>;
  getTopPerformingMovies(
    ownerId: string,
    limit?: number,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITopMovieDTO[]>>;
  getFormatPerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IFormatPerformanceDTO[]>>;
  getLanguagePerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ILanguagePerformanceDTO[]>>;
  getMovieLifecycleTrends(
    ownerId: string,
    movieId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IMovieLifecycleDTO[]>>;

  // Customer Insights
  getCustomerInsights(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<ICustomerInsightsDTO>>;
  getCustomerSatisfactionRatings(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ICustomerSatisfactionDTO[]>>;
  getRepeatCustomerRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IRepeatCustomerDTO>>;
  getAdvanceBookingTrends(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IAdvanceBookingDTO[]>>;
  getAverageSpendPerCustomer(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<number>>;
  getCancellationRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<number>>;

  // Financial KPIs
  getFinancialKPIs(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IFinancialKPIsDTO>>;
  getPotentialVsActualRevenue(
    ownerId: string,
    dateRange: IDateRange
  ): Promise<ServiceResponse<IPotentialRevenueDTO>>;
  getDynamicPricingImpact(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IDynamicPricingDTO>>;
  getDiscountImpact(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IDiscountImpactDTO>>;
  getPeakHourRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITimeSlotDTO[]>>;
  getSeasonalRevenuePatterns(
    ownerId: string,
    months?: number
  ): Promise<ServiceResponse<ISeasonalPatternDTO[]>>;

  // Operational Analytics
  getOperationalAnalytics(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<IOperationalAnalyticsDTO>>;
  getShowUtilizationRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IShowUtilizationDTO[]>>;
  getLowPerformingTimeSlots(
    ownerId: string,
    threshold?: number,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITimeSlotDTO[]>>;
  getTheaterEfficiencyScore(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<ITheaterEfficiencyDTO[]>>;
  getRevenueGrowthRate(
    ownerId: string,
    period: "monthly" | "quarterly"
  ): Promise<ServiceResponse<IGrowthRateDTO[]>>;

  // Utility methods
  generateAnalyticsReport(
    filters: IAnalyticsFilterDTO
  ): Promise<ServiceResponse<string>>;
  exportAnalyticsData(
    filters: IAnalyticsFilterDTO,
    format: "csv" | "excel" | "pdf"
  ): Promise<ServiceResponse<Buffer>>;
  getAnalyticsSummary(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ServiceResponse<IAnalyticsSummaryDTO>>;
}
