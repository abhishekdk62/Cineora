import { Router } from 'express';  // ✅ Import Router directly
import {
  sendOTP,
  verifyOTP,
  submitKYC,
  getRequestStatus,
} from '../controllers/owner.controller';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/submit-kyc', submitKYC);

router.get('/request-status/:requestId', getRequestStatus);

export default router;
