import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { createResponse } from "../../../utils/createResponse";
import { MovieService } from "../../movies/services/movies.service";
import { MovieRepository } from "../../movies/repositories/movie.repository";
import { UserRepository } from "../repositories/user.repository";
import { OwnerRepository } from "../../owner/repositories/owner.repository";
import { OwnerRequestRepository } from "../../owner/repositories/ownerRequest.repository";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { EmailService } from "../../../services/email.service";
const userRepo = new UserRepository();
const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();

const userService = new UserService(userRepo, ownerRepo, ownerRequestRepo, otpRepo, emailService);

const movieService = new MovieService(new MovieRepository());

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const userData = req.body;
    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Username, email and password are required",
        })
      );
    }
    const result = await userService.signup(userData);
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

    const result = await userService.verifyOTP(email, otp);

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

export async function resendOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    const result = await userService.resendOTP(email);

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

export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;

    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User ID is required",
        })
      );
    }

    const result = await userService.getUserProfile(id);

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

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User ID is required",
        })
      );
    }

    const result = await userService.updateProfile(id, updateData);

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

export async function getNearbyUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { maxDistance } = req.query;

    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User ID is required",
        })
      );
    }

    const result = await userService.getNearbyUsers(
      id,
      maxDistance ? parseInt(maxDistance as string) : 5000
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

export async function addXpPoints(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (!id || !points) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User ID and points are required",
        })
      );
    }

    const result = await userService.addXpPoints(id, points);

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
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User id is required",
        })
      );
    }
    const { oldpassword, newPassword } = req.body;
    const oldPassword = oldpassword;

    if (!oldPassword || !newPassword) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Old password and new password required",
        })
      );
    }

    const result = await userService.changePassword(
      id,
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

export async function changeEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    const { newEmail, password } = req.body;

    if (!newEmail || !password) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "New email and password are required",
        })
      ); 
    }
    const result = await userService.sendEmailChangeOTP(id, newEmail, password);
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
        message: "Email changed successfully",
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function verifyChangeEmailOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    const { email, otp } = req.body;
    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "user Id is required",
        })
      );
    }

    if (!email || !otp) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and otp required",
        })
      );
    }

    const result = await userService.verifyEmailChangeOTP(id, email, otp);
 
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
        message: "Email changed succesfully",
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function getMoviesWithFilters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filters = {
      search: req.query.search as string,
      isActive: req.query.isActive ? req.query.isActive === "true" : undefined,
      rating: req.query.rating as string,
      minDuration: req.query.minDuration
        ? parseInt(req.query.minDuration as string)
        : undefined,
      maxDuration: req.query.maxDuration
        ? parseInt(req.query.maxDuration as string)
        : undefined,
      releaseYearStart: req.query.releaseYearStart
        ? parseInt(req.query.releaseYearStart as string)
        : undefined,
      releaseYearEnd: req.query.releaseYearEnd
        ? parseInt(req.query.releaseYearEnd as string)
        : undefined,
      language: req.query.language as string,
      genre: req.query.genre as string,
      sortBy: (req.query.sortBy as string) || "title",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const result = await movieService.getMoviesWithFilters(filters);

    return res.status(200).json(
      createResponse({
        success: true,
        data: result.movies,
        meta: {
          pagination: {
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            total: result.total,
            limit: filters.limit,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
          },
          filters: {
            applied: Object.keys(filters).filter(
              (key) =>
                filters[key as keyof typeof filters] !== undefined &&
                filters[key as keyof typeof filters] !== null &&
                filters[key as keyof typeof filters] !== ""
            ).length,
          },
        },
      })
    );
  } catch (err) {
    next(err);
  }
}
