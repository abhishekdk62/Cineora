import { Request, Response, NextFunction } from 'express';
import { OwnerService } from '../services/owner.service';
import { createResponse } from '../../../utils/createResponse';

const ownerService = new OwnerService();

export async function sendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Email is required'
      }));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Please enter a valid email address'
      }));
    }

    const result = await ownerService.sendOTP(email);

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

export async function verifyOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Email and OTP are required'
      }));
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'OTP must be a 6-digit number'
      }));
    }

    const result = await ownerService.verifyOTP(email, otp);

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

export async function submitKYC(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerData = req.body;

    const requiredFields = [
      'ownerName', 'phone', 'email', 'aadhaar', 'pan',
      'aadhaarUrl', 'panUrl', 'declaration', 'agree'
    ];

    for (const field of requiredFields) {
      if (!ownerData[field]) {
        return res.status(400).json(createResponse({
          success: false,
          message: `${field} is required`
        }));
      }
    }

    if (ownerData.declaration !== true || ownerData.agree !== true) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Declaration and agreement must be accepted'
      }));
    }

    const result = await ownerService.submitKYC(ownerData);

    if (!result.success) {
      return res.status(400).json(createResponse({
        success: false,
        message: result.message
      }));
    }

    return res.status(201).json(createResponse({
      success: true,
      message: result.message,
      data: result.data
    }));
  } catch (err) {
    next(err);
  }
}

export async function getRequestStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json(createResponse({
        success: false,
        message: 'Request ID is required'
      }));
    }

    const result = await ownerService.getRequestStatus(requestId);

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
