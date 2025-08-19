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
  updateUserLocation,
} from "../controllers/user.controller";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";
const router = Router();
router.get("/profile", getUserProfile);
router.patch("/reset-password", resetPassword);

router.put("/profile", updateProfile);
router.post("/email/change",changeEmail);
router.post("/email/verify",verifyChangeEmailOtp);
router.get("/nearby/:id", getNearbyUsers);
router.post("/xp/:id", addXpPoints);
router.patch('/location',updateUserLocation)





 

const controller = new ShowtimeController();
// GET /user/movies/now-showing - Get all movies

// GET /user/theaters - Get all theaters

// GET /user/showtimes - Get showtimes (with filters) -->?movieId=...&theaterId=...&date=...

// GET /user/showtimes/:showtimeId - Get single showtime

// POST /user/showtimes/:showtimeId/block-seats - Block seats

// POST /user/showtimes/:showtimeId/book-seats - Book seats

// POST /user/showtimes/:showtimeId/release-seats - Release seats




















export default router;
