import { Request, Response, NextFunction } from "express";
import { OwnerService } from "../services/owner.service";
import { OwnerRepository } from "../repositories/owner.repository";
import { OwnerRequestRepository } from "../repositories/ownerRequest.repository";

import { createResponse } from "../../../utils/createResponse";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { UserRepository } from "../../user/repositories/user.repository";

const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const otpRepo = new OTPRepository();
const userRepo = new UserRepository();

const ownerService = new OwnerService(
  ownerRepo,
  ownerRequestRepo,
  otpRepo,
  userRepo
);

export async function getOwnerProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const owner = req.owner;
    const requestId = owner.id;
    if (!requestId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Request ID is required",
        })
      );
    }

    const result = await ownerService.getOwnerProfile(requestId);

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

export async function getOwnerCounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await ownerService.getOwnerCounts();

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

export async function getOwners(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = req.query;
    const result = await ownerService.getOwners(filters);
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

export async function getOwnerById(
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

    const result = await ownerService.getOwnerById(ownerId);

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

export async function updateOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.owner;
    const updateData = req.body;

    if (!ownerId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Owner ID is required",
        })
      );
    }

    const result = await ownerService.updateOwner(ownerId, updateData);

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

export async function deleteOwner(
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

    const result = await ownerService.deleteOwner(ownerId);

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

export async function sendEmailChangeOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.owner;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "New email and password required",
        })
      );
    }

    const result = await ownerService.sendEmailChangeOtp(
      ownerId,
      newEmail,
      password
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
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailChangeOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.owner;
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and OTP are required",
        })
      );
    }

    const result = await ownerService.verifyEmailChangeOtp(ownerId, email, otp);

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
  } catch (error) {
    next(error);
  }
}

export async function resetOwnerPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { newPassword, oldPassword } = req.body;
    const { ownerId } = req.owner;
    if (!ownerId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Owner Id is not provided",
        })
      );
    }
    if (!newPassword || !oldPassword) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "New password and old password are required",
        })
      );
    }

    const result = await ownerService.changeOwnerPassword(
      ownerId,
      oldPassword,
      newPassword
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
        message: "Password updated succusfully",
      })
    );
  } catch (error) {
    next(error);
  }
}
