import { Router } from "express";

import {
  createTheater,
  deleteTheater,
  getOwnerProfile,
  getTheatersByOwnerId,
  resetOwnerPassword,
  sendEmailChangeOtp,
  toggleTheaterStatus,
  updateOwner,
  updateTheater,
  verifyEmailChangeOtp,
} from "../controllers/owner.controller";
import { ScreenController } from "../../screens/controllers/screens.controllers";

const router = Router();

router.get("/profile", getOwnerProfile);
router.put("/", updateOwner);
router.post("/email/change", sendEmailChangeOtp);
router.post("/email/verify", verifyEmailChangeOtp);
router.patch("/reset-password", resetOwnerPassword);
router.get("/theaters", getTheatersByOwnerId);
router.put("/theaters/:theaterId", updateTheater);
router.post("/theaters", createTheater);
router.delete("/theaters/:theaterId", deleteTheater);
router.patch("/theaters/:theaterId", toggleTheaterStatus);
const screenController = new ScreenController();

router.post("/screens", screenController.createScreen.bind(screenController));

router.get(
  "/screens/:theaterId",
  screenController.getScreensByTheaterId.bind(screenController)
);
 
router.get(
  "/screens/theater/:theaterId/filtered",
  screenController.getScreensByTheaterIdWithFilters.bind(screenController)
);

router.get(
  "/screens/theater/:theaterId/active",
  screenController.getActiveScreensByTheaterId.bind(screenController)
);

router.get(
  "/screens/theater/:theaterId/count",
  screenController.getScreenCountByTheaterId.bind(screenController)
);
router.get('/screens/stats/:theaterId', screenController.getScreenStats);


router.get(
  "/screens/theater/:theaterId/name/:name",
  screenController.getScreenByTheaterAndName.bind(screenController)
);

router.get(
  "/screens/:id",
  screenController.getScreenById.bind(screenController) 
);

router.put(
  "/screens/:id",
  screenController.updateScreen.bind(screenController)
);

router.patch(
  "/screens/:id",
  screenController.toggleScreenStatus.bind(screenController)
);

router.delete(
  "/screens/:id",
  screenController.deleteScreen.bind(screenController)
);

router.post(
  "/screens/check-exists",
  screenController.checkScreenExists.bind(screenController)
);

export default router;
