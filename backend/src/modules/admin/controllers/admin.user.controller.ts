import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../user/services/user.service';
import { createResponse } from '../../../utils/createResponse';
import { UserRepository } from '../../user/repositories/user.repository';
import { OwnerRepository } from '../../owner/repositories/owner.repository';
import { OwnerRequestRepository } from '../../owner/repositories/ownerRequest.repository';
import { OTPRepository } from '../../otp/repositories/otp.repository';
import { EmailService } from '../../../services/email.service';

const userRepo = new UserRepository();
const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();

const userService = new UserService(userRepo, ownerRepo, ownerRequestRepo, otpRepo, emailService);

export async function getUserCounts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.getUserCounts();

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
    const result = await userService.getUsers(filters);

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

    const result = await userService.toggleUserStatus(id);

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

    const result = await userService.getUserDetails(id);

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
