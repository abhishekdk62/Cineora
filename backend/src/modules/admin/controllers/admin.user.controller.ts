import { Request, Response, NextFunction } from 'express';
import { AdminUserService } from '../services/admin.user.service';
import { createResponse } from '../../../utils/createResponse';

const adminUserService = new AdminUserService();

export async function getUserCounts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminUserService.getUserCounts();

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

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = req.query;
    const result = await adminUserService.getUsers(filters);

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

export async function toggleUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'User ID is required'
      }));
    }

    const result = await adminUserService.toggleUserStatus(id);

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

export async function getUserDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'User ID is required'
      }));
    }

    const result = await adminUserService.getUserDetails(id);

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
