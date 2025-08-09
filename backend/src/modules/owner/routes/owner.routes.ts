import { Router } from "express";

import { createTheater, deleteTheater, getOwnerProfile, getTheatersByOwnerId, resetOwnerPassword, sendEmailChangeOtp, toggleTheaterStatus, updateOwner, updateTheater, verifyEmailChangeOtp } from "../controllers/owner.controller";

const router = Router();

router.get("/profile", getOwnerProfile);
router.put('/',updateOwner)
router.post('/email/change',sendEmailChangeOtp)
router.post('/email/verify',verifyEmailChangeOtp)
router.patch('/reset-password',resetOwnerPassword)
router.get('/theaters',getTheatersByOwnerId)
router.put('/theaters/:theaterId',updateTheater)
router.post('/theaters',createTheater)
router.delete('/theaters/:theaterId',deleteTheater)
router.patch('/theaters/:theaterId',toggleTheaterStatus)
export default router;
