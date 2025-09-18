
import { ServiceResponse } from "../../../interfaces/interface";
import { IDateRange } from "../../adminAnalytics/dtos/dtos";
import {
  IAnalyticsService,
  IAnalyticsFilterDTO,
  IComprehensiveAnalyticsDTO,
  IRevenueAnalyticsDTO,
  IPerformanceMetricsDTO,
  IMovieAnalyticsDTO,
  ICustomerInsightsDTO,
  IFinancialKPIsDTO,
  IOperationalAnalyticsDTO,
  IAnalyticsSummaryDTO,
  IMonthlyRevenueDTO,
  IWeeklyRevenueDTO,
  IDailyRevenueDTO,
  ITheaterRevenueDTO,
  IScreenRevenueDTO,
  IMovieRevenueDTO,
  IOccupancyDTO,
  IShowRevenueDTO,
  ITimeSlotDTO,
  IWeekdayWeekendDTO,
  ITopMovieDTO,
  IFormatPerformanceDTO,
  ILanguagePerformanceDTO,
  IMovieLifecycleDTO,
  ICustomerSatisfactionDTO,
  IRepeatCustomerDTO,
  IAdvanceBookingDTO,
  IPotentialRevenueDTO,
  IDynamicPricingDTO,
  IDiscountImpactDTO,
  ISeasonalPatternDTO,
  IShowUtilizationDTO,
  ITheaterEfficiencyDTO,
  IGrowthRateDTO,
} from "../interfaces/analytics.repository.interface";
import { IAnalyticsRepository } from "../interfaces/analytics.repository.interface";

