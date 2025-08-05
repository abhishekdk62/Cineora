import { Router } from 'express';
import { 
  signup, 
  verifyOTP, 
  resendOTP, 
  getUserProfile, 
  updateProfile, 
  getNearbyUsers, 
  addXpPoints ,
  resetPassword
} from '../controllers/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password',resetPassword)

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);

router.get('/nearby/:id', getNearbyUsers);
router.post('/xp/:id', addXpPoints);

export default router;
