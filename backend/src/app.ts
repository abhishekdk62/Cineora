import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { MoviesController } from "./modules/movies/controllers/movies.controllers";
import { OwnerController } from "./modules/owner/controllers/owner.controller";
import { OwnerRequestController } from "./modules/owner/controllers/ownerRequest.controller";
import { ScreenController } from "./modules/screens/controllers/screens.controller";
import { ShowtimeController } from "./modules/showtimes/controllers/showtimes.controller";
import { TheaterController } from "./modules/theaters/controllers/theaters.controller";
import { UserController } from "./modules/user/controllers/user.controller";
import { AuthController } from "./modules/auth/controllers/auth.controller";
import { UserRoutes } from "./modules/user/routes/user.routes";
import { OwnerRoute as OwnerMainRoute } from "./modules/owner/routes/owner.routes";
import { OwnerRoute as OwnerRequestRoute } from "./modules/owner/routes/ownerRequest.routes";
import { CommonRoutes } from "./modules/common/routes";
import { AuthRoute } from "./modules/auth/routes/auth.routes";
import { UserService } from "./modules/user/services/user.service";
import { TheaterService } from "./modules/theaters/services/theater.service";
import { MovieService } from "./modules/movies/services/movies.service";
import { OwnerRequestService } from "./modules/owner/services/ownerRequest.service";
import { OTPService } from "./modules/otp/services/otp.service";
import { AuthService } from "./modules/auth/services/auth.service";

import { UserRepository } from "./modules/user/repositories/user.repository";
import { TheaterRepository } from "./modules/theaters/repositories/theater.repository";
import { MovieRepository } from "./modules/movies/repositories/movie.repository";
import { OwnerRepository } from "./modules/owner/repositories/owner.repository";
import { OwnerRequestRepository } from "./modules/owner/repositories/ownerRequest.repository";
import { OTPRepository } from "./modules/otp/repositories/otp.repository";
import { AdminRepository } from "./modules/admin/repositories/admin.repository";

import { EmailService } from "./services/email.service";
import {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireOwner,
} from "./modules/auth/middleware/auth.middleware";
import { getSignedUrl } from "./utils/signCloudinaryUpload";
import { AdminRoutes } from "./modules/admin/routes/admin.routes";
import { ShowtimeRepository } from "./modules/showtimes/repositories/showtimes.repository";
import { ScreenRepository } from "./modules/screens/repositories/screens.repositories";
import { ScreenService } from "./modules/screens/services/screens.service";
import { ShowtimeService } from "./modules/showtimes/services/showtimes.service";
import { BookingController } from "./modules/bookings/controllers/bookings.controller";
import { TicketService } from "./modules/tickets/services/ticket.service";
import { TicketRepository } from "./modules/tickets/repositories/ticket.repository";
import { BookingRepository } from "./modules/bookings/repositories/bookings.repository";
import { BookingService } from "./modules/bookings/services/bookings.service";
import { TicketController } from "./modules/tickets/controllers/ticket.controller";
import { WalletService } from "./modules/wallet/services/wallet.service";
import { WalletRepository } from "./modules/wallet/repositories/wallet.repository";
import { WalletController } from "./modules/wallet/controllers/wallet.controller";
import { PaymentController } from "./modules/payment/controllers/payment.controller";
import { PaymentService } from "./modules/payment/services/payment.service";
import { PaymentRepository } from "./modules/payment/repositories/payment.repository";
import { WalletTransactionService } from "./modules/walletTransaction/services/walletTransaction.service";
import { WalletTransactionRepository } from "./modules/walletTransaction/repositories/walletTransaction.repository";
import { WalletTransactionController } from "./modules/walletTransaction/controllers/walletTransaction.controller";
import { NotificationService } from "./modules/notification/services/notification.service";
import { NotificationRepository } from "./modules/notification/repositories/notification.repository";
import { NotificationScheduler } from "./services/scheduler.service";
import { NotificationController } from "./modules/notification/controllers/notification.controller";
import { errorLogger, requestLogger } from "./utils/logger";
import { MovieFavoriteController } from "./modules/favorites/controllers/favorite.controller";
import { FavoriteService } from "./modules/favorites/services/favorite.service";
import { FavoriteRepository } from "./modules/favorites/repositories/favorite.repository";
import { ReviewController } from "./modules/reviews/controllers/review.controller";
import { ReviewService } from "./modules/reviews/services/review.service";
import { ReviewRepository } from "./modules/reviews/repositories/review.repository";
import { AnalyticsRoute } from "./modules/analytics/routes/analytics.routes";
import { AnalyticsController } from "./modules/analytics/controllers/analytics.controller";
import { AnalyticsRepository } from "./modules/analytics/repository/analytics.repository";
import { OwnerService } from "./modules/owner/services/owner.service";
import { AdminAnalyticsController } from "./modules/adminAnalytics/controllers/adminAnalytics.controller";
import { AnalyticsService } from "./modules/analytics/services/analytics.service";
import { AdminAnalyticsRoute } from "./modules/adminAnalytics/routes/adminAnalytics.routes";
import { AdminAnalyticsService } from "./modules/adminAnalytics/services/adminAnalytics.service";
import { AdminAnalyticsRepository } from "./modules/adminAnalytics/repository/adminAnalytics.repository";
import { CouponController } from "./modules/coupons/controllers/coupons.controller";
import { CouponService } from "./modules/coupons/services/coupons.service";
import { CouponRepository } from "./modules/coupons/repositories/coupons.repository";

