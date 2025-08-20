import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../../user/controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export class AuthRoute {
  constructor(
    private router: express.Router = express.Router(),
    private authController: AuthController,
    private userController: UserController,
    private authMiddleware = authenticateToken
  ) {
    this.setRoutes();
  }

  private setRoutes() {
    this.router.post("/login", (req, res) =>
      this.authController.login(req, res)
    );
    this.router.post("/logout", (req, res) =>
      this.authController.logout(req, res)
    );
    this.router.post("/google", (req, res) =>
      this.authController.googleAuthenticate(req, res)
    );
    this.router.get("/me", this.authMiddleware, (req, res) =>
      this.authController.getCurrentUser(req, res)
    );
    this.router.post("/signup", (req, res) =>
      this.userController.signup(req, res)
    );
    this.router.post("/verify-otp", (req, res) =>
      this.userController.verifyOTP(req, res)
    );
    this.router.post("/resend-otp", (req, res) =>
      this.userController.resendOTP(req, res)
    );
    this.router.post("/refresh", (req, res) =>
      this.userController.refreshToken(req, res)
    );
    this.router.post("/forgot-password/send-otp", (req, res) =>
      this.authController.sendPasswordResetOTP(req, res)
    );
    this.router.post("/forgot-password/verify-otp", (req, res) =>
      this.authController.verifyPasswordResetOtp(req, res)
    );
    this.router.post("/forgot-password/reset-password", (req, res) =>
      this.authController.resetPasswordWithOTP(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
