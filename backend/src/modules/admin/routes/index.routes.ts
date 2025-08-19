import { Router } from "express";
import adminMovieRoutes from "./admin.movie.routes";
import adminOwnerRoutes from "./admin.owner.routes";
import userRoutes from "./admin.user.routes";
import screenRoutes from "./admin.screen.routes";
import theaterRoutes from "./admin.theater.routes";
import showTimeRoutes from "./admin.showitme.routes";

const router = Router();

router.use("/movies", adminMovieRoutes);
router.use("/owners", adminOwnerRoutes);
router.use("/users", userRoutes);
router.use("/screens", screenRoutes);
router.use("/theaters", theaterRoutes);
router.use("/showtimes", showTimeRoutes);
export default router;
