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
import { AuthService } from "../../auth/services/auth.service";
import { AdminRepository } from "../../admin/repositories/admin.repository";
const userRepo = new UserRepository();
const ownerRepo = new OwnerRepository();
const ownerRequestRepo = new OwnerRequestRepository();
const otpRepo = new OTPRepository();
const emailService = new EmailService();
const adminRepo = new AdminRepository();

const userService = new UserService(
  userRepo,
  ownerRepo,
  ownerRequestRepo,
  otpRepo,
  emailService
);

const movieService = new MovieService(new MovieRepository());

const authService = new AuthService(
  userRepo,
  adminRepo,
  ownerRepo,
  otpRepo,
  emailService,
  ownerRequestRepo
);
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

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User not found after verification",
        })
      );
    }

    try {
      const { accessToken, refreshToken } = authService.generateTokenPair(
        user,
        "user"
      );

      await authService.storeRefreshToken(user._id, refreshToken, "user");

      await userRepo.updateLastActive(user._id);

      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Email verified and logged in successfully",
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              isVerified: true,
              xpPoints: user.xpPoints,
              role: "user",
            },
            role: "user",
            redirectTo: "/dashboard",
            isNewUser: true,
          },
        })
      );
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Email verified successfully. Please login manually.",
          data: result.data,
        })
      );
    }
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

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: "Refresh token required.",
        })
      );
    }

    const userRepo = new UserRepository();
    const adminRepo = new AdminRepository();
    const ownerRepo = new OwnerRepository();
    const otpRepo = new OTPRepository();
    const emailService = new EmailService();
    const ownerRequestRepo = new OwnerRequestRepository();
    const authService = new AuthService(
      userRepo,
      adminRepo,
      ownerRepo,
      otpRepo,
      emailService,
      ownerRequestRepo
    );

    const refreshResult = await authService.refreshAccessToken(refreshToken);


    if (!refreshResult.success) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      
      return res.status(401).json(
        createResponse({
          success: false,
          message: "Invalid refresh token. Please login again.",
        })
      );
    }

    res.cookie("accessToken", refreshResult.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshResult.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json(
      createResponse({
        success: true,
        message: "Token refreshed successfully",
      })
    );

  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(401).json(
      createResponse({
        success: false,
        message: "Token refresh failed.",
      })
    );
  }
};


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
export async function updateUserLocation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.user;
    const { latitude, longitude } = req.body;

    if (!id) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "User ID is required",
        })
      );
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Latitude and longitude are required",
        })
      );
    }

    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Invalid coordinates range",
        })
      );
    }

    const locationData: {
      location: { type: "Point"; coordinates: [number, number] };
    } = {
      location: {
        type: "Point",
        coordinates: [longitude, latitude], 
      },
    };

    const result = await userService.updateProfile(id, locationData);

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
function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
