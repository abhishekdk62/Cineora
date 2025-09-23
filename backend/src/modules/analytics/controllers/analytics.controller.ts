import { Request, Response } from "express";
import {
  IAnalyticsService,
  IAnalyticsFilterDTO,
} from "../interfaces/analytics.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { createResponse } from "../../../utils/createResponse";

const ANALYTICS_MESSAGES = {
  ANALYTICS_RETRIEVED_SUCCESS: "Analytics data retrieved successfully",
  REVENUE_ANALYTICS_SUCCESS: "Revenue analytics retrieved successfully",
  PERFORMANCE_METRICS_SUCCESS: "Performance metrics retrieved successfully",
  MOVIE_ANALYTICS_SUCCESS: "Movie analytics retrieved successfully",
  CUSTOMER_INSIGHTS_SUCCESS: "Customer insights retrieved successfully",
  FINANCIAL_KPIS_SUCCESS: "Financial KPIs retrieved successfully",
  OPERATIONAL_ANALYTICS_SUCCESS: "Operational analytics retrieved successfully",
  ANALYTICS_SUMMARY_SUCCESS: "Analytics summary retrieved successfully",
  REPORT_GENERATED_SUCCESS: "Analytics report generated successfully",
  DATA_EXPORTED_SUCCESS: "Analytics data exported successfully",

  AUTH_REQUIRED: "Authentication required",
  OWNER_ID_REQUIRED: "Owner ID is required",
  DATE_RANGE_REQUIRED: "Date range is required",
  INVALID_DATE_RANGE: "Invalid date range provided",
  INVALID_TIMEFRAME:
    "Invalid timeframe. Must be 'daily', 'weekly', 'monthly', or 'quarterly'",
  INVALID_EXPORT_FORMAT:
    "Invalid export format. Must be 'csv', 'excel', or 'pdf'",
  INVALID_LIMIT: "Limit must be a positive number",
  INVALID_THRESHOLD: "Threshold must be a positive number between 0 and 100",
  MOVIE_ID_REQUIRED: "Movie ID is required for movie lifecycle trends",
  INTERNAL_SERVER_ERROR: "Internal server error occurred",
};

export class AnalyticsController {
  constructor(private readonly analyticsService: IAnalyticsService) {}

