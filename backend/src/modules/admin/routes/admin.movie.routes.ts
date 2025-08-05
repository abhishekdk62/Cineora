import { Router } from "express";
import {
  addMovie,
  deleteMovie,
  getMovies,
  getMovieById,
  getMoviesWithFilters,
  toggleMovieStatus,
  updateMovie,
} from "../controllers/admin.movie.controller";

const router = Router();

router.post("/", addMovie);
router.get("/", getMovies);
router.get("/filter", getMoviesWithFilters);
router.get("/:movieId", getMovieById);
router.patch("/:movieId/toggle-status", toggleMovieStatus);
router.put("/:movieId", updateMovie);
router.delete("/:movieId", deleteMovie);

export default router;
