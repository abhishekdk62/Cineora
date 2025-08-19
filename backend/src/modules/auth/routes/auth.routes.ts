import { Router } from "express";
import {
  getCurrentUser,
  googleAuthenticate,
  login,
  logout,
  resetPasswordWithOTP,
  sendPasswordResetOTP,
  verifyPasswordResetOtp,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  refreshToken,
  resendOTP,
  resetPassword,
  signup,
  verifyOTP,
} from "../../user/controllers/user.controller";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post('/refresh',refreshToken)
router.post("/forgot-password/send-otp", sendPasswordResetOTP);
router.post("/google", googleAuthenticate);
router.post("/forgot-password/verify-otp", verifyPasswordResetOtp);
router.post("/forgot-password/reset-password", resetPasswordWithOTP);
router.get("/me", authenticateToken, getCurrentUser);
export default router;
