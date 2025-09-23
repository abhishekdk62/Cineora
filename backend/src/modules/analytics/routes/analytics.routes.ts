import express from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

export class AnalyticsRoute {
  constructor(
    private _router: express.Router = express.Router(),
    private _analyticsController: AnalyticsController
  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get("/comprehensive", (req, res) =>
      this._analyticsController.getComprehensiveAnalytics(req, res)
    );

    this._router.get("/revenue", (req, res) =>
      this._analyticsController.getRevenueAnalytics(req, res)
    );
    this._router.get("/revenue/monthly", (req, res) =>
      this._analyticsController.getMonthlyRevenueTrends(req, res)
    );
    this._router.get("/revenue/weekly", (req, res) =>
      this._analyticsController.getWeeklyRevenue(req, res)
    );
    this._router.get("/revenue/daily", (req, res) =>
      this._analyticsController.getDailyRevenue(req, res)
    );
    this._router.get("/revenue/theater-wise", (req, res) =>
      this._analyticsController.getTheaterWiseRevenue(req, res)
    );
    this._router.get("/revenue/screen-wise", (req, res) =>
      this._analyticsController.getScreenWiseRevenue(req, res)
    );
    this._router.get("/revenue/movie-wise", (req, res) =>
      this._analyticsController.getMovieWiseRevenue(req, res)
    );

    this._router.get("/performance", (req, res) =>
      this._analyticsController.getPerformanceMetrics(req, res)
    );
    this._router.get("/performance/occupancy", (req, res) =>
      this._analyticsController.getOverallOccupancy(req, res)
    );
    this._router.get("/performance/avg-ticket-price", (req, res) =>
      this._analyticsController.getAverageTicketPrice(req, res)
    );
    this._router.get("/performance/time-slots", (req, res) =>
      this._analyticsController.getTimeSlotPerformance(req, res)
    );
    this._router.get("/performance/weekday-weekend", (req, res) =>
      this._analyticsController.getWeekdayWeekendComparison(req, res)
    );

    this._router.get("/movies", (req, res) =>
      this._analyticsController.getMovieAnalytics(req, res)
    );
    this._router.get("/movies/top-performing", (req, res) =>
      this._analyticsController.getTopPerformingMovies(req, res)
    );
    this._router.get("/movies/format-performance", (req, res) =>
      this._analyticsController.getFormatPerformance(req, res)
    );
    this._router.get("/movies/language-performance", (req, res) =>
      this._analyticsController.getLanguagePerformance(req, res)
    );
    this._router.get("/movies/:movieId/lifecycle", (req, res) =>
      this._analyticsController.getMovieLifecycleTrends(req, res)
    );

    this._router.get("/customers", (req, res) =>
      this._analyticsController.getCustomerInsights(req, res)
    );
    this._router.get("/customers/satisfaction", (req, res) =>
      this._analyticsController.getCustomerSatisfactionRatings(req, res)
    );
    this._router.get("/customers/repeat-rate", (req, res) =>
      this._analyticsController.getRepeatCustomerRate(req, res)
    );
    this._router.get("/customers/advance-booking", (req, res) =>
      this._analyticsController.getAdvanceBookingTrends(req, res)
    );

    this._router.get("/financial", (req, res) =>
      this._analyticsController.getFinancialKPIs(req, res)
    );
    this._router.get("/financial/potential-vs-actual", (req, res) =>
      this._analyticsController.getPotentialVsActualRevenue(req, res)
    );
    this._router.get("/financial/dynamic-pricing", (req, res) =>
      this._analyticsController.getDynamicPricingImpact(req, res)
    );
    this._router.get("/financial/discount-impact", (req, res) =>
      this._analyticsController.getDiscountImpact(req, res)
    );

    this._router.get("/operational", (req, res) =>
      this._analyticsController.getOperationalAnalytics(req, res)
    );
    this._router.get("/operational/low-performing-slots", (req, res) =>
      this._analyticsController.getLowPerformingTimeSlots(req, res)
    );
    this._router.get("/operational/revenue-growth", (req, res) =>
      this._analyticsController.getRevenueGrowthRate(req, res)
    );

    this._router.get("/summary", (req, res) =>
      this._analyticsController.getAnalyticsSummary(req, res)
    );
    this._router.post("/report", (req, res) =>
      this._analyticsController.generateAnalyticsReport(req, res)
    );
    this._router.get("/export", (req, res) =>
      this._analyticsController.exportAnalyticsData(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}
