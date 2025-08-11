import { Router } from 'express';
import { getCurrentUser, googleAuthenticate, login, logout, resetPasswordWithOTP, sendPasswordResetOTP, verifyPasswordResetOtp } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router(); 

router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password/send-otp',sendPasswordResetOTP)
router.post('/google',googleAuthenticate)
router.post('/forgot-password/verify-otp',verifyPasswordResetOtp)
router.post('/forgot-password/reset-password',resetPasswordWithOTP)
router.get('/me',authenticateToken,getCurrentUser)
export default router;
