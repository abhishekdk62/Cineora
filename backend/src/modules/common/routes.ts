import { Router } from "express";
import { getMovieById } from "../admin/controllers/admin.movie.controller";
import { getMoviesWithFilters } from "../user/controllers/user.controller";
import { getTheatersWithFilters } from "../theaters/controllers/theaters.controllers";

const router = Router();

router.get("/movies/filter", getMoviesWithFilters);
router.get("/movies/:movieId", getMovieById);
router.get("/theaters/filter", getTheatersWithFilters);

export default router;