export class App {
  private _app: Application;

  constructor() {
    this._app = express();
    this._setMiddlewares();
    this._setUtilityRoutes();
    this._setModuleRoutes();
    this._setErrorHandling();
  }
  private _setMiddlewares() {
    this._app.use(helmet());
    this._app.use(cookieParser());
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ limit: "10mb", extended: true }));
    this._app.use(morgan("dev"));
    this._app.use(requestLogger);
    this._app.use(
      cors({
        origin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );
  }

  private _setUtilityRoutes() {
    this._app.use("/api/sign-cloudinary", getSignedUrl);
  }

  private _setModuleRoutes() {
    const emailService = new EmailService();

    const userRepo = new UserRepository();
    const ownerRepo = new OwnerRepository();
    const ownerRequestRepo = new OwnerRequestRepository();
    const otpRepo = new OTPRepository();
    const walletRepo = new WalletRepository();
    const adminRepo = new AdminRepository();
    const theaterRepo = new TheaterRepository();
    const screenRepo = new ScreenRepository();
    const showtimeRepo = new ShowtimeRepository();
    const movieRepo = new MovieRepository();
    const ticketRepo = new TicketRepository();
    const paymentRepo = new PaymentRepository();
    const favoriteRepo = new FavoriteRepository();
    const reviewRepo = new ReviewRepository();
    const couponRepo = new CouponRepository();
    const analyticsRepository = new AnalyticsRepository();
    const adminAnalyticsRepository = new AdminAnalyticsRepository();
    const notificationRepo = new NotificationRepository();
    const walletTransactionRepo = new WalletTransactionRepository();
    const bookingRepo = new BookingRepository();
    const userService = new UserService(
      userRepo,
      ownerRepo,
      ownerRequestRepo,
      otpRepo,
      emailService
    );
    const ownerService = new OwnerService(
      emailService,
      ownerRepo,
      ownerRequestRepo,
      otpRepo,
      userRepo
    );
    const ownerRequestService = new OwnerRequestService(
      ownerRequestRepo,
      ownerRepo,
      otpRepo,
      userRepo,
      emailService
    );
    const otpService = new OTPService(otpRepo);
    const theaterService = new TheaterService(theaterRepo, emailService);
    const screenService = new ScreenService(screenRepo, theaterRepo);
    const ticketService = new TicketService(ticketRepo, emailService);
    const paymentService = new PaymentService(paymentRepo);
    const bookingService = new BookingService(bookingRepo, showtimeRepo);
    const walletService = new WalletService(walletRepo);
    const showtimeService = new ShowtimeService(showtimeRepo);
    const notificationService = new NotificationService(notificationRepo);
    const notificationScheduler = new NotificationScheduler(
      notificationService
    );
    const favoriteService = new FavoriteService(favoriteRepo);
    const walletTransactionService = new WalletTransactionService(
      walletTransactionRepo
    );
    const movieService = new MovieService(movieRepo);
    const authService = new AuthService(
      userRepo,
      adminRepo,
      ownerRepo,
      otpRepo,
      emailService,
      ownerRequestRepo
    );
    const analyticsService = new AnalyticsService(analyticsRepository);
    const adminAnalyticsService = new AdminAnalyticsService(
      adminAnalyticsRepository
    );
    const reviewService = new ReviewService(reviewRepo);
    const couponService = new CouponService(couponRepo);
    const userController = new UserController(
      userService,
      authService,
      walletService
    );
    const ownerController = new OwnerController(ownerService);
    const ownerRequestController = new OwnerRequestController(
      ownerRequestService
    );
    const screenController = new ScreenController(screenService);

    const ticketController = new TicketController(
      ticketService,
      walletService,
      walletTransactionService,
      bookingService,
      notificationService,
      notificationScheduler,
      theaterService
    );
    const bookingController = new BookingController(
      bookingService,
      ticketService,
      userService,
      walletService,
      walletTransactionService,
      notificationService,
      notificationScheduler,
      theaterService,
      couponService
    );
    const showtimeController = new ShowtimeController(showtimeService);
    const theaterController = new TheaterController(
      theaterService,
      screenService,
      reviewService
    );
    const moviesController = new MoviesController(movieService, reviewService);
    const authController = new AuthController(authService);
    const walletController = new WalletController(
      walletService,
      walletTransactionService
    );
    const notificationController = new NotificationController(
      notificationService
    );
    const paymentController = new PaymentController(
      paymentService,
      notificationService
    );
    const walletTransactionController = new WalletTransactionController(
      walletTransactionService
    );
    const analyticsController = new AnalyticsController(analyticsService);
    const adminAnalyticsController = new AdminAnalyticsController(
      adminAnalyticsService
    );
    const reviewController = new ReviewController(reviewService);
    const couponController = new CouponController(couponService);
    const favoriteController = new MovieFavoriteController(favoriteService);
    const analyticsRoutes = new AnalyticsRoute(
      express.Router(),
      analyticsController
    );
    const adminAnalyticsRoutes = new AdminAnalyticsRoute(
      express.Router(),
      adminAnalyticsController
    );
    const adminRoutes = new AdminRoutes(
      express.Router(),
      moviesController,
      ownerController,
      userController,
      ownerRequestController,
      screenController,
      showtimeController,
      theaterController,
      walletController,
      walletTransactionController
    );

    const userRoutes = new UserRoutes(
      express.Router(),
      userController,
      walletTransactionController,
      showtimeController,
      bookingController,
      ticketController,
      walletController,
      paymentController,
      notificationController,
      favoriteController,
      reviewController,
      couponController
    );

    const ownerRoutes = new OwnerMainRoute(
      express.Router(),
      screenController,
      showtimeController,
      moviesController,
      theaterController,
      ownerController,
      bookingController,
      walletController,
      walletTransactionController,
couponController
    );

    const ownerReqRoutes = new OwnerRequestRoute(
      express.Router(),
      ownerRequestController
    );

    const commonRoutes = new CommonRoutes(
      express.Router(),
      moviesController,
      theaterController,
      showtimeController,
      ticketController,
      reviewController
    );

    const authRoutes = new AuthRoute(
      express.Router(),
      authController,
      userController
    );

    this._app.use("/api/auth", authRoutes.getRouter());
    this._app.use(
      "/api/users",
      authenticateToken,
      requireUser,
      userRoutes.getRouter()
    );
    this._app.use("/api/owners", ownerReqRoutes.getRouter());
    this._app.use(
      "/api/owner",
      authenticateToken,
      requireOwner,
      ownerRoutes.getRouter()
    );
    this._app.use(
      "/api/analytics",
      authenticateToken,
      analyticsRoutes.getRouter()
    );
    this._app.use(
      "/api/admin/analytics",
      authenticateToken,
      adminAnalyticsRoutes.getRouter()
    );
    this._app.use(
      "/api/admin",
      authenticateToken,
      requireAdmin,
      adminRoutes.getRouter()
    );
    this._app.use("/api/common", commonRoutes.getRouter());

    this._app.use((req, res) =>
      res.status(404).json({ success: false, message: "Route not found" })
    );
  }
  private _setErrorHandling() {
    this._app.use(errorLogger);
  }

  public getApp() {
    return this._app;
  }
}
