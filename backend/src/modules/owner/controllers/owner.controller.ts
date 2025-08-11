import { Request, Response, NextFunction } from "express";
import { OwnerService } from "../services/owner.service";
import { OwnerRepository } from "../repositories/owner.repository";
import { OwnerRequestRepository } from "../repositories/ownerRequest.repository";

import { createResponse } from "../../../utils/createResponse";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { UserRepository } from "../../user/repositories/user.repository";
import { TheaterService } from "../../theaters/services/theater.service";
import { TheaterRepository } from "../../theaters/repositories/theater.repository";

const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const otpRepo = new OTPRepository();
const userRepo = new UserRepository();
const theaterRepo = new TheaterRepository();

const theaterService = new TheaterService(theaterRepo);
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

//!theater controllers

export async function createTheater(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.owner;
    const  theaterData  = req.body;


    if (!ownerId) {
      res.status(400).json(
        createResponse({
          success: false,
          message: "Owner id is required",
        })
      );
      return;
    }
    if (!theaterData) {
      res.status(400).json(
        createResponse({
          success: false,
          message: "Theater data is required",
        })
      );
      return;
    }

    const result = await theaterService.createTheater(ownerId, theaterData);

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
  } catch (error) {
    next(error);
  }
}

export async function getTheatersByOwnerId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { ownerId } = req.owner;
    if (!ownerId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Owner id required",
        })
      );
    }
    const result = await theaterService.getTheatersByOwnerId(ownerId, req.query);
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

export async function updateTheater(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { theaterId } = req.params;
    const updateData = req.body;
    const { ownerId } = req.owner;

    if (!theaterId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Theater ID is required",
        })
      );
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Update data is required",
        })
      );
    }

    const result = await theaterService.updateTheater(theaterId, updateData);

    if (!result.success) {
      let statusCode = 400;
      
      if (result.message === "Theater with this name already exists in this city") {
        statusCode = 409; 
      } else if (result.message === "Theater not found or update failed") {
        statusCode = 404; 
      } else if (result.message === "Something went wrong") {
        statusCode = 500; 
      }

      return res.status(statusCode).json(
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

export async function deleteTheater(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { theaterId } = req.params;

    if (!theaterId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Theater ID is required",
        })
      );
    }

    const result = await theaterService.deleteTheater(theaterId);

    if (!result.success) {
      let statusCode = 400;
      if (result.message === "Theater not found or deletion failed") {
        statusCode = 404;
      } else if (result.message === "Something went wrong") {
        statusCode = 500;
      }

      return res.status(statusCode).json(
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
  } catch (error) {
    next(error);
  }
}

export async function toggleTheaterStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { theaterId } = req.params;
    const { ownerId } = req.owner;

    if (!theaterId) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Theater ID is required",
        })
      );
    }

    const result = await theaterService.toggleTheaterStatus(theaterId);

    if (!result.success) {
      let statusCode = 400;
      
      if (result.message === "Theater not found") {
        statusCode = 404; 
      } else if (result.message === "Something went wrong") {
        statusCode = 500; 
      }

      return res.status(statusCode).json(
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

