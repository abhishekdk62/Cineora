import express from "express";
import { UserController } from "../controllers/user.controller";
import { TheaterController } from "../../theaters/controllers/theaters.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
import { BookingController } from "../../bookings/controllers/bookings.controller";
import { TicketController } from "../../tickets/controllers/ticket.controller";
import { WalletController } from "../../wallet/controllers/wallet.controller";
import { PaymentController } from "../../payment/controllers/payment.controller";
import { WalletTransactionController } from "../../walletTransaction/controllers/walletTransaction.controller";

export class UserRoutes {
  constructor(
    private router: express.Router = express.Router(),
    private userController: UserController,
    private walletTransactionController: WalletTransactionController,
    private showtimeController: ShowtimeController,
    private bookingController: BookingController,
    private ticketController: TicketController,
    private walletController: WalletController,
    private paymentController: PaymentController
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.get("/profile", (req, res) =>
      this.userController.getUserProfile(req, res)
    );

    this.router.patch("/reset-password", (req, res) =>
      this.userController.resetPassword(req, res)
    );

    this.router.put("/profile", (req, res) =>
      this.userController.updateProfile(req, res)
    );

    this.router.post("/email/change", (req, res) =>
      this.userController.changeEmail(req, res)
    );

    this.router.post("/email/verify", (req, res) =>
      this.userController.verifyChangeEmailOtp(req, res)
    );

    this.router.get("/nearby/:id", (req, res) =>
      this.userController.getNearbyUsers(req, res)
    );

    this.router.post("/xp/:id", (req, res) =>
      this.userController.addXpPoints(req, res)
    );

    this.router.patch("/location", (req, res) =>
      this.userController.updateUserLocation(req, res)
    );
    this.router.get("/showtime/:id", (req, res) =>
      this.showtimeController.getShowtime(req, res)
    );

    this.router.post("/bookings/create-booking", (req, res) =>
      this.bookingController.createBooking(req, res)
    );
    this.router.get("/tickets", (req, res) =>
      this.ticketController.getUserTickets(req, res)
    );

    this.router.get("/wallet", (req, res) =>
      this.walletController.getBalance(req, res)
    );

    this.router.post("/razorpay/create-order", (req, res) =>
      this.paymentController.createRazorpayOrder(req, res)
    );
    this.router.post("/razorpay/verify-payment", (req, res) =>
      this.paymentController.verifyRazorpayPayment(req, res)
    );
    this.router.post("/wallet/transactions", (req, res) =>
      this.walletController.handleWalletTransaction(req, res)
    );

    this.router.delete("/cancel/ticket", (req, res) =>
      this.ticketController.cancelTicket(req, res)
    );
    this.router.post("/wallet/debit", (req, res) =>
      this.walletController.debitWallet(req, res)
    );

    this.router.get("/transaction", (req, res) =>
      this.walletTransactionController.getUserTransactions(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
