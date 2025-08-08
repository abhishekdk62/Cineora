import { Router } from "express";

import { createTheater, deleteTheater, getOwnerProfile, getTheatersByOwnerId, resetOwnerPassword, sendEmailChangeOtp, toggleTheaterStatus, updateOwner, updateTheater, verifyEmailChangeOtp } from "../controllers/owner.controller";

const router = Router();

router.get("/profile", getOwnerProfile);
router.put('/',updateOwner)
router.post('/email/change',sendEmailChangeOtp)
router.post('/email/verify',verifyEmailChangeOtp)
router.patch('/reset-password',resetOwnerPassword)
router.get('/theaters',getTheatersByOwnerId)
router.put('/theaters/:id',updateTheater)
router.post('/theaters',createTheater)
router.delete('/theaters',deleteTheater)
router.patch('/theaters/:id',toggleTheaterStatus)
export default router;
