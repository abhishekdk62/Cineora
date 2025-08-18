import { Router } from "express";
import { rejectTheater, toggleTheaterStatus, verifyTheater } from "../controllers/admin.theater.controller";
import { getTheatersByOwnerId } from "../../owner/controllers/owner.controller";

const router = Router();

router.patch('/:id',toggleTheaterStatus)
router.get('/',getTheatersByOwnerId)
router.patch('/verify/:theatreId',verifyTheater)
router.patch('/reject/:theatreId',rejectTheater)
export default router;
