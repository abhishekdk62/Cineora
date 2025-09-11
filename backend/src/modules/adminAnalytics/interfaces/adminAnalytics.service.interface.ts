
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
  IDateRange
} from "../dtos/dtos";

export interface IAdminAnalyticsService {
  // Comprehensive dashboard
  getComprehensiveAnalytics(filter: IDateRange): Promise<ServiceResponse<IComprehensiveAnalyticsDTO>>;
  
  // Revenue analytics
  getRevenueAnalytics(filter: IDateRange): Promise<ServiceResponse<IRevenueAnalyticsDTO>>;
  getMonthlyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IMonthlyRevenueDTO>>;
  getDailyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IDailyRevenueDTO>>;
  getTheaterWiseRevenue(filter: IDateRange): Promise<ServiceResponse<ITheaterRevenueDTO>>;
  getOwnerWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IOwnerRevenueDTO>>;
  getMovieWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IMovieRevenueDTO>>;
  
  // Performance metrics
  getPerformanceMetrics(filter: IDateRange): Promise<ServiceResponse<IPerformanceMetricsDTO>>;
  getOccupancyAnalytics(filter: IDateRange): Promise<ServiceResponse<any>>;
  getTimeSlotPerformance(filter: IDateRange): Promise<ServiceResponse<any>>;
  
  // Customer analytics
  getCustomerInsights(filter: IDateRange): Promise<ServiceResponse<ICustomerInsightsDTO>>;
  getCustomerSatisfaction(filter: IDateRange): Promise<ServiceResponse<any>>;
  
  // Movie analytics
  getMoviePerformance(filter: IDateRange): Promise<ServiceResponse<IMoviePerformanceDTO>>;
  getTopPerformingMovies(filter: IDateRange, limit?: number): Promise<ServiceResponse<any>>;
  getMovieFormatAnalytics(filter: IDateRange): Promise<ServiceResponse<any>>;
  
  // Financial insights
  getFinancialKPIs(filter: IDateRange): Promise<ServiceResponse<IFinancialKPIsDTO>>;
  
  // Growth and trends
  getGrowthRates(filter: IDateRange): Promise<ServiceResponse<IGrowthRatesDTO>>;
  
  // Operational analytics
  getOperationalAnalytics(filter: IDateRange): Promise<ServiceResponse<IOperationalAnalyticsDTO>>;
}
