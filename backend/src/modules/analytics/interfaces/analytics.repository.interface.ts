import { Types } from "mongoose";
import { IDateRange } from "../../adminAnalytics/dtos/dtos";

export * from "./analytics.service.interface";

export type {
  IMonthlyRevenueAggregation as IRevenueData,
  ITheaterRevenueDTO as ITheaterRevenueData,
  IScreenRevenueDTO as IScreenRevenueData,
  IMovieRevenueDTO as IMovieRevenueData,
  IOccupancyDTO as IOccupancyData,
  ITimeSlotAggregation as ITimeSlotData,
  ITopMovieAggregation as IMoviePerformanceData,
  IFormatPerformanceAggregation as IFormatPerformanceData,
  ICustomerSatisfactionAggregation as ICustomerSatisfactionData,
  IRepeatCustomerDTO as IRepeatCustomerData,
  IAdvanceBookingAggregation as IAdvanceBookingData,
  IPotentialRevenueDTO as IPotentialRevenueData,
  IDynamicPricingDTO as IDynamicPricingData,
  IDiscountImpactDTO as IDiscountImpactData,
} from "./analytics.service.interface";

import {
  IMonthlyRevenueDTO,
  ITheaterRevenueDTO,
  IScreenRevenueDTO,
  IMovieRevenueDTO,
  IOccupancyDTO,
  ITimeSlotDTO,
  ITopMovieDTO,
  IFormatPerformanceDTO,
  ICustomerSatisfactionDTO,
  IRepeatCustomerDTO,
  IAdvanceBookingDTO,
  IPotentialRevenueDTO,
  IDynamicPricingDTO,
  IDiscountImpactDTO,
  IMonthlyRevenueAggregation,
  ITimeSlotAggregation,
  ITopMovieAggregation,
  IFormatPerformanceAggregation,
  ICustomerSatisfactionAggregation,
  IAdvanceBookingAggregation,
} from "./analytics.service.interface";

export interface IAnalyticsRepository {
  getMonthlyRevenueTrends(
    ownerId: string,
    months?: number
  ): Promise<IMonthlyRevenueAggregation[]>;
  getWeeklyRevenue(ownerId: string, weeks?: number): Promise<IMonthlyRevenueAggregation[]>;
  getDailyRevenue(ownerId: string, days?: number): Promise<IMonthlyRevenueAggregation[]>;
  getTheaterWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ITheaterRevenueDTO[]>;
  getScreenWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IScreenRevenueDTO[]>;
  getMovieWiseRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IMovieRevenueDTO[]>;

  getOverallOccupancy(
    ownerId: string,
    dateRange: IDateRange
  ): Promise<IOccupancyDTO>;
  getAverageTicketPrice(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<number>;
  getRevenuePerScreen(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IScreenRevenueDTO[]>;
  getRevenuePerShow(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IMonthlyRevenueAggregation[]>;
  getTimeSlotPerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ITimeSlotAggregation[]>;
  getWeekdayWeekendComparison(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IMonthlyRevenueAggregation[]>;

  getTopPerformingMovies(
    ownerId: string,
    limit?: number,
    dateRange?: IDateRange
  ): Promise<ITopMovieAggregation[]>;
  getFormatPerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IFormatPerformanceAggregation[]>;
  getLanguagePerformance(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IFormatPerformanceAggregation[]>;
  getMovieLifecycleTrends(
    ownerId: string,
    movieId: string,
    dateRange?: IDateRange
  ): Promise<IMonthlyRevenueAggregation[]>;

  getCustomerSatisfactionRatings(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ICustomerSatisfactionAggregation[]>;
  getRepeatCustomerRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IRepeatCustomerDTO>;
  getAdvanceBookingTrends(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IAdvanceBookingAggregation[]>;
  getAverageSpendPerCustomer(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<number>;
  getCancellationRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<number>;

  getPotentialVsActualRevenue(
    ownerId: string,
    dateRange: IDateRange
  ): Promise<IPotentialRevenueDTO>;
  getDynamicPricingImpact(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IDynamicPricingDTO>;
  getDiscountImpact(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IDiscountImpactDTO>;
  getPeakHourRevenue(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ITimeSlotAggregation[]>;
  getSeasonalRevenuePatterns(
    ownerId: string,
    months?: number
  ): Promise<IMonthlyRevenueAggregation[]>;

  getShowUtilizationRate(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<IMonthlyRevenueAggregation[]>;
  getLowPerformingTimeSlots(
    ownerId: string,
    threshold?: number,
    dateRange?: IDateRange
  ): Promise<ITimeSlotAggregation[]>;
  getTheaterEfficiencyScore(
    ownerId: string,
    dateRange?: IDateRange
  ): Promise<ITheaterRevenueDTO[]>;
  getRevenueGrowthRate(
    ownerId: string,
    period: "monthly" | "quarterly"
  ): Promise<IMonthlyRevenueAggregation[]>;

  getOwnerTheaterIds(ownerId: string): Promise<Types.ObjectId[]>;
}
