import express from "express";
import { AdminAnalyticsController } from "../controllers/adminAnalytics.controller";
import { AdminAnalyticsService } from "../services/adminAnalytics.service";
import { AdminAnalyticsRepository } from "../repository/adminAnalytics.repository";

export class AdminAnalyticsRoute {
  constructor(
    private _router: express.Router = express.Router(),
    private _analyticsController: AdminAnalyticsController
  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get("/comprehensive", 
      (req, res) => this._analyticsController.getComprehensiveAnalytics(req, res)
    );

    this._router.get("/revenue", 
      (req, res) => this._analyticsController.getRevenueAnalytics(req, res)
    );
    
    this._router.get("/revenue/monthly", 
      (req, res) => this._analyticsController.getMonthlyRevenueTrends(req, res)
    );
    
    this._router.get("/revenue/daily", 
      (req, res) => this._analyticsController.getDailyRevenueTrends(req, res)
    );
    
    this._router.get("/revenue/theater-wise", 
      (req, res) => this._analyticsController.getTheaterWiseRevenue(req, res)
    );
    
    this._router.get("/revenue/owner-wise", 
      (req, res) => this._analyticsController.getOwnerWiseRevenue(req, res)
    );
    
    this._router.get("/revenue/movie-wise", 
      (req, res) => this._analyticsController.getMovieWiseRevenue(req, res)
    );

    this._router.get("/performance", 
      (req, res) => this._analyticsController.getPerformanceMetrics(req, res)
    );
    
    this._router.get("/performance/occupancy", 
      (req, res) => this._analyticsController.getOccupancyAnalytics(req, res)
    );
    
    this._router.get("/performance/time-slots", 
      (req, res) => this._analyticsController.getTimeSlotPerformance(req, res)
    );

    this._router.get("/customers", 
      (req, res) => this._analyticsController.getCustomerInsights(req, res)
    );
    
    this._router.get("/customers/satisfaction", 
      (req, res) => this._analyticsController.getCustomerSatisfaction(req, res)
    );

    this._router.get("/movies", 
      (req, res) => this._analyticsController.getMoviePerformance(req, res)
    );
    
    this._router.get("/movies/top-performing", 
      (req, res) => this._analyticsController.getTopPerformingMovies(req, res)
    );
    
    this._router.get("/movies/format-performance", 
      (req, res) => this._analyticsController.getMovieFormatAnalytics(req, res)
    );

    this._router.get("/financial", 
      (req, res) => this._analyticsController.getFinancialKPIs(req, res)
    );
    this._router.get("/data/analytics", 
      (req, res) => this._analyticsController.getAdminAnalyticData(req, res)
    );

    this._router.get("/growth", 
      (req, res) => this._analyticsController.getGrowthRates(req, res)
    );

    this._router.get("/operational", 
      (req, res) => this._analyticsController.getOperationalAnalytics(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}

export const createAdminAnalyticsRoutes = (): express.Router => {
  const repository = new AdminAnalyticsRepository();
  const service = new AdminAnalyticsService(repository);
  const controller = new AdminAnalyticsController(service);
  const routes = new AdminAnalyticsRoute(express.Router(), controller);
  
  return routes.getRouter();
};

export default createAdminAnalyticsRoutes();
