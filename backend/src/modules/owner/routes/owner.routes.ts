import { Router } from "express";

import { getOwnerProfile, resetOwnerPassword, sendEmailChangeOtp, updateOwner, verifyEmailChangeOtp } from "../controllers/owner.controller";

const router = Router();

router.get("/profile", getOwnerProfile);
router.put('/',updateOwner)
router.post('/email/change',sendEmailChangeOtp)
router.post('/email/verify',verifyEmailChangeOtp)
router.patch('/reset-password',resetOwnerPassword)
router.get('/theaters')
router.put('/theaters/:id')
router.post('/theaters')
router.patch('/theaters/:id')
export default router;
