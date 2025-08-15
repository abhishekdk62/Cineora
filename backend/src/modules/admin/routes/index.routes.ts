import { Router } from "express";
import adminMovieRoutes from "./admin.movie.routes";
import adminOwnerRoutes from "./admin.owner.routes";
import userRoutes from "./admin.user.routes";
import screenRoutes from "./admin.screen.routes";

const router = Router();

router.use("/movies", adminMovieRoutes);
router.use("/owners", adminOwnerRoutes);
router.use("/users", userRoutes);
router.use("/screens", screenRoutes);

export default router;
