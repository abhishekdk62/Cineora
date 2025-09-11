import { Types } from "mongoose";
import { IDateRange } from "../dtos/dtos";


export interface IAnalyticsRepository {
  // Platform-wide aggregations
  getAggregateRevenue(dateRange: IDateRange): Promise<number>;
  getAggregateBookings(dateRange: IDateRange): Promise<number>;
  getAggregateOccupancy(dateRange: IDateRange): Promise<number>;
  getTotalCustomers(dateRange: IDateRange): Promise<number>;
  getTotalOwners(): Promise<number>;
  getTotalTheaters(): Promise<number>;
  getTotalMovies(): Promise<number>;

  // Revenue breakdowns
  getRevenuePerTheater(dateRange: IDateRange): Promise<Array<{theaterId: Types.ObjectId; theaterName: string; revenue: number; bookings: number; occupancy: number}>>;
  getRevenuePerOwner(dateRange: IDateRange): Promise<Array<{ownerId: Types.ObjectId; ownerName: string; revenue: number; bookings: number; occupancy: number; theatersCount: number}>>;
  getRevenuePerMovie(dateRange: IDateRange): Promise<Array<{movieId: Types.ObjectId; movieName: string; revenue: number; bookings: number; avgRating: number}>>;
  getMonthlyRevenueTrends(dateRange: IDateRange): Promise<Array<{month: string; revenue: number; bookings: number}>>;
  getDailyRevenueTrends(dateRange: IDateRange): Promise<Array<{date: string; revenue: number; bookings: number}>>;

  // Customer analytics
  getCustomerStats(dateRange: IDateRange): Promise<{totalCustomers: number; newCustomers: number; retentionRate: number; avgBookingsPerCustomer: number}>;
  getCustomerSegments(dateRange: IDateRange): Promise<Array<{segment: string; count: number; percentage: number}>>;
  getCustomerAcquisition(dateRange: IDateRange): Promise<Array<{source: string; count: number}>>;
  getCustomerSatisfaction(dateRange: IDateRange): Promise<{avgRating: number; totalReviews: number; ratingDistribution: Array<{rating: number; count: number}>}>;

  // Movie performance
  getMoviePerformance(dateRange: IDateRange): Promise<Array<{movieId: Types.ObjectId; movieName: string; totalBookings: number; avgRating: number; format: string; language: string}>>;
  getTopPerformingMovies(dateRange: IDateRange, limit: number): Promise<Array<{movieId: Types.ObjectId; movieName: string; revenue: number; bookings: number}>>;
  getMovieFormatPerformance(dateRange: IDateRange): Promise<Array<{format: string; bookings: number; revenue: number}>>;
  getMovieLanguagePerformance(dateRange: IDateRange): Promise<Array<{language: string; bookings: number; revenue: number}>>;

  // Operational metrics
  getShowtimePerformance(dateRange: IDateRange): Promise<Array<{showtimeId: Types.ObjectId; occupancy: number; revenue: number; showTime: string}>>;
  getTimeSlotPerformance(dateRange: IDateRange): Promise<Array<{timeSlot: string; bookings: number; avgOccupancy: number}>>;
  getWeekdayWeekendComparison(dateRange: IDateRange): Promise<{weekday: {bookings: number; revenue: number}; weekend: {bookings: number; revenue: number}}>;
  
  // Financial KPIs
  getFinancialKPIs(dateRange: IDateRange): Promise<{
    totalRevenue: number; 
    totalRefunds: number; 
    totalDiscounts: number; 
    platformCommission: number;
    avgTicketPrice: number;
    totalConvenienceFees: number;
    totalTaxes: number;
  }>;
  
  // Growth and trends
  getGrowthRates(dateRange: IDateRange): Promise<{monthlyGrowthRate: number; quarterlyGrowthRate: number; yearlyGrowthRate: number}>;
  getSeasonalTrends(dateRange: IDateRange): Promise<Array<{period: string; bookings: number; revenue: number}>>;
  
  // Platform health
  getCancellationRates(dateRange: IDateRange): Promise<{cancellationRate: number; refundAmount: number}>;
  getPaymentAnalytics(dateRange: IDateRange): Promise<{successRate: number; failureRate: number; avgProcessingTime: number}>;
}
