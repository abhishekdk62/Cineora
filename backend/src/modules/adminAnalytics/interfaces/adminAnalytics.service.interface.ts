
import { ServiceResponse } from "../../../interfaces/interface";
import {
  IComprehensiveAnalyticsDTO,
  IRevenueAnalyticsDTO,
  IMonthlyRevenueDTO,
  IDailyRevenueDTO,
  ITheaterRevenueDTO,
  IOwnerRevenueDTO,
  IMovieRevenueDTO,
  ICustomerInsightsDTO,
  IMoviePerformanceDTO,
  IFinancialKPIsDTO,
  IGrowthRatesDTO,
  IOperationalAnalyticsDTO,
  IPerformanceMetricsDTO,
  IDateRange,
  IAdminBookingAnalyticsRecord,
} from "../dtos/dtos";

export interface IOccupancyAnalyticsDTO {
  avgOccupancy: number;
}

export interface ITimeSlotAnalyticsDTO {
  timeSlots: Array<{ timeSlot: string; bookings: number; avgOccupancy: number }>;
}

export interface ICustomerSatisfactionAnalyticsDTO {
  avgRating: number;
  totalReviews: number;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

export interface ITopMoviesAnalyticsDTO {
  movies: Array<{
    movieId: unknown;
    movieName: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface IAdminAnalyticsService {
  getComprehensiveAnalytics(filter: IDateRange): Promise<ServiceResponse<IComprehensiveAnalyticsDTO>>;
  
  getRevenueAnalytics(filter: IDateRange): Promise<ServiceResponse<IRevenueAnalyticsDTO>>;
  getMonthlyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IMonthlyRevenueDTO>>;
  getDailyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IDailyRevenueDTO>>;
  getTheaterWiseRevenue(filter: IDateRange): Promise<ServiceResponse<ITheaterRevenueDTO>>;
  getOwnerWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IOwnerRevenueDTO>>;
  getMovieWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IMovieRevenueDTO>>;
  
  getPerformanceMetrics(filter: IDateRange): Promise<ServiceResponse<IPerformanceMetricsDTO>>;
  getOccupancyAnalytics(filter: IDateRange): Promise<ServiceResponse<IOccupancyAnalyticsDTO>>;
  getTimeSlotPerformance(filter: IDateRange): Promise<ServiceResponse<ITimeSlotAnalyticsDTO>>;
  getAdminAnalyticData(filter: IDateRange): Promise<ServiceResponse<IAdminBookingAnalyticsRecord[]>>;
  
  getCustomerInsights(filter: IDateRange): Promise<ServiceResponse<ICustomerInsightsDTO>>;
  getCustomerSatisfaction(filter: IDateRange): Promise<ServiceResponse<ICustomerSatisfactionAnalyticsDTO>>;
  
  getMoviePerformance(filter: IDateRange): Promise<ServiceResponse<IMoviePerformanceDTO>>;
  getTopPerformingMovies(filter: IDateRange, limit?: number): Promise<ServiceResponse<ITopMoviesAnalyticsDTO>>;
  getMovieFormatAnalytics(filter: IDateRange): Promise<ServiceResponse<unknown>>;
  
  getFinancialKPIs(filter: IDateRange): Promise<ServiceResponse<IFinancialKPIsDTO>>;
  
  getGrowthRates(filter: IDateRange): Promise<ServiceResponse<IGrowthRatesDTO>>;
  
  getOperationalAnalytics(filter: IDateRange): Promise<ServiceResponse<IOperationalAnalyticsDTO>>;
}