export class AnalyticsService implements IAnalyticsService {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async getComprehensiveAnalytics(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IComprehensiveAnalyticsDTO>> {
    try {
      if (!filters.ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
          data: null
        };
      }

      const [
        revenueAnalytics,
        performanceMetrics,
        movieAnalytics,
        customerInsights,
        financialKPIs,
        operationalAnalytics,
        summary
      ] = await Promise.all([
        this.getRevenueAnalytics(filters),
        this.getPerformanceMetrics(filters),
        this.getMovieAnalytics(filters),
        this.getCustomerInsights(filters),
        this.getFinancialKPIs(filters),
        this.getOperationalAnalytics(filters),
        this.getAnalyticsSummary(filters.ownerId, filters.dateRange)
      ]);

      if (!revenueAnalytics.success || !performanceMetrics.success) {
        return {
          success: false,
          message: "Failed to retrieve comprehensive analytics data",
          data: null
        };
      }

      const comprehensiveData: IComprehensiveAnalyticsDTO = {
        revenueAnalytics: revenueAnalytics.data!,
        performanceMetrics: performanceMetrics.data!,
        movieAnalytics: movieAnalytics.data!,
        customerInsights: customerInsights.data!,
        financialKPIs: financialKPIs.data!,
        operationalAnalytics: operationalAnalytics.data!,
        summary: summary.data!
      };

      return {
        success: true,
        message: "Comprehensive analytics retrieved successfully",
        data: comprehensiveData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get comprehensive analytics";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getRevenueAnalytics(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IRevenueAnalyticsDTO>> {
    try {
      const [monthly, weekly, daily, theaterWise, screenWise, movieWise] = await Promise.all([
        this.getMonthlyRevenueTrends(filters.ownerId, 12),
        this.getWeeklyRevenue(filters.ownerId, 12),
        this.getDailyRevenue(filters.ownerId, 30),
        this.getTheaterWiseRevenue(filters.ownerId, filters.dateRange),
        this.getScreenWiseRevenue(filters.ownerId, filters.dateRange),
        this.getMovieWiseRevenue(filters.ownerId, filters.dateRange)
      ]);

      const revenueAnalytics: IRevenueAnalyticsDTO = {
        monthly: monthly.data || [],
        weekly: weekly.data || [],
        daily: daily.data || [],
        theaterWise: theaterWise.data || [],
        screenWise: screenWise.data || [],
        movieWise: movieWise.data || []
      };

      return {
        success: true,
        message: "Revenue analytics retrieved successfully",
        data: revenueAnalytics
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get revenue analytics";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getMonthlyRevenueTrends(ownerId: string, months: number = 12): Promise<ServiceResponse<IMonthlyRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getMonthlyRevenueTrends(ownerId, months);
      
      const monthlyRevenue: IMonthlyRevenueDTO[] = data.map((item, index) => {
        const current = item.totalRevenue;
        const previous = index > 0 ? data[index - 1].totalRevenue : current;
        const growthRate = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        return {
          period: {
            year: item._id.year,
            month: item._id.month
          },
          totalRevenue: item.totalRevenue,
          totalBookings: item.totalBookings,
          avgTicketPrice: item.avgTicketPrice || 0,
          growthRate
        };
      });

      return {
        success: true,
        message: "Monthly revenue trends retrieved successfully",
        data: monthlyRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get monthly revenue trends";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getWeeklyRevenue(ownerId: string, weeks: number = 12): Promise<ServiceResponse<IWeeklyRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getWeeklyRevenue(ownerId, weeks);
      
      const weeklyRevenue: IWeeklyRevenueDTO[] = data.map(item => ({
        period: {
          year: item._id.year,
          week: item._id.week
        },
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice || 0
      }));

      return {
        success: true,
        message: "Weekly revenue retrieved successfully",
        data: weeklyRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get weekly revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getDailyRevenue(ownerId: string, days: number = 30): Promise<ServiceResponse<IDailyRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getDailyRevenue(ownerId, days);
      
      const dailyRevenue: IDailyRevenueDTO[] = data.map(item => ({
        period: {
          year: item._id.year,
          month: item._id.month,
          day: item._id.day
        },
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice || 0
      }));

      return {
        success: true,
        message: "Daily revenue retrieved successfully",
        data: dailyRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get daily revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getTheaterWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ITheaterRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getTheaterWiseRevenue(ownerId, dateRange);
      const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
      
      const theaterRevenue: ITheaterRevenueDTO[] = data.map(item => ({
        theaterId: item.theaterId.toString(),
        theaterName: item.theaterName || 'Unknown Theater',
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice || 0,
        marketShare: totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0
      }));

      return {
        success: true,
        message: "Theater-wise revenue retrieved successfully",
        data: theaterRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get theater-wise revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getScreenWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IScreenRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getScreenWiseRevenue(ownerId, dateRange);
      
      const screenRevenue: IScreenRevenueDTO[] = data.map(item => ({
        screenId: item.screenId.toString(),
        theaterId: item.theaterId.toString(),
        screenName: item.screenName || 'Unknown Screen',
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice || 0,
        utilizationRate: this.calculateUtilizationRate(item.totalBookings)
      }));

      return {
        success: true,
        message: "Screen-wise revenue retrieved successfully",
        data: screenRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get screen-wise revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getMovieWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IMovieRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getMovieWiseRevenue(ownerId, dateRange);
      const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
      
      const movieRevenue: IMovieRevenueDTO[] = data.map(item => ({
        movieId: item.movieId.toString(),
        movieTitle: item.movieTitle || 'Unknown Movie',
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        totalTickets: item.totalTickets,
        avgTicketPrice: item.avgTicketPrice || 0,
        revenueShare: totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0
      }));

      return {
        success: true,
        message: "Movie-wise revenue retrieved successfully",
        data: movieRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get movie-wise revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Performance Metrics
  async getPerformanceMetrics(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IPerformanceMetricsDTO>> {
    try {
      if (!filters.dateRange || !filters.dateRange.start || !filters.dateRange.end) {
        return {
          success: false,
          message: "Date range is required for performance metrics",
          data: null
        };
      }

      const [
        occupancy,
        avgTicketPrice,
        revenuePerScreen,
        revenuePerShow,
        timeSlotPerformance,
        weekdayWeekendComparison
      ] = await Promise.all([
        this.getOverallOccupancy(filters.ownerId, filters.dateRange),
        this.getAverageTicketPrice(filters.ownerId, filters.dateRange),
        this.getRevenuePerScreen(filters.ownerId, filters.dateRange),
        this.getRevenuePerShow(filters.ownerId, filters.dateRange),
        this.getTimeSlotPerformance(filters.ownerId, filters.dateRange),
        this.getWeekdayWeekendComparison(filters.ownerId, filters.dateRange)
      ]);

      const performanceMetrics: IPerformanceMetricsDTO = {
        occupancy: occupancy.data!,
        avgTicketPrice: avgTicketPrice.data || 0,
        revenuePerScreen: revenuePerScreen.data || [],
        revenuePerShow: revenuePerShow.data || [],
        timeSlotPerformance: timeSlotPerformance.data || [],
        weekdayWeekendComparison: weekdayWeekendComparison.data || []
      };

      return {
        success: true,
        message: "Performance metrics retrieved successfully",
        data: performanceMetrics
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get performance metrics";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getOverallOccupancy(ownerId: string, dateRange: IDateRange): Promise<ServiceResponse<IOccupancyDTO>> {
    try {
      const data = await this.analyticsRepository.getOverallOccupancy(ownerId, dateRange);
      
      const occupancyDTO: IOccupancyDTO = {
        totalSeatsAvailable: data.totalSeatsAvailable,
        totalSeatsBooked: data.totalSeatsBooked,
        occupancyPercentage: data.occupancyPercentage,
        trend: this.determineTrend(data.occupancyPercentage)
      };

      return {
        success: true,
        message: "Overall occupancy retrieved successfully",
        data: occupancyDTO
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get overall occupancy";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getAverageTicketPrice(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<number>> {
    try {
      const avgPrice = await this.analyticsRepository.getAverageTicketPrice(ownerId, dateRange);

      return {
        success: true,
        message: "Average ticket price retrieved successfully",
        data: avgPrice
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get average ticket price";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getRevenuePerScreen(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IScreenRevenueDTO[]>> {
    try {
      return await this.getScreenWiseRevenue(ownerId, dateRange);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get revenue per screen";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getRevenuePerShow(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IShowRevenueDTO[]>> {
    try {
      const data = await this.analyticsRepository.getRevenuePerShow(ownerId, dateRange);
      
      const showRevenue: IShowRevenueDTO[] = data.map(item => ({
        showtimeId: item._id.toString(),
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice || 0,
        occupancyRate: this.calculateOccupancyRate(item.totalBookings)
      }));

      return {
        success: true,
        message: "Revenue per show retrieved successfully",
        data: showRevenue
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get revenue per show";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getTimeSlotPerformance(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ITimeSlotDTO[]>> {
    try {
      const data = await this.analyticsRepository.getTimeSlotPerformance(ownerId, dateRange);
      
      const timeSlotPerformance: ITimeSlotDTO[] = data.map(item => ({
        timeSlot: item._id,
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgOccupancy: item.avgOccupancy,
        performance: this.categorizePerformance(item.avgOccupancy)
      }));

      return {
        success: true,
        message: "Time slot performance retrieved successfully",
        data: timeSlotPerformance
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get time slot performance";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getWeekdayWeekendComparison(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IWeekdayWeekendDTO[]>> {
    try {
      const data = await this.analyticsRepository.getWeekdayWeekendComparison(ownerId, dateRange);
      
      const comparison: IWeekdayWeekendDTO[] = data.map(item => {
        const type = item._id ? 'weekend' : 'weekday';
        const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);
        
        return {
          type,
          totalRevenue: item.totalRevenue,
          totalBookings: item.totalBookings,
          avgTicketPrice: item.avgTicketPrice || 0,
          performanceRatio: totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0
        };
      });

      return {
        success: true,
        message: "Weekday weekend comparison retrieved successfully",
        data: comparison
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get weekday weekend comparison";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Movie & Content Analytics
  async getMovieAnalytics(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IMovieAnalyticsDTO>> {
    try {
      const [topMovies, formatPerformance, languagePerformance] = await Promise.all([
        this.getTopPerformingMovies(filters.ownerId, filters.limit || 10, filters.dateRange),
        this.getFormatPerformance(filters.ownerId, filters.dateRange),
        this.getLanguagePerformance(filters.ownerId, filters.dateRange)
      ]);

      const movieAnalytics: IMovieAnalyticsDTO = {
        topMovies: topMovies.data || [],
        formatPerformance: formatPerformance.data || [],
        languagePerformance: languagePerformance.data || [],
        movieLifecycle: [] // Will be populated if movieId is provided
      };

      return {
        success: true,
        message: "Movie analytics retrieved successfully",
        data: movieAnalytics
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get movie analytics";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getTopPerformingMovies(ownerId: string, limit: number = 10, dateRange?: IDateRange): Promise<ServiceResponse<ITopMovieDTO[]>> {
    try {
      const data = await this.analyticsRepository.getTopPerformingMovies(ownerId, limit, dateRange);
      
      const topMovies: ITopMovieDTO[] = data.map((item, index) => ({
        movieId: item._id.toString(),
        movieTitle: item.movieTitle,
        totalRevenue: item.totalRevenue,
        totalTickets: item.totalTickets,
        totalShows: item.totalShows,
        avgOccupancy: item.avgOccupancy,
        rank: index + 1
      }));

      return {
        success: true,
        message: "Top performing movies retrieved successfully",
        data: topMovies
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get top performing movies";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getFormatPerformance(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IFormatPerformanceDTO[]>> {
    try {
      const data = await this.analyticsRepository.getFormatPerformance(ownerId, dateRange);
      const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
      
      const formatPerformance: IFormatPerformanceDTO[] = data.map(item => ({
        format: item._id,
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice,
        marketShare: totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0,
        profitability: this.categorizeProfitability(item.avgTicketPrice)
      }));

      return {
        success: true,
        message: "Format performance retrieved successfully",
        data: formatPerformance
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get format performance";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getLanguagePerformance(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ILanguagePerformanceDTO[]>> {
    try {
      const data = await this.analyticsRepository.getLanguagePerformance(ownerId, dateRange);
      const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
      
      const languagePerformance: ILanguagePerformanceDTO[] = data.map(item => ({
        language: item._id,
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgTicketPrice: item.avgTicketPrice,
        marketShare: totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0,
        audiencePreference: this.calculateAudiencePreference(item.totalBookings, totalRevenue)
      }));

      return {
        success: true,
        message: "Language performance retrieved successfully",
        data: languagePerformance
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get language performance";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getMovieLifecycleTrends(ownerId: string, movieId: string, dateRange?: IDateRange): Promise<ServiceResponse<IMovieLifecycleDTO[]>> {
    try {
      const data = await this.analyticsRepository.getMovieLifecycleTrends(ownerId, movieId, dateRange);
      
      const lifecycleTrends: IMovieLifecycleDTO[] = data.map((item, index) => ({
        period: `${item._id.year}-${item._id.month}-${item._id.day}`,
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        performanceStage: this.determineMovieStage(index, data.length, item.totalRevenue)
      }));

      return {
        success: true,
        message: "Movie lifecycle trends retrieved successfully",
        data: lifecycleTrends
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get movie lifecycle trends";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Customer Insights
  async getCustomerInsights(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<ICustomerInsightsDTO>> {
    try {
      const [satisfaction, repeatCustomerRate, advanceBookingTrends, avgSpendPerCustomer, cancellationRate] = await Promise.all([
        this.getCustomerSatisfactionRatings(filters.ownerId, filters.dateRange),
        this.getRepeatCustomerRate(filters.ownerId, filters.dateRange),
        this.getAdvanceBookingTrends(filters.ownerId, filters.dateRange),
        this.getAverageSpendPerCustomer(filters.ownerId, filters.dateRange),
        this.getCancellationRate(filters.ownerId, filters.dateRange)
      ]);

      const customerInsights: ICustomerInsightsDTO = {
        satisfaction: satisfaction.data || [],
        repeatCustomerRate: repeatCustomerRate.data!,
        advanceBookingTrends: advanceBookingTrends.data || [],
        avgSpendPerCustomer: avgSpendPerCustomer.data || 0,
        cancellationRate: cancellationRate.data || 0
      };

      return {
        success: true,
        message: "Customer insights retrieved successfully",
        data: customerInsights
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get customer insights";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getCustomerSatisfactionRatings(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ICustomerSatisfactionDTO[]>> {
    try {
      const data = await this.analyticsRepository.getCustomerSatisfactionRatings(ownerId, dateRange);
      
      const satisfactionRatings: ICustomerSatisfactionDTO[] = data.map(item => ({
        theaterId: item._id.toString(),
        theaterName: item.theaterName || 'Unknown Theater',
        avgRating: item.avgRating,
        totalReviews: item.totalReviews,
        ratingDistribution: this.calculateRatingDistribution(item.ratingDistribution),
        satisfactionLevel: this.determineSatisfactionLevel(item.avgRating)
      }));

      return {
        success: true,
        message: "Customer satisfaction ratings retrieved successfully",
        data: satisfactionRatings
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get customer satisfaction ratings";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getRepeatCustomerRate(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IRepeatCustomerDTO>> {
    try {
      const data = await this.analyticsRepository.getRepeatCustomerRate(ownerId, dateRange);
      
      const repeatCustomerData: IRepeatCustomerDTO = {
        totalCustomers: data.totalCustomers,
        repeatCustomers: data.repeatCustomers,
        repeatRate: data.repeatRate,
        avgSpendPerCustomer: data.avgSpendPerCustomer,
        loyaltyScore: this.calculateLoyaltyScore(data.repeatRate, data.avgSpendPerCustomer)
      };

      return {
        success: true,
        message: "Repeat customer rate retrieved successfully",
        data: repeatCustomerData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get repeat customer rate";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getAdvanceBookingTrends(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IAdvanceBookingDTO[]>> {
    try {
      const data = await this.analyticsRepository.getAdvanceBookingTrends(ownerId, dateRange);
      
      const advanceBookingTrends: IAdvanceBookingDTO[] = data.map(item => ({
        category: item._id,
        count: item.count,
        totalRevenue: item.totalRevenue,
        percentage: item.percentage,
        trend: this.determineTrend(item.percentage)
      }));

      return {
        success: true,
        message: "Advance booking trends retrieved successfully",
        data: advanceBookingTrends
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get advance booking trends";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getAverageSpendPerCustomer(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<number>> {
    try {
      const avgSpend = await this.analyticsRepository.getAverageSpendPerCustomer(ownerId, dateRange);

      return {
        success: true,
        message: "Average spend per customer retrieved successfully",
        data: avgSpend
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get average spend per customer";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getCancellationRate(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<number>> {
    try {
      const cancellationRate = await this.analyticsRepository.getCancellationRate(ownerId, dateRange);

      return {
        success: true,
        message: "Cancellation rate retrieved successfully",
        data: cancellationRate
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get cancellation rate";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Financial KPIs
  async getFinancialKPIs(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IFinancialKPIsDTO>> {
    try {
      if (!filters.dateRange) {
        return {
          success: false,
          message: "Date range is required for financial KPIs",
          data: null
        };
      }

      const [potentialVsActual, dynamicPricingImpact, discountImpact, peakHourRevenue, seasonalPatterns] = await Promise.all([
        this.getPotentialVsActualRevenue(filters.ownerId, filters.dateRange),
        this.getDynamicPricingImpact(filters.ownerId, filters.dateRange),
        this.getDiscountImpact(filters.ownerId, filters.dateRange),
        this.getPeakHourRevenue(filters.ownerId, filters.dateRange),
        this.getSeasonalRevenuePatterns(filters.ownerId, 12)
      ]);

      const financialKPIs: IFinancialKPIsDTO = {
        potentialVsActual: potentialVsActual.data!,
        dynamicPricingImpact: dynamicPricingImpact.data!,
        discountImpact: discountImpact.data!,
        peakHourRevenue: peakHourRevenue.data || [],
        seasonalPatterns: seasonalPatterns.data || []
      };

      return {
        success: true,
        message: "Financial KPIs retrieved successfully",
        data: financialKPIs
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get financial KPIs";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getPotentialVsActualRevenue(ownerId: string, dateRange: IDateRange): Promise<ServiceResponse<IPotentialRevenueDTO>> {
    try {
      const data = await this.analyticsRepository.getPotentialVsActualRevenue(ownerId, dateRange);
      
      const potentialRevenueData: IPotentialRevenueDTO = {
        potentialRevenue: data.potentialRevenue,
        actualRevenue: data.actualRevenue,
        realizationPercentage: data.realizationPercentage,
        missedOpportunity: data.potentialRevenue - data.actualRevenue,
        efficiency: this.categorizeEfficiency(data.realizationPercentage)
      };

      return {
        success: true,
        message: "Potential vs actual revenue retrieved successfully",
        data: potentialRevenueData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get potential vs actual revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getDynamicPricingImpact(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IDynamicPricingDTO>> {
    try {
      const data = await this.analyticsRepository.getDynamicPricingImpact(ownerId, dateRange);
      
      const dynamicPricingData: IDynamicPricingDTO = {
        avgBasePrice: data.avgBasePrice,
        avgShowtimePrice: data.avgShowtimePrice,
        avgFinalPrice: data.avgFinalPrice,
        pricingImpact: data.pricingImpact,
        effectiveness: this.evaluatePricingEffectiveness(data.pricingImpact)
      };

      return {
        success: true,
        message: "Dynamic pricing impact retrieved successfully",
        data: dynamicPricingData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get dynamic pricing impact";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getDiscountImpact(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IDiscountImpactDTO>> {
    try {
      const data = await this.analyticsRepository.getDiscountImpact(ownerId, dateRange);
      
      const discountImpactData: IDiscountImpactDTO = {
        totalSubtotal: data.totalSubtotal,
        totalDiscount: data.totalDiscount,
        totalFinal: data.totalFinal,
        discountPercentage: data.discountPercentage,
        bookingsWithDiscount: data.bookingsWithDiscount,
        totalBookings: data.totalBookings,
        roi: this.calculateDiscountROI(data.totalFinal, data.totalDiscount, data.bookingsWithDiscount)
      };

      return {
        success: true,
        message: "Discount impact retrieved successfully",
        data: discountImpactData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get discount impact";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getPeakHourRevenue(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ITimeSlotDTO[]>> {
    try {
      return await this.getTimeSlotPerformance(ownerId, dateRange);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get peak hour revenue";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getSeasonalRevenuePatterns(ownerId: string, months: number = 12): Promise<ServiceResponse<ISeasonalPatternDTO[]>> {
    try {
      const data = await this.analyticsRepository.getSeasonalRevenuePatterns(ownerId, months);
      
      const seasonalPatterns: ISeasonalPatternDTO[] = data.map((item, index) => {
        const current = item.totalRevenue;
        const previous = index > 0 ? data[index - 1].totalRevenue : current;
        const yearOverYearGrowth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        return {
          period: `${item._id.year}-${item._id.month}`,
          totalRevenue: item.totalRevenue,
          seasonality: this.determineSeason(item._id.month),
          yearOverYearGrowth
        };
      });

      return {
        success: true,
        message: "Seasonal revenue patterns retrieved successfully",
        data: seasonalPatterns
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get seasonal revenue patterns";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Operational Analytics
  async getOperationalAnalytics(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<IOperationalAnalyticsDTO>> {
    try {
      const [showUtilization, lowPerformingTimeSlots, theaterEfficiency, revenueGrowthRate] = await Promise.all([
        this.getShowUtilizationRate(filters.ownerId, filters.dateRange),
        this.getLowPerformingTimeSlots(filters.ownerId, filters.threshold || 50, filters.dateRange),
        this.getTheaterEfficiencyScore(filters.ownerId, filters.dateRange),
        this.getRevenueGrowthRate(filters.ownerId, 'monthly')
      ]);

      const operationalAnalytics: IOperationalAnalyticsDTO = {
        showUtilization: showUtilization.data || [],
        lowPerformingTimeSlots: lowPerformingTimeSlots.data || [],
        theaterEfficiency: theaterEfficiency.data || [],
        revenueGrowthRate: revenueGrowthRate.data || []
      };

      return {
        success: true,
        message: "Operational analytics retrieved successfully",
        data: operationalAnalytics
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get operational analytics";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getShowUtilizationRate(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IShowUtilizationDTO[]>> {
    try {
      const data = await this.analyticsRepository.getShowUtilizationRate(ownerId, dateRange);
      
      const showUtilization: IShowUtilizationDTO[] = data.map(item => ({
        showtimeId: item._id.toString(),
        totalRevenue: item.totalRevenue,
        utilizationRate: this.calculateUtilizationRate(item.totalBookings),
        performance: this.categorizeShowPerformance(item.totalRevenue)
      }));

      return {
        success: true,
        message: "Show utilization rate retrieved successfully",
        data: showUtilization
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get show utilization rate";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getLowPerformingTimeSlots(ownerId: string, threshold: number = 50, dateRange?: IDateRange): Promise<ServiceResponse<ITimeSlotDTO[]>> {
    try {
      const data = await this.analyticsRepository.getLowPerformingTimeSlots(ownerId, threshold, dateRange);
      
      const lowPerformingSlots: ITimeSlotDTO[] = data.map(item => ({
        timeSlot: item._id,
        totalRevenue: item.totalRevenue,
        totalBookings: item.totalBookings,
        avgOccupancy: item.avgOccupancy,
        performance: 'low'
      }));

      return {
        success: true,
        message: "Low performing time slots retrieved successfully",
        data: lowPerformingSlots
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get low performing time slots";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getTheaterEfficiencyScore(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<ITheaterEfficiencyDTO[]>> {
    try {
      const data = await this.analyticsRepository.getTheaterEfficiencyScore(ownerId, dateRange);
      
      const theaterEfficiency: ITheaterEfficiencyDTO[] = data.map((item, index) => ({
        theaterId: item.theaterId.toString(),
        theaterName: item.theaterName || 'Unknown Theater',
        totalRevenue: item.totalRevenue,
        efficiencyScore: this.calculateEfficiencyScore(item.totalRevenue, item.totalBookings),
        ranking: index + 1
      }));

      return {
        success: true,
        message: "Theater efficiency score retrieved successfully",
        data: theaterEfficiency
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get theater efficiency score";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getRevenueGrowthRate(ownerId: string, period: 'monthly' | 'quarterly'): Promise<ServiceResponse<IGrowthRateDTO[]>> {
    try {
      const data = await this.analyticsRepository.getRevenueGrowthRate(ownerId, period);
      
      const growthRate: IGrowthRateDTO[] = data.map((item, index) => {
        const current = item.totalRevenue;
        const previous = index > 0 ? data[index - 1].totalRevenue : current;
        const growthRate = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        return {
          period: period === 'monthly' ? `${item._id.year}-${item._id.month}` : `${item._id.year}-Q${item._id.quarter}`,
          totalRevenue: item.totalRevenue,
          growthRate,
          trend: this.determineGrowthTrend(growthRate)
        };
      });

      return {
        success: true,
        message: "Revenue growth rate retrieved successfully",
        data: growthRate
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get revenue growth rate";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Utility methods
  async generateAnalyticsReport(filters: IAnalyticsFilterDTO): Promise<ServiceResponse<string>> {
    try {
      // Implementation for generating comprehensive analytics report
      const comprehensiveData = await this.getComprehensiveAnalytics(filters);
      
      if (!comprehensiveData.success) {
        return {
          success: false,
          message: "Failed to generate analytics report",
          data: null
        };
      }

      // Generate report content (this is a simplified version)
      const reportContent = `Analytics Report for Owner: ${filters.ownerId}`;

      return {
        success: true,
        message: "Analytics report generated successfully",
        data: reportContent
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate analytics report";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async exportAnalyticsData(filters: IAnalyticsFilterDTO, format: 'csv' | 'excel' | 'pdf'): Promise<ServiceResponse<Buffer>> {
    try {
      // Implementation for exporting analytics data in different formats
      // This would typically use libraries like csv-writer, exceljs, or puppeteer for PDF
      
      const buffer = Buffer.from('Mock export data');

      return {
        success: true,
        message: `Analytics data exported successfully as ${format}`,
        data: buffer
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to export analytics data";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  async getAnalyticsSummary(ownerId: string, dateRange?: IDateRange): Promise<ServiceResponse<IAnalyticsSummaryDTO>> {
    try {
      // Get basic metrics for summary
      const [theaterRevenue, movieRevenue, occupancy, avgTicketPrice] = await Promise.all([
        this.analyticsRepository.getTheaterWiseRevenue(ownerId, dateRange),
        this.analyticsRepository.getMovieWiseRevenue(ownerId, dateRange),
        dateRange ? this.analyticsRepository.getOverallOccupancy(ownerId, dateRange) : null,
        this.analyticsRepository.getAverageTicketPrice(ownerId, dateRange)
      ]);

      const totalRevenue = theaterRevenue.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalBookings = theaterRevenue.reduce((sum, item) => sum + item.totalBookings, 0);
      const topTheater = theaterRevenue.length > 0 ? theaterRevenue[0].theaterName || 'N/A' : 'N/A';
      const topMovie = movieRevenue.length > 0 ? movieRevenue[0].movieTitle || 'N/A' : 'N/A';

      const summary: IAnalyticsSummaryDTO = {
        totalRevenue,
        totalBookings,
        avgOccupancy: occupancy?.occupancyPercentage || 0,
        topPerformingTheater: topTheater,
        topPerformingMovie: topMovie,
        revenueGrowth: 0, 
        customerSatisfaction: 0, 
        keyInsights: [
          `Total revenue generated: ₹${totalRevenue.toLocaleString()}`,
          `Top performing theater: ${topTheater}`,
          `Top performing movie: ${topMovie}`
        ],
        recommendations: [
          'Focus on high-performing time slots',
          'Optimize pricing for low-occupancy shows',
          'Enhance customer experience based on feedback'
        ]
      };

      return {
        success: true,
        message: "Analytics summary retrieved successfully",
        data: summary
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get analytics summary";
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Private helper methods for calculations and categorizations
  private calculateUtilizationRate(bookings: number): number {
    // Simple calculation - would need more context for accurate calculation
    return Math.min(bookings * 10, 100);
  }

  private calculateOccupancyRate(bookings: number): number {
    // Simple calculation - would need seat capacity for accurate calculation
    return Math.min(bookings * 5, 100);
  }

  private categorizePerformance(avgOccupancy: number): 'high' | 'medium' | 'low' {
    if (avgOccupancy >= 70) return 'high';
    if (avgOccupancy >= 40) return 'medium';
    return 'low';
  }

  private categorizeShowPerformance(revenue: number): 'excellent' | 'good' | 'poor' {
    if (revenue >= 50000) return 'excellent';
    if (revenue >= 20000) return 'good';
    return 'poor';
  }

  private categorizeEfficiency(percentage: number): 'high' | 'medium' | 'low' {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  }

  private categorizeProfitability(avgPrice: number): 'high' | 'medium' | 'low' {
    if (avgPrice >= 500) return 'high';
    if (avgPrice >= 300) return 'medium';
    return 'low';
  }

  private determineTrend(value: number): 'increasing' | 'decreasing' | 'stable' {
    // Simplified logic - would need historical data for accurate trend analysis
    if (value >= 70) return 'increasing';
    if (value <= 30) return 'decreasing';
    return 'stable';
  }

  private determineGrowthTrend(growthRate: number): 'positive' | 'negative' | 'stable' {
    if (growthRate > 5) return 'positive';
    if (growthRate < -5) return 'negative';
    return 'stable';
  }

  private determineSatisfactionLevel(rating: number): 'excellent' | 'good' | 'average' | 'poor' {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 3.5) return 'good';
    if (rating >= 2.5) return 'average';
    return 'poor';
  }

  private determineMovieStage(index: number, total: number, revenue: number): 'opening' | 'peak' | 'declining' | 'steady' {
    const position = index / total;
    if (position <= 0.2) return 'opening';
    if (position <= 0.6 && revenue >= 50000) return 'peak';
    if (position > 0.6 && revenue < 20000) return 'declining';
    return 'steady';
  }

  private determineSeason(month: number): 'peak' | 'off-peak' | 'normal' {
    // Simplified seasonality logic
    if ([12, 1, 4, 5, 10, 11].includes(month)) return 'peak'; // Holiday/festival months
    if ([6, 7, 8].includes(month)) return 'off-peak'; // Monsoon/low season
    return 'normal';
  }

  private calculateAudiencePreference(bookings: number, totalRevenue: number): number {
    // Simple preference calculation
    return totalRevenue > 0 ? (bookings / totalRevenue) * 100000 : 0;
  }

  private calculateLoyaltyScore(repeatRate: number, avgSpend: number): number {
    // Weighted loyalty score
    return (repeatRate * 0.6) + (Math.min(avgSpend / 1000, 100) * 0.4);
  }

  private calculateDiscountROI(totalFinal: number, totalDiscount: number, discountBookings: number): number {
    // Simple ROI calculation for discount campaigns
    return discountBookings > 0 ? (totalFinal / (totalDiscount || 1)) * 100 : 0;
  }

  private calculateEfficiencyScore(revenue: number, bookings: number): number {
    // Simple efficiency calculation
    return bookings > 0 ? (revenue / bookings) / 100 : 0;
  }

  private calculateRatingDistribution(ratings: number[]): {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  } {
    const distribution = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };
    
    ratings.forEach(rating => {
      switch (rating) {
        case 1: distribution.star1++; break;
        case 2: distribution.star2++; break;
        case 3: distribution.star3++; break;
        case 4: distribution.star4++; break;
        case 5: distribution.star5++; break;
      }
    });

    return distribution;
  }

  private evaluatePricingEffectiveness(impact: number): 'positive' | 'neutral' | 'negative' {
    if (impact > 10) return 'positive';
    if (impact < -10) return 'negative';
    return 'neutral';
  }
}
