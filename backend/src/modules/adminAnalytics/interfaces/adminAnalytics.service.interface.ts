
import { ServiceResponse } from "../../../interfaces/interface";
import { UserLookupResponseDto } from "../../auth/dtos/dtos";
import { MovieResponseDto } from "../../movies/dtos/dtos";
import { IMovie } from "../../movies/interfaces/movies.model.interface";
import { ShowtimeValidationResult } from "../../showtimes/dtos/dto";
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
  getComprehensiveAnalytics(filter: IDateRange): Promise<ServiceResponse<IComprehensiveAnalyticsDTO>>;
  
  getRevenueAnalytics(filter: IDateRange): Promise<ServiceResponse<IRevenueAnalyticsDTO>>;
  getMonthlyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IMonthlyRevenueDTO>>;
  getDailyRevenueTrends(filter: IDateRange): Promise<ServiceResponse<IDailyRevenueDTO>>;
  getTheaterWiseRevenue(filter: IDateRange): Promise<ServiceResponse<ITheaterRevenueDTO>>;
  getOwnerWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IOwnerRevenueDTO>>;
  getMovieWiseRevenue(filter: IDateRange): Promise<ServiceResponse<IMovieRevenueDTO>>;
  
  getPerformanceMetrics(filter: IDateRange): Promise<ServiceResponse<IPerformanceMetricsDTO>>;
  getOccupancyAnalytics(filter: IDateRange): Promise<ServiceResponse<ShowtimeValidationResult>>;
  getTimeSlotPerformance(filter: IDateRange): Promise<ServiceResponse<ShowtimeValidationResult>>;
  
  getCustomerInsights(filter: IDateRange): Promise<ServiceResponse<ICustomerInsightsDTO>>;
  getCustomerSatisfaction(filter: IDateRange): Promise<ServiceResponse<UserLookupResponseDto>>;
  
  getMoviePerformance(filter: IDateRange): Promise<ServiceResponse<IMoviePerformanceDTO>>;
  getTopPerformingMovies(filter: IDateRange, limit?: number): Promise<ServiceResponse<MovieResponseDto>>;
  getMovieFormatAnalytics(filter: IDateRange): Promise<ServiceResponse<IMovie >>;
  
  getFinancialKPIs(filter: IDateRange): Promise<ServiceResponse<IFinancialKPIsDTO>>;
  
  getGrowthRates(filter: IDateRange): Promise<ServiceResponse<IGrowthRatesDTO>>;
  
  getOperationalAnalytics(filter: IDateRange): Promise<ServiceResponse<IOperationalAnalyticsDTO>>;
}
