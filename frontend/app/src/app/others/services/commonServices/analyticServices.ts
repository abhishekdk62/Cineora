// services/analyticsApi.ts
import ANALYTICS_ROUTES from "../../constants/commonConstants/analyticsConstants";
import apiClient from "../../Utils/apiClient";
import {
  AnalyticsQueryDto,
  ComprehensiveAnalyticsResponseDto,
  RevenueAnalyticsResponseDto,
  MonthlyRevenueResponseDto,
  WeeklyRevenueResponseDto,
  DailyRevenueResponseDto,
  TheaterRevenueResponseDto,
  ScreenRevenueResponseDto,
  MovieRevenueResponseDto,
  PerformanceMetricsResponseDto,
  OccupancyResponseDto,
  AvgTicketPriceResponseDto,
  TimeSlotPerformanceResponseDto,
  WeekdayWeekendResponseDto,
  MovieAnalyticsResponseDto,
  TopMoviesResponseDto,
  FormatPerformanceResponseDto,
  LanguagePerformanceResponseDto,
  MovieLifecycleResponseDto,
  CustomerInsightsResponseDto,
  CustomerSatisfactionResponseDto,
  RepeatCustomerResponseDto,
  AdvanceBookingResponseDto,
  FinancialKPIsResponseDto,
  PotentialRevenueResponseDto,
  DynamicPricingResponseDto,
  DiscountImpactResponseDto,
  OperationalAnalyticsResponseDto,
  LowPerformingTimeSlotsResponseDto,
  RevenueGrowthResponseDto,
  AnalyticsSummaryResponseDto,
  GenerateReportResponseDto,
  ExportDataResponseDto
} from "../../dtos/analytics.dto";

interface ExtendedAnalyticsQuery extends AnalyticsQueryDto {
  ownerId?: string;
}

export const getComprehensiveAnalyticsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<ComprehensiveAnalyticsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.COMPREHENSIVE, { params });
  return response.data;
};

export const getRevenueAnalyticsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<RevenueAnalyticsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE, { params });
  return response.data;
};

export const getMonthlyRevenueTrendsApi = async (
  params?: ExtendedAnalyticsQuery & { months?: number }
): Promise<MonthlyRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_MONTHLY, { params });
  return response.data;
};

export const getWeeklyRevenueApi = async (
  params?: ExtendedAnalyticsQuery & { weeks?: number }
): Promise<WeeklyRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_WEEKLY, { params });
  return response.data;
};

export const getDailyRevenueApi = async (
  params?: ExtendedAnalyticsQuery & { days?: number }
): Promise<DailyRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_DAILY, { params });
  return response.data;
};

export const getTheaterWiseRevenueApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<TheaterRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_THEATER_WISE, { params });
  return response.data;
};

export const getScreenWiseRevenueApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<ScreenRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_SCREEN_WISE, { params });
  return response.data;
};

export const getMovieWiseRevenueApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<MovieRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.REVENUE_MOVIE_WISE, { params });
  return response.data;
};

// Performance Metrics APIs
export const getPerformanceMetricsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<PerformanceMetricsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.PERFORMANCE, { params });
  return response.data;
};

export const getOverallOccupancyApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<OccupancyResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.PERFORMANCE_OCCUPANCY, { params });
  return response.data;
};

export const getAverageTicketPriceApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<AvgTicketPriceResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.PERFORMANCE_AVG_TICKET_PRICE, { params });
  return response.data;
};

export const getTimeSlotPerformanceApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<TimeSlotPerformanceResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.PERFORMANCE_TIME_SLOTS, { params });
  return response.data;
};

export const getWeekdayWeekendComparisonApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<WeekdayWeekendResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.PERFORMANCE_WEEKDAY_WEEKEND, { params });
  return response.data;
};

// Movie Analytics APIs
export const getMovieAnalyticsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<MovieAnalyticsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.MOVIES, { params });
  return response.data;
};

export const getTopPerformingMoviesApi = async (
  params?: ExtendedAnalyticsQuery & { limit?: number }
): Promise<TopMoviesResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.MOVIES_TOP_PERFORMING, { params });
  return response.data;
};

export const getFormatPerformanceApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<FormatPerformanceResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.MOVIES_FORMAT_PERFORMANCE, { params });
  return response.data;
};

export const getLanguagePerformanceApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<LanguagePerformanceResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.MOVIES_LANGUAGE_PERFORMANCE, { params });
  return response.data;
};

export const getMovieLifecycleTrendsApi = async (
  movieId: string,
  params?: ExtendedAnalyticsQuery
): Promise<MovieLifecycleResponseDto> => {
  const route = ANALYTICS_ROUTES.MOVIES_LIFECYCLE.replace(':movieId', movieId);
  const response = await apiClient.get(route, { params });
  return response.data;
};

// Customer Insights APIs
export const getCustomerInsightsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<CustomerInsightsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.CUSTOMERS, { params });
  return response.data;
};

export const getCustomerSatisfactionRatingsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<CustomerSatisfactionResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.CUSTOMERS_SATISFACTION, { params });
  return response.data;
};

export const getRepeatCustomerRateApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<RepeatCustomerResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.CUSTOMERS_REPEAT_RATE, { params });
  return response.data;
};

export const getAdvanceBookingTrendsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<AdvanceBookingResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.CUSTOMERS_ADVANCE_BOOKING, { params });
  return response.data;
};

// Financial KPIs APIs
export const getFinancialKPIsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<FinancialKPIsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.FINANCIAL, { params });
  return response.data;
};

export const getPotentialVsActualRevenueApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<PotentialRevenueResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.FINANCIAL_POTENTIAL_VS_ACTUAL, { params });
  return response.data;
};

export const getDynamicPricingImpactApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<DynamicPricingResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.FINANCIAL_DYNAMIC_PRICING, { params });
  return response.data;
};

export const getDiscountImpactApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<DiscountImpactResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.FINANCIAL_DISCOUNT_IMPACT, { params });
  return response.data;
};

// Operational Analytics APIs
export const getOperationalAnalyticsApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<OperationalAnalyticsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.OPERATIONAL, { params });
  return response.data;
};

export const getLowPerformingTimeSlotsApi = async (
  params?: ExtendedAnalyticsQuery & { threshold?: number }
): Promise<LowPerformingTimeSlotsResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.OPERATIONAL_LOW_PERFORMING_SLOTS, { params });
  return response.data;
};

export const getRevenueGrowthRateApi = async (
  params?: ExtendedAnalyticsQuery & { period?: 'monthly' | 'quarterly' }
): Promise<RevenueGrowthResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.OPERATIONAL_REVENUE_GROWTH, { params });
  return response.data;
};

// Utility APIs
export const getAnalyticsSummaryApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<AnalyticsSummaryResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.SUMMARY, { params });
  return response.data;
};

export const generateAnalyticsReportApi = async (
  params?: ExtendedAnalyticsQuery
): Promise<GenerateReportResponseDto> => {
  const response = await apiClient.post(ANALYTICS_ROUTES.REPORT, params);
  return response.data;
};

export const exportAnalyticsDataApi = async (
  params?: ExtendedAnalyticsQuery & { format?: 'csv' | 'excel' | 'pdf' }
): Promise<ExportDataResponseDto> => {
  const response = await apiClient.get(ANALYTICS_ROUTES.EXPORT, { params });
  return response.data;
};
