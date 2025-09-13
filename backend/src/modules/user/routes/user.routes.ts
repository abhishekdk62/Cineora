import express, { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { BookingController } from "../../bookings/controllers/bookings.controller";
import { TicketController } from "../../tickets/controllers/ticket.controller";
import { WalletController } from "../../wallet/controllers/wallet.controller";
import { PaymentController } from "../../payment/controllers/payment.controller";
import { WalletTransactionController } from "../../walletTransaction/controllers/walletTransaction.controller";
import { NotificationController } from "../../notification/controllers/notification.controller";
import { MovieFavoriteController } from "../../favorites/controllers/favorite.controller";
import { ReviewController } from "../../reviews/controllers/review.controller";
import { CouponController } from "../../coupons/controllers/coupons.controller";

export class UserRoutes {
  constructor(
    private _router: express.Router = express.Router(),
    private _userController: UserController,
    private _walletTransactionController: WalletTransactionController,
    private _showtimeController: ShowtimeController,
    private _bookingController: BookingController,
    private _ticketController: TicketController,
    private _walletController: WalletController,
    private _paymentController: PaymentController,
    private _notificationController: NotificationController,
    private _favoritesController: MovieFavoriteController,
    private reviewsController: ReviewController,
    private _couponController: CouponController
  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get("/profile", (req, res) =>
      this._userController.getUserProfile(req, res)
    );

    this._router.patch("/reset-password", (req, res) =>
      this._userController.resetPassword(req, res)
    );
    this._router.get("/coupon/:theaterId", (req, res) =>
      this._couponController.getCouponsByTheaterId(req, res)
    );
    this._router.post("/coupon/check", (req, res) =>
      this._couponController.validateCouponByCode(req, res)
    );
    this._router.get("/coupon", (req, res) =>
      this._couponController.getAllCoupons(req, res)
    );

    this._router.put("/profile", (req, res) =>
      this._userController.updateUserProfile(req, res)
    );

    this._router.post("/email/change", (req, res) =>
      this._userController.changeEmail(req, res)
    );

    this._router.post("/email/verify", (req, res) =>
      this._userController.verifyChangeEmailOtp(req, res)
    );

    this._router.get("/nearby/:id", (req, res) =>
      this._userController.getNearbyUsers(req, res)
    );

    this._router.patch("/location", (req, res) =>
      this._userController.updateUserLocation(req, res)
    );
    this._router.get("/showtime/:id", (req, res) =>
      this._showtimeController.getShowtimeById(req, res)
    );

    this._router.post("/bookings/create-booking", (req, res) =>
      this._bookingController.createBooking(req, res)
    );
    this._router.get("/tickets", (req, res) =>
      this._ticketController.getUserTickets(req, res)
    );

    this._router.get("/wallet", (req, res) =>
      this._walletController.getWalletBalance(req, res)
    );

    this._router.post("/razorpay/create-order", (req, res) =>
      this._paymentController.createRazorpayOrder(req, res)
    );
    this._router.post("/razorpay/verify-payment", (req, res) =>
      this._paymentController.verifyRazorpayPayment(req, res)
    );
    this._router.post("/wallet/transactions", (req, res) =>
      this._walletController.handleWalletTransaction(req, res)
    );

    this._router.delete("/cancel/ticket", (req, res) =>
      this._ticketController.cancelTicket(req, res)
    );
    this._router.post("/wallet/debit", (req, res) =>
      this._walletController.debitWallet(req, res)
    );

    this._router.get("/transaction", (req, res) =>
      this._walletTransactionController.getUserWalletTransactions(req, res)
    );
    this._router.get("/notifications", (req, res) =>
      this._notificationController.getUserNotifications(req, res)
    );
    this._router.get("/notifications/all", (req, res) =>
      this._notificationController.getAllUserNotifications(req, res)
    );
    this._router.patch("/notification/:notificationId", (req, res) =>
      this._notificationController.markNotificationAsRead(req, res)
    );
    this._router.post("/favorites", (req, res) =>
      this._favoritesController.addToFavorites(req, res)
    );
    this._router.delete("/favorites/:movieId", (req, res) =>
      this._favoritesController.removeFromFavorites(req, res)
    );
    this._router.get("/favorites", (req, res) =>
      this._favoritesController.getUserFavorites(req, res)
    );
    this._router.get("/favorites/check/:movieId", (req, res) =>
      this._favoritesController.isFavorite(req, res)
    );
    this._router.post("/reviews", (req, res) =>
      this.reviewsController.addReview(req, res)
    );
    this._router.put("/reviews/:reviewId", (req, res) =>
      this.reviewsController.updateReview(req, res)
    );
    this._router.delete("/reviews/:reviewId", (req, res) =>
      this.reviewsController.deleteReview(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}
