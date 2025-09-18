//@ts-nocheck
import { Request, Response } from "express";
import { IAdminAnalyticsService } from "../interfaces/adminAnalytics.service.interface";
import { ANALYTICS_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";
import { StatusCodes } from "../../../utils/statuscodes";


export class AdminAnalyticsController {
  constructor(private readonly analyticsService: IAdminAnalyticsService) {}

  private buildDateRangeFromRequest(req: Request) {
    return {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined
    };
  }

  private handleError(res: Response, error: any): void {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message: errorMessage
      })
    );
  }

  // Comprehensive analytics endpoint
  async getComprehensiveAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getComprehensiveAnalytics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.ANALYTICS_RETRIEVED_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.ANALYTICS_RETRIEVAL_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Revenue analytics
  async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getRevenueAnalytics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.REVENUE_ANALYTICS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.REVENUE_ANALYTICS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMonthlyRevenueTrends(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getMonthlyRevenueTrends(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.MONTHLY_REVENUE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.MONTHLY_REVENUE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getDailyRevenueTrends(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getDailyRevenueTrends(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.DAILY_REVENUE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.DAILY_REVENUE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTheaterWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getTheaterWiseRevenue(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.THEATER_REVENUE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.THEATER_REVENUE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOwnerWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getOwnerWiseRevenue(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.OWNER_REVENUE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.OWNER_REVENUE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMovieWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getMovieWiseRevenue(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_REVENUE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_REVENUE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Performance metrics
  async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getPerformanceMetrics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.PERFORMANCE_METRICS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.PERFORMANCE_METRICS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOccupancyAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getOccupancyAnalytics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.OCCUPANCY_ANALYTICS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.OCCUPANCY_ANALYTICS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTimeSlotPerformance(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getTimeSlotPerformance(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.TIME_SLOT_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.TIME_SLOT_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Customer insights
  async getCustomerInsights(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getCustomerInsights(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.CUSTOMER_INSIGHTS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.CUSTOMER_INSIGHTS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getCustomerSatisfaction(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getCustomerSatisfaction(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.CUSTOMER_SATISFACTION_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.CUSTOMER_SATISFACTION_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Movie analytics
  async getMoviePerformance(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getMoviePerformance(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_PERFORMANCE_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_PERFORMANCE_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTopPerformingMovies(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.analyticsService.getTopPerformingMovies(dateRange, limit);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.TOP_MOVIES_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.TOP_MOVIES_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMovieFormatAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getMovieFormatAnalytics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_FORMAT_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.MOVIE_FORMAT_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Financial KPIs
  async getFinancialKPIs(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getFinancialKPIs(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.FINANCIAL_KPIS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.FINANCIAL_KPIS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Growth rates
  async getGrowthRates(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getGrowthRates(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.GROWTH_RATES_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.GROWTH_RATES_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Operational analytics
  async getOperationalAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const dateRange = this.buildDateRangeFromRequest(req);
      
      const result = await this.analyticsService.getOperationalAnalytics(dateRange);
      
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message || ANALYTICS_MESSAGES.OPERATIONAL_ANALYTICS_SUCCESS,
            data: result.data
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message || ANALYTICS_MESSAGES.OPERATIONAL_ANALYTICS_FAILED
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
