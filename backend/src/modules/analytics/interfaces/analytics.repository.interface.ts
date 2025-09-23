import { ObjectId, Types } from "mongoose";
import { IDateRange } from "../../adminAnalytics/dtos/dtos";



export interface IRevenueDTO {
  _id: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice?: number;
}

export interface ITheaterRevenueDTO extends IRevenueDTO {
  theaterId: ObjectId;
  theaterName?: string;
}

export interface IScreenRevenueDTO extends IRevenueDTO {
  screenId: ObjectId;
  theaterId: ObjectId;
  screenName?: string;
}

export interface IMovieRevenueDTO extends IRevenueDTO {
  movieId: ObjectId;
  movieTitle?: string;
  totalTickets: number;
}

export interface IOccupancyDTO {
  totalSeatsAvailable: number;
  totalSeatsBooked: number;
  occupancyPercentage: number;
}

export interface ITimeSlotDTO {
  _id: string;
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
}

export interface IMoviePerformanceDTO {
  _id: ObjectId;
  movieTitle: string;
  totalRevenue: number;
  totalTickets: number;
  totalShows: number;
  avgOccupancy: number;
}

export interface IFormatPerformanceDTO {
  _id: string;
  totalRevenue: number;
  totalBookings: number;
  avgTicketPrice: number;
}

export interface ICustomerSatisfactionDTO {
  _id: ObjectId;
  theaterId: ObjectId;
  theaterName?: string;
  avgRating: number;
  totalReviews: number;
  ratingDistribution: number[];
}

export interface IRepeatCustomerDTO {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgSpendPerCustomer: number;
}

export interface IAdvanceBookingDTO {
  _id: string;
  count: number;
  totalRevenue: number;
  percentage: number;
}

export interface IPotentialRevenueDTO {
  potentialRevenue: number;
  actualRevenue: number;
  realizationPercentage: number;
}

export interface IDynamicPricingDTO {
  avgBasePrice: number;
  avgShowtimePrice: number;
  avgFinalPrice: number;
  pricingImpact: number;
}

export interface IDiscountImpactDTO {
  totalSubtotal: number;
  totalDiscount: number;
  totalFinal: number;
  discountPercentage: number;
  bookingsWithDiscount: number;
  totalBookings: number;
}

export interface IAnalyticsRepository {
  getMonthlyRevenueTrends(ownerId: string, months?: number): Promise<IRevenueDTO[]>;
  getWeeklyRevenue(ownerId: string, weeks?: number): Promise<IRevenueDTO[]>;
  getDailyRevenue(ownerId: string, days?: number): Promise<IRevenueDTO[]>;
  getTheaterWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<ITheaterRevenueDTO[]>;
  getScreenWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<IScreenRevenueDTO[]>;
  getMovieWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<IMovieRevenueDTO[]>;
  
  getOverallOccupancy(ownerId: string, dateRange: IDateRange): Promise<IOccupancyDTO>;
  getAverageTicketPrice(ownerId: string, dateRange?: IDateRange): Promise<number>;
  getRevenuePerScreen(ownerId: string, dateRange?: IDateRange): Promise<IScreenRevenueDTO[]>;
  getRevenuePerShow(ownerId: string, dateRange?: IDateRange): Promise<IRevenueDTO[]>;
  getTimeSlotPerformance(ownerId: string, dateRange?: IDateRange): Promise<ITimeSlotDTO[]>;
  getWeekdayWeekendComparison(ownerId: string, dateRange?: IDateRange): Promise<IRevenueDTO[]>;
  
  getTopPerformingMovies(ownerId: string, limit?: number, dateRange?: IDateRange): Promise<IMoviePerformanceDTO[]>;
  getFormatPerformance(ownerId: string, dateRange?: IDateRange): Promise<IFormatPerformanceDTO[]>;
  getLanguagePerformance(ownerId: string, dateRange?: IDateRange): Promise<IFormatPerformanceDTO[]>;
  getMovieLifecycleTrends(ownerId: string, movieId: string, dateRange?: IDateRange): Promise<IRevenueDTO[]>;
  
  getCustomerSatisfactionRatings(ownerId: string, dateRange?: IDateRange): Promise<ICustomerSatisfactionDTO[]>;
  getRepeatCustomerRate(ownerId: string, dateRange?: IDateRange): Promise<IRepeatCustomerDTO>;
  getAdvanceBookingTrends(ownerId: string, dateRange?: IDateRange): Promise<IAdvanceBookingDTO[]>;
  getAverageSpendPerCustomer(ownerId: string, dateRange?: IDateRange): Promise<number>;
  getCancellationRate(ownerId: string, dateRange?: IDateRange): Promise<number>;
  
  getPotentialVsActualRevenue(ownerId: string, dateRange: IDateRange): Promise<IPotentialRevenueDTO>;
  getDynamicPricingImpact(ownerId: string, dateRange?: IDateRange): Promise<IDynamicPricingDTO>;
  getDiscountImpact(ownerId: string, dateRange?: IDateRange): Promise<IDiscountImpactDTO>;
  getPeakHourRevenue(ownerId: string, dateRange?: IDateRange): Promise<ITimeSlotDTO[]>;
  getSeasonalRevenuePatterns(ownerId: string, months?: number): Promise<IRevenueDTO[]>;
  
  getShowUtilizationRate(ownerId: string, dateRange?: IDateRange): Promise<IRevenueDTO[]>;
  getLowPerformingTimeSlots(ownerId: string, threshold?: number, dateRange?: IDateRange): Promise<ITimeSlotDTO[]>;
  getTheaterEfficiencyScore(ownerId: string, dateRange?: IDateRange): Promise<ITheaterRevenueDTO[]>;
  getRevenueGrowthRate(ownerId: string, period: 'monthly' | 'quarterly'): Promise<IRevenueDTO[]>;
  
  getOwnerTheaterIds(ownerId: string): Promise<Types.ObjectId[]>;
}
