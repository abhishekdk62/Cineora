import { Router } from "express";
import { ScreenController } from "../../screens/controllers/screens.controllers";

const router = Router();
const screenController = new ScreenController();

router.get("/", screenController.getAllScreens.bind(screenController));

router.get("/:id", screenController.getScreenById.bind(screenController));

router.get("/theater/:theaterId", screenController.getScreensByTheaterId.bind(screenController));

router.get("/theater/:theaterId/filtered", screenController.getScreensByTheaterIdWithFilters.bind(screenController));

router.get("/theater/:theaterId/active", screenController.getActiveScreensByTheaterId.bind(screenController));

router.get("/theater/:theaterId/count", screenController.getScreenCountByTheaterId.bind(screenController));

router.get("/theater/:theaterId/name/:name", screenController.getScreenByTheaterAndName.bind(screenController));


router.patch("/:id/toggle-status", screenController.toggleScreenStatus.bind(screenController));

router.delete("/:id", screenController.deleteScreen.bind(screenController));

router.post("/check-exists", screenController.checkScreenExists.bind(screenController));


export default router;
