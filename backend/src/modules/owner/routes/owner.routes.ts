import { Router } from 'express';  // ✅ Import Router directly
import { getRequestStatus, sendOTP, submitKYC, verifyOTP } from '../controllers/ownerRequest.controller';

const router = Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/submit-kyc', submitKYC);

router.get('/request-status/:requestId', getRequestStatus);

export default router;
