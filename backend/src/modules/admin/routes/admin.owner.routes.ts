import {Router } from 'express';
import {
  getOwnerCounts,
  getOwners,
  getOwnerRequests,
  toggleOwnerStatus,
  acceptOwnerRequest,
  rejectOwnerRequest
} from '../controllers/admin.owner.controller';

const router = Router();

router.get('/counts', getOwnerCounts);

router.get('/', getOwners);

router.get('/requests', getOwnerRequests);

router.patch('/:ownerId/toggle-status', toggleOwnerStatus);

router.patch('/requests/:requestId/accept', acceptOwnerRequest);

router.patch('/requests/:requestId/reject', rejectOwnerRequest);

export default router;
