import { Router } from 'express';
import { login, resetPasswordWithOTP, sendPasswordResetOTP, verifyPasswordResetOtp } from '../controllers/auth.controller';

const router = Router(); 

router.post('/login', login);
router.post('/forgot-password/send-otp',sendPasswordResetOTP)
router.post('/forgot-password/verify-otp',verifyPasswordResetOtp)
router.post('/forgot-password/reset-password',resetPasswordWithOTP)
export default router;
