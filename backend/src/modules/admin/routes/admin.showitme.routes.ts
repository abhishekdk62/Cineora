import { Router } from "express";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";

const router = Router();
const controller = new ShowtimeController();

router.get("/showtime", (req, res) => controller.getAllShowtimes(req, res));
router.get("/showtime/:showtimeId", (req, res) => controller.getShowtime(req, res));
router.patch("/showtime/:showtimeId", (req, res) => controller.changeShowtimeStatus(req, res));
router.delete("/showtime/:showtimeId", (req, res) => controller.deleteShowtime(req, res));

export default router;
 