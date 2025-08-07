import { Router } from "express";
import {
  signup,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateProfile,
  getNearbyUsers,
  addXpPoints,
  resetPassword,
  changeEmail,
  verifyChangeEmailOtp,
  getMoviesWithFilters,
} from "../controllers/user.controller";
const router = Router();
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.patch("/reset-password", resetPassword);
router.get("/profile", getUserProfile);
router.put("/profile", updateProfile);
router.post("/email/change",changeEmail);
router.post("/email/verify",verifyChangeEmailOtp);
router.get("/nearby/:id", getNearbyUsers);
router.post("/xp/:id", addXpPoints);
router.get("/movies/filter", getMoviesWithFilters);

export default router;
