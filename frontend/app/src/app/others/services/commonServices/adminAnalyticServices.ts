// @ts-nocheck
import ADMIN_ANALYTICS_ROUTES from "../../constants/commonConstants/adminAnalyticsConstants";
import apiClient from "../../Utils/apiClient";

interface AdminAnalyticsQuery {
  startDate?: string;
  endDate?: string;
  ownerId?: string;
  theaterId?: string;
  movieId?: string;
  limit?: number;
}

// Main Comprehensive Analytics
export const getComprehensiveAnalyticsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.COMPREHENSIVE, { params });
  return response.data;
};

// Revenue Analytics APIs
export const getRevenueAnalyticsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE, { params });
  return response.data;
};

export const getMonthlyRevenueTrendsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE_MONTHLY, { params });
  return response.data;
};

export const getDailyRevenueTrendsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE_DAILY, { params });
  return response.data;
};

export const getTheaterWiseRevenueApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE_THEATER_WISE, { params });
  return response.data;
};

export const getOwnerWiseRevenueApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE_OWNER_WISE, { params });
  return response.data;
};

export const getMovieWiseRevenueApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.REVENUE_MOVIE_WISE, { params });
  return response.data;
};

// Performance Metrics APIs
export const getPerformanceMetricsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.PERFORMANCE, { params });
  return response.data;
};

export const getOccupancyAnalyticsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.PERFORMANCE_OCCUPANCY, { params });
  return response.data;
};

export const getTimeSlotPerformanceApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.PERFORMANCE_TIME_SLOTS, { params });
  return response.data;
};

// Customer Analytics APIs
export const getCustomerInsightsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.CUSTOMERS, { params });
  return response.data;
};

export const getCustomerSatisfactionApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.CUSTOMERS_SATISFACTION, { params });
  return response.data;
};

// Movie Analytics APIs
export const getMoviePerformanceApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.MOVIES, { params });
  return response.data;
};

export const getTopPerformingMoviesApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.MOVIES_TOP_PERFORMING, { params });
  return response.data;
};

export const getMovieFormatAnalyticsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.MOVIES_FORMAT_PERFORMANCE, { params });
  return response.data;
};

// Financial KPIs API
export const getFinancialKPIsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.FINANCIAL, { params });
  return response.data;
};

// Growth Analytics API
export const getGrowthRatesApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.GROWTH, { params });
  return response.data;
};

// Operational Analytics API
export const getOperationalAnalyticsApi = async (
  params?: AdminAnalyticsQuery
): Promise<AdminAnalyticsDto> => {
  const response = await apiClient.get(ADMIN_ANALYTICS_ROUTES.OPERATIONAL, { params });
  return response.data;
};
