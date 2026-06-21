import express from "express";
import { SocketService } from "../services/socket.service";
import { EmailService } from "../services/email.service";
import { NotificationScheduler } from "../services/scheduler.service";

import { UserRepository } from "../modules/user/repositories/user.repository";
import { OwnerRepository } from "../modules/owner/repositories/owner.repository";
import { OwnerRequestRepository } from "../modules/owner/repositories/ownerRequest.repository";
import { OTPRepository } from "../modules/otp/repositories/otp.repository";
import { WalletRepository } from "../modules/wallet/repositories/wallet.repository";
import { AdminRepository } from "../modules/admin/repositories/admin.repository";
import { TheaterRepository } from "../modules/theaters/repositories/theater.repository";
import { ScreenRepository } from "../modules/screens/repositories/screens.repositories";
import { ShowtimeRepository } from "../modules/showtimes/repositories/showtimes.repository";
import { MovieRepository } from "../modules/movies/repositories/movie.repository";
import { TicketRepository } from "../modules/tickets/repositories/ticket.repository";
import { PaymentRepository } from "../modules/payment/repositories/payment.repository";
import { FavoriteRepository } from "../modules/favorites/repositories/favorite.repository";
import { ReviewRepository } from "../modules/reviews/repositories/review.repository";
import { InviteGroupRepository } from "../modules/inviteGroup/repositories/inviteGroup.repository";
import { ChatRoomRepository } from "../modules/chatroom/repositories/chatroom.repository";
import { ChatMessageRepository } from "../modules/messages/repositories/messages.repository";
import { CouponRepository } from "../modules/coupons/repositories/coupons.repository";
import { AnalyticsRepository } from "../modules/analytics/repository/analytics.repository";
import { AdminAnalyticsRepository } from "../modules/adminAnalytics/repository/adminAnalytics.repository";
import { NotificationRepository } from "../modules/notification/repositories/notification.repository";
import { WalletTransactionRepository } from "../modules/walletTransaction/repositories/walletTransaction.repository";
import { BookingRepository } from "../modules/bookings/repositories/bookings.repository";
import { StaffRepository } from "../modules/staff/repositories/staff.repositories";

import { UserService } from "../modules/user/services/user.service";
import { OwnerService } from "../modules/owner/services/owner.service";
import { OwnerRequestService } from "../modules/owner/services/ownerRequest.service";
import { OTPService } from "../modules/otp/services/otp.service";
import { TheaterService } from "../modules/theaters/services/theater.service";
import { ScreenService } from "../modules/screens/services/screens.service";
import { TicketService } from "../modules/tickets/services/ticket.service";
import { TicketCancellationOrchestrator } from "../modules/tickets/services/ticket-cancellation.orchestrator";
import { PaymentService } from "../modules/payment/services/payment.service";
import { ShowtimeService } from "../modules/showtimes/services/showtimes.service";
import { BookingService } from "../modules/bookings/services/bookings.service";
import { WalletService } from "../modules/wallet/services/wallet.service";
import { NotificationService } from "../modules/notification/services/notification.service";
import { FavoriteService } from "../modules/favorites/services/favorite.service";
import { WalletTransactionService } from "../modules/walletTransaction/services/walletTransaction.service";
import { MovieService } from "../modules/movies/services/movies.service";
import { AuthService } from "../modules/auth/services/auth.service";
import { AnalyticsService } from "../modules/analytics/services/analytics.service";
import { AdminAnalyticsService } from "../modules/adminAnalytics/services/adminAnalytics.service";
import { ReviewService } from "../modules/reviews/services/review.service";
import { CouponService } from "../modules/coupons/services/coupons.service";
import { ChatRoomService } from "../modules/chatroom/services/chatroom.service";
import { ChatMessageService } from "../modules/messages/services/messages.service";
import { StaffService } from "../modules/staff/services/staff.service";
import { InviteGroupService } from "../modules/inviteGroup/services/inviteGroup.service";

import { UserController } from "../modules/user/controllers/user.controller";
import { OwnerController } from "../modules/owner/controllers/owner.controller";
import { OwnerRequestController } from "../modules/owner/controllers/ownerRequest.controller";
import { ScreenController } from "../modules/screens/controllers/screens.controller";
import { ChatRoomController } from "../modules/chatroom/controllers/chatroom.controller";
import { ChatMessageController } from "../modules/messages/controllers/messages.controller";
import { TicketController } from "../modules/tickets/controllers/ticket.controller";
import { BookingController } from "../modules/bookings/controllers/bookings.controller";
import { ShowtimeController } from "../modules/showtimes/controllers/showtimes.controller";
import { TheaterController } from "../modules/theaters/controllers/theaters.controller";
import { MoviesController } from "../modules/movies/controllers/movies.controllers";
import { AuthController } from "../modules/auth/controllers/auth.controller";
import { WalletController } from "../modules/wallet/controllers/wallet.controller";
import { NotificationController } from "../modules/notification/controllers/notification.controller";
import { PaymentController } from "../modules/payment/controllers/payment.controller";
import { WalletTransactionController } from "../modules/walletTransaction/controllers/walletTransaction.controller";
import { AnalyticsController } from "../modules/analytics/controllers/analytics.controller";
import { AdminAnalyticsController } from "../modules/adminAnalytics/controllers/adminAnalytics.controller";
import { StaffController } from "../modules/staff/controller/staff.controller";
import { ReviewController } from "../modules/reviews/controllers/review.controller";
import { CouponController } from "../modules/coupons/controllers/coupons.controller";
import { InviteGroupController } from "../modules/inviteGroup/controllers/inviteGroup.controller";
import { MovieFavoriteController } from "../modules/favorites/controllers/favorite.controller";

