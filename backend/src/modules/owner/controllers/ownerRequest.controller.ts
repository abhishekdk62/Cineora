import { Request, Response, NextFunction } from "express";
import { OwnerRequestService } from "../services/ownerRequest.service";
import { OwnerRequestRepository } from "../repositories/ownerRequest.repository";
import { OwnerRepository } from "../repositories/owner.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { OTPService } from "../../otp/services/otp.service";
import { createResponse } from "../../../utils/createResponse";
import { EmailService } from "../../../services/email.service";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { OwnerService } from "../services/owner.service";

const ownerRequestRepo = new OwnerRequestRepository();
const ownerRepo = new OwnerRepository();
const userRepo = new UserRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();

const ownerRequestService = new OwnerRequestService(
  ownerRequestRepo,
  ownerRepo,
  otpRepo,
  userRepo,
  emailService
);

export async function sendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email is required",
        })
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Please enter a valid email address",
        })
      );
    }

    const result = await ownerRequestService.sendOTP(email);

    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function verifyOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and OTP are required",
        })
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "OTP must be a 6-digit number",
        })
      );
    }

    const result = await ownerRequestService.verifyOTP(email, otp);

    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function submitKYC(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ownerData = req.body;

    const requiredFields = [
      "ownerName",
      "phone",
      "email",
      "aadhaar",
      "pan",
      "aadhaarUrl",
      "panUrl",
      "declaration",
      "agree",
    ];

    for (const field of requiredFields) {
      if (!ownerData[field]) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: `${field} is required`,
          })
        );
      }
    }

    if (ownerData.declaration !== true || ownerData.agree !== true) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Declaration and agreement must be accepted",
        })
      );
    }

    const result = await ownerRequestService.submitKYC(ownerData);

    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(201).json(
      createResponse({
        success: true,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getRequestStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Request ID is required",
        })
      );
    }

    const result = await ownerRequestService.getRequestStatus(requestId);

    if (!result.success) {
      return res.status(404).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getAllRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const result = await ownerRequestService.getAllRequests(
      Number(page),
      Number(limit),
      status as string
    );

    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getOwnerRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = req.query;
    const result = await ownerRequestService.getOwnerRequests(filters);

    return res.status(200).json(
      createResponse({
        success: result.success,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function updateRequestStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const { status, reviewedBy, rejectionReason } = req.body;

    if (!requestId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Request ID is required",
        })
      );
    }

    if (!status) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Status is required",
        })
      );
    }

    const result = await ownerRequestService.updateRequestStatus(
      requestId,
      status,
      reviewedBy,
      rejectionReason
    );

    if (!result.success) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function acceptOwnerRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const { adminId } = req.body;

    const result = await ownerRequestService.updateRequestStatus(
      requestId,
      "approved",
      adminId
    );

    return res.status(200).json(
      createResponse({
        success: result.success,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function rejectOwnerRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const { rejectionReason, adminId } = req.body;

    const result = await ownerRequestService.updateRequestStatus(
      requestId,
      "rejected",
      adminId,
      rejectionReason
    );

    return res.status(200).json(
      createResponse({
        success: result.success,
        message: result.message,
        data: result.data,
      })
    );
  } catch (err) {
    next(err);
  }
}

