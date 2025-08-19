import { Router } from "express";
import { ShowtimeController } from "../../showtimes/controllers/showtimes.controller";

const router = Router();
const controller = new ShowtimeController();

router.get("/:screenId", (req, res) => controller.getShowtimesByScreenAdmin(req, res));
router.get("/:showtimeId", (req, res) => controller.getShowtime(req, res));
router.patch("/:showtimeId", (req, res) => controller.changeShowtimeStatus(req, res));
router.delete("/:showtimeId", (req, res) => controller.deleteShowtime(req, res));

export default router;
 