import { UserRoutes } from "../modules/user/routes/user.routes";
import { OwnerRoute as OwnerMainRoute } from "../modules/owner/routes/owner.routes";
import { OwnerRoute as OwnerRequestRoute } from "../modules/owner/routes/ownerRequest.routes";
import { CommonRoutes } from "../modules/common/routes";
import { AuthRoute } from "../modules/auth/routes/auth.routes";
import { AdminRoutes } from "../modules/admin/routes/admin.routes";
import { AnalyticsRoute } from "../modules/analytics/routes/analytics.routes";
import { AdminAnalyticsRoute } from "../modules/adminAnalytics/routes/adminAnalytics.routes";
import { StaffRoutes } from "../modules/staff/routes/staff.routes";

/** Route modules wired through constructor injection (DIP). */
export interface ApplicationRouteRegistry {
  authRoutes: AuthRoute;
  userRoutes: UserRoutes;
  ownerRoutes: OwnerMainRoute;
  ownerReqRoutes: OwnerRequestRoute;
  staffRoutes: StaffRoutes;
  analyticsRoutes: AnalyticsRoute;
  adminAnalyticsRoutes: AdminAnalyticsRoute;
  adminRoutes: AdminRoutes;
  commonRoutes: CommonRoutes;
}

/**
 * Composition root: single place that constructs the object graph.
 * Controllers depend on service interfaces; services depend on repository interfaces.
 */
export function buildApplicationRouteRegistry(
  socketService: SocketService
): ApplicationRouteRegistry {
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
  const inviteGroupRepo = new InviteGroupRepository();
  const chatRoomRepo = new ChatRoomRepository();
  const chatMessageRepo = new ChatMessageRepository();
  const couponRepo = new CouponRepository();
  const analyticsRepository = new AnalyticsRepository();
  const adminAnalyticsRepository = new AdminAnalyticsRepository();
  const notificationRepo = new NotificationRepository();
  const walletTransactionRepo = new WalletTransactionRepository();
  const bookingRepo = new BookingRepository();
  const staffRepo = new StaffRepository();

  const chatRoomService = new ChatRoomService(chatRoomRepo);
  const chatMessageService = new ChatMessageService(
    chatMessageRepo,
    chatRoomRepo,
    socketService
  );

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
  const ticketService = new TicketService(ticketRepo, emailService, staffRepo);
  const paymentService = new PaymentService(
    paymentRepo,
    walletRepo,
    walletTransactionRepo
  );
  const showtimeService = new ShowtimeService(showtimeRepo, socketService);
  const bookingService = new BookingService(
    bookingRepo,
    showtimeService,
    showtimeRepo
  );
  const walletService = new WalletService(walletRepo);
  const notificationService = new NotificationService(notificationRepo);
  const notificationScheduler = new NotificationScheduler(notificationService);
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
    ownerRequestRepo,
    staffRepo
  );
  const analyticsService = new AnalyticsService(analyticsRepository);
  const adminAnalyticsService = new AdminAnalyticsService(
    adminAnalyticsRepository
  );
  const reviewService = new ReviewService(reviewRepo);
  const couponService = new CouponService(couponRepo);
  const staffService = new StaffService(
    staffRepo,
    userRepo,
    ownerRepo,
    ownerRequestRepo
  );
  const inviteGroupService = new InviteGroupService(
    inviteGroupRepo,
    socketService,
    showtimeService
  );

  const userController = new UserController(userService, authService, walletService);
  const ownerController = new OwnerController(ownerService);
  const ownerRequestController = new OwnerRequestController(ownerRequestService);
  const screenController = new ScreenController(screenService);
  const chatRoomController = new ChatRoomController(chatRoomService);
  const chatMessageController = new ChatMessageController(chatMessageService);
  const ticketCancellationOrchestrator = new TicketCancellationOrchestrator(
    walletService,
    walletTransactionService,
    bookingService,
    notificationService,
    notificationScheduler,
    theaterService,
    showtimeService
  );
  const ticketController = new TicketController(
    ticketService,
    bookingService,
    ticketCancellationOrchestrator
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
    paymentService,
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
  const notificationController = new NotificationController(notificationService);
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
  const staffController = new StaffController(staffService);
  const reviewController = new ReviewController(reviewService);
  const couponController = new CouponController(couponService);
  const inviteGroupController = new InviteGroupController(inviteGroupService);
  const favoriteController = new MovieFavoriteController(favoriteService);

  return {
    authRoutes: new AuthRoute(express.Router(), authController, userController),
    userRoutes: new UserRoutes(
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
      couponController,
      inviteGroupController,
      chatMessageController,
      chatRoomController
    ),
    ownerRoutes: new OwnerMainRoute(
      express.Router(),
      screenController,
      showtimeController,
      moviesController,
      theaterController,
      ownerController,
      bookingController,
      walletController,
      walletTransactionController,
      couponController,
      paymentController,
      staffController
    ),
    ownerReqRoutes: new OwnerRequestRoute(
      express.Router(),
      ownerRequestController
    ),
    staffRoutes: new StaffRoutes(
      express.Router(),
      ticketController,
      staffController
    ),
    analyticsRoutes: new AnalyticsRoute(express.Router(), analyticsController),
    adminAnalyticsRoutes: new AdminAnalyticsRoute(
      express.Router(),
      adminAnalyticsController
    ),
    adminRoutes: new AdminRoutes(
      express.Router(),
      moviesController,
      ownerController,
      userController,
      ownerRequestController,
      screenController,
      showtimeController,
      theaterController,
      walletController,
      walletTransactionController,
      couponController,
      bookingController,
      staffController
    ),
    commonRoutes: new CommonRoutes(
      express.Router(),
      moviesController,
      theaterController,
      showtimeController,
      ticketController,
      reviewController
    ),
  };
}
