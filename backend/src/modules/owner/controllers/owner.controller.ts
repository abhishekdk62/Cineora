import { Request, Response, NextFunction } from 'express';
import { OwnerService } from '../services/owner.service';
import { OwnerRepository } from '../repositories/owner.repository';
import { OwnerRequestRepository } from '../repositories/ownerRequest.repository';
import { createResponse } from '../../../utils/createResponse';

// Create repository instances
const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();

// Create service instance with required dependencies
const ownerService = new OwnerService(ownerRepo, ownerRequestRepo);

export async function getOwnerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Request ID is required'
      }));
    }

    const result = await ownerService.getOwnerProfile(requestId);

    if (!result.success) {
      return res.status(404).json(createResponse({
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

export async function getOwnerCounts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ownerService.getOwnerCounts();

    return res.status(200).json(createResponse({
      success: result.success,
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
    const result = await ownerService.getOwners(filters);

    return res.status(200).json(createResponse({
      success: result.success,
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

    const result = await ownerService.toggleOwnerStatus(ownerId);

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

export async function getOwnerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Owner ID is required'
      }));
    }

    const result = await ownerService.getOwnerById(ownerId);

    if (!result.success) {
      return res.status(404).json(createResponse({
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

export async function updateOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const { ownerId } = req.params;
    const updateData = req.body;

    if (!ownerId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Owner ID is required'
      }));
    }

    const result = await ownerService.updateOwner(ownerId, updateData);

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

export async function deleteOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Owner ID is required'
      }));
    }

    const result = await ownerService.deleteOwner(ownerId);

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(200).json(createResponse({
      success: true,
      message: result.message
    }));
  } catch (err) {
    next(err);
  }
}
