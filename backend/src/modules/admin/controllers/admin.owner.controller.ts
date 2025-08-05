import { Request, Response, NextFunction } from 'express';
import { AdminOwnerService } from '../services/admin.owner.service';
import { createResponse } from '../../../utils/createResponse';

const service = new AdminOwnerService();

export async function getOwnerCounts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.getOwnerCounts();

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function getOwners(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query;
    const result = await service.getOwners(filters);
    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function getOwnerRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query;
    const result = await service.getOwnerRequests(filters);


    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function toggleOwnerStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Owner ID is required'
      }));
    }

    const result = await service.toggleOwnerStatus(ownerId);

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function acceptOwnerRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params;
    const adminId = (req as any).admin?.id; // ✅ Changed from req.user to req.admin

    if (!requestId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Request ID is required'
      }));
    }

    const result = await service.acceptOwnerRequest(requestId, adminId);

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function rejectOwnerRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = (req as any).admin?.id; // ✅ Changed from req.user to req.admin

    if (!requestId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Request ID is required'
      }));
    }

    if (!rejectionReason) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Rejection reason is required'
      }));
    }

    const result = await service.rejectOwnerRequest(requestId, rejectionReason, adminId);

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}