  async getComprehensiveAnalytics(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }
      const filters = this.buildAnalyticsFilters(req, ownerId);
      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }
      const result = await this.analyticsService.getComprehensiveAnalytics(
        filters
      );
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.ANALYTICS_RETRIEVED_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRevenueAnalytics(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.getRevenueAnalytics(filters);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.REVENUE_ANALYTICS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMonthlyRevenueTrends(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const months = req.query.months
        ? parseInt(req.query.months as string)
        : 12;

      if (months <= 0 || months > 60) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Months must be between 1 and 60",
          })
        );
        return;
      }

      const result = await this.analyticsService.getMonthlyRevenueTrends(
        ownerId,
        months
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getWeeklyRevenue(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const weeks = req.query.weeks ? parseInt(req.query.weeks as string) : 12;

      if (weeks <= 0 || weeks > 52) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Weeks must be between 1 and 52",
          })
        );
        return;
      }

      const result = await this.analyticsService.getWeeklyRevenue(
        ownerId,
        weeks
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getDailyRevenue(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }
      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const days = req.query.days ? parseInt(req.query.days as string) : 30;

      if (days <= 0 || days > 365) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Days must be between 1 and 365",
          })
        );
        return;
      }

      const result = await this.analyticsService.getDailyRevenue(ownerId, days);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTheaterWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;


      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getTheaterWiseRevenue(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getScreenWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getScreenWiseRevenue(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMovieWiseRevenue(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getMovieWiseRevenue(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters || !filters.dateRange) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.DATE_RANGE_REQUIRED,
          })
        );
        return;
      }

      const result = await this.analyticsService.getPerformanceMetrics(filters);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.PERFORMANCE_METRICS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOverallOccupancy(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      if (!dateRange) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.DATE_RANGE_REQUIRED,
          })
        );
        return;
      }

      const result = await this.analyticsService.getOverallOccupancy(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAverageTicketPrice(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getAverageTicketPrice(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTimeSlotPerformance(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getTimeSlotPerformance(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getWeekdayWeekendComparison(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getWeekdayWeekendComparison(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMovieAnalytics(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.getMovieAnalytics(filters);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.MOVIE_ANALYTICS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getTopPerformingMovies(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (limit <= 0 || limit > 100) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_LIMIT,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getTopPerformingMovies(
        ownerId,
        limit,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getFormatPerformance(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getFormatPerformance(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getLanguagePerformance(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getLanguagePerformance(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getMovieLifecycleTrends(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }
      const { movieId } = req.params;

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      if (!movieId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.MOVIE_ID_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getMovieLifecycleTrends(
        ownerId,
        movieId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getCustomerInsights(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.getCustomerInsights(filters);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.CUSTOMER_INSIGHTS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }
  

  async getCustomerSatisfactionRatings(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getCustomerSatisfactionRatings(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRepeatCustomerRate(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getRepeatCustomerRate(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAdvanceBookingTrends(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getAdvanceBookingTrends(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getFinancialKPIs(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters || !filters.dateRange) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.DATE_RANGE_REQUIRED,
          })
        );
        return;
      }

      const result = await this.analyticsService.getFinancialKPIs(filters);

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.FINANCIAL_KPIS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPotentialVsActualRevenue(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      if (!dateRange) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.DATE_RANGE_REQUIRED,
          })
        );
        return;
      }

      const result = await this.analyticsService.getPotentialVsActualRevenue(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getDynamicPricingImpact(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getDynamicPricingImpact(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getDiscountImpact(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getDiscountImpact(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getOperationalAnalytics(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.getOperationalAnalytics(
        filters
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message ||
              ANALYTICS_MESSAGES.OPERATIONAL_ANALYTICS_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getLowPerformingTimeSlots(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const threshold = req.query.threshold
        ? parseFloat(req.query.threshold as string)
        : 50;

      if (threshold < 0 || threshold > 100) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_THRESHOLD,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getLowPerformingTimeSlots(
        ownerId,
        threshold,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRevenueGrowthRate(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const period = (req.query.period as "monthly" | "quarterly") || "monthly";

      if (!["monthly", "quarterly"].includes(period)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: "Period must be 'monthly' or 'quarterly'",
          })
        );
        return;
      }

      const result = await this.analyticsService.getRevenueGrowthRate(
        ownerId,
        period
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAnalyticsSummary(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const dateRange = this.parseDateRange(req);

      const result = await this.analyticsService.getAnalyticsSummary(
        ownerId,
        dateRange
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.ANALYTICS_SUMMARY_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async generateAnalyticsReport(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.generateAnalyticsReport(
        filters
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message || ANALYTICS_MESSAGES.REPORT_GENERATED_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async exportAnalyticsData(req: Request, res: Response): Promise<void> {
    try {
      let ownerId = req.owner?.ownerId;

      if (!ownerId) {
        ownerId = req.query.ownerId;
      }

      if (!ownerId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const format = (req.query.format as "csv" | "excel" | "pdf") || "csv";

      if (!["csv", "excel", "pdf"].includes(format)) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_EXPORT_FORMAT,
          })
        );
        return;
      }

      const filters = this.buildAnalyticsFilters(req, ownerId);

      if (!filters) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: ANALYTICS_MESSAGES.INVALID_DATE_RANGE,
          })
        );
        return;
      }

      const result = await this.analyticsService.exportAnalyticsData(
        filters,
        format
      );

      if (result.success) {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=analytics.${format}`
        );
        res.setHeader("Content-Type", this.getContentType(format));
        res.send(result.data);
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private buildAnalyticsFilters(
    req: Request,
    ownerId: string
  ): IAnalyticsFilterDTO | null {
    try {
      const dateRange = this.parseDateRange(req);
      const timeframe = req.query.timeframe as
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "yearly";
      const theaterId = req.query.theaterId as string;
      const screenId = req.query.screenId as string;
      const movieId = req.query.movieId as string;
      const format = req.query.format as string;
      const language = req.query.language as string;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : undefined;
      const threshold = req.query.threshold
        ? parseFloat(req.query.threshold as string)
        : undefined;

      return {
        ownerId,
        dateRange,
        timeframe,
        theaterId,
        screenId,
        movieId,
        format,
        language,
        limit,
        threshold,
      };
    } catch (error) {
      return null;
    }
  }

  private parseDateRange(req: Request): { start: Date; end: Date } | undefined {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      if (!startDate || !endDate) {
        return undefined;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return undefined;
      }

      if (start >= end) {
        return undefined;
      }

      return { start, end };
    } catch (error) {
      return undefined;
    }
  }

  private getContentType(format: "csv" | "excel" | "pdf"): string {
    switch (format) {
      case "csv":
        return "text/csv";
      case "excel":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "pdf":
        return "application/pdf";
      default:
        return "application/octet-stream";
    }
  }

  private handleError(res: Response, error: unknown): void {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ANALYTICS_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message: errorMessage,
      })
    );
  }
}
