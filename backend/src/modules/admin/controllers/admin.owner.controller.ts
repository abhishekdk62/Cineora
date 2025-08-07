import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import { OwnerService } from "../../owner/services/owner.service";
import { OwnerRequestService } from "../../owner/services/ownerRequest.service";
import { OwnerRepository } from "../../owner/repositories/owner.repository";
import { OwnerRequestRepository } from "../../owner/repositories/ownerRequest.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { OTPRepository } from "../../otp/repositories/otp.repository"; // ✅ Changed to repository
import { EmailService } from "../../../services/email.service";

const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const ownerService = new OwnerService(ownerRepo, ownerRequestRepo);

const userRepo = new UserRepository();
const otpRepo = new OTPRepository(); // ✅ Use repository directly
const emailService = new EmailService();

const ownerRequestService = new OwnerRequestService(
  ownerRequestRepo,
  ownerRepo,
  otpRepo,        // ✅ Pass repository instead of service
  userRepo,
  emailService
);

export async function getOwnerCounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await ownerService.getOwnerCounts();

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

export async function getOwners(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = req.query;
    const result = await ownerService.getOwners(filters);
    
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

export async function toggleOwnerStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Owner ID is required",
        })
      );
    }

    const result = await ownerService.toggleOwnerStatus(ownerId);

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
    const adminId = (req as any).admin?.id;

    if (!requestId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Request ID is required",
        })
      );
    }

    // ✅ Add admin ID validation
    if (!adminId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Admin authentication required",
        })
      );
    }

    const result = await ownerRequestService.updateRequestStatus(
      requestId,
      "approved",
      adminId
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

export async function rejectOwnerRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { requestId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = (req as any).admin?.id;

    if (!requestId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Request ID is required",
        })
      );
    }

    if (!rejectionReason) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Rejection reason is required",
        })
      );
    }

    // ✅ Add admin ID validation
    if (!adminId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Admin authentication required",
        })
      );
    }

    const result = await ownerRequestService.updateRequestStatus(
      requestId,
      "rejected",
      adminId,
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
