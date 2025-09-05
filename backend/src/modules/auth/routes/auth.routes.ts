import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { UserController } from "../../user/controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

export class AuthRoute {
  constructor(
    private _router: express.Router = express.Router(),
    private _authController: AuthController,
    private _userController: UserController,
    private _authMiddleware = authenticateToken
  ) {
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post("/login", (req, res) =>
      this._authController.login(req, res)
    );
    this._router.post("/logout", (req, res) =>
      this._authController.logout(req, res)
    );
    this._router.post("/google", (req, res) =>
      this._authController.googleAuthenticate(req, res)
    );
    this._router.get("/me", this._authMiddleware, (req, res) =>
      this._authController.getCurrentUser(req, res)
    );
    this._router.post("/signup", (req, res) =>
      this._userController.signup(req, res)
    );
    this._router.post("/verify-otp", (req, res) =>
      this._userController.verifyOTP(req, res)
    );
    this._router.post("/resend-otp", (req, res) =>
      this._userController.resendOTP(req, res)
    );
    this._router.post("/refresh", (req, res) =>
      this._userController.refreshToken(req, res)
    );
    this._router.post("/forgot-password/send-otp", (req, res) =>
      this._authController.sendPasswordResetOTP(req, res)
    );
    this._router.post("/forgot-password/verify-otp", (req, res) =>
      this._authController.verifyPasswordResetOtp(req, res)
    );
    this._router.post("/forgot-password/reset-password", (req, res) =>
      this._authController.resetPasswordWithOTP(req, res)
    );
  }

  public getRouter() {
    return this._router;
  }
}
