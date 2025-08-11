import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { createResponse } from "../../../utils/createResponse";
import { UserService } from "../../user/services/user.service";

const authService = new AuthService();


export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email and password are required",
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

    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: result.message,
        })
      );
    }

    res.cookie("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { accessToken, refreshToken, ...restData } = result.data;

    return res.status(200).json(
      createResponse({
        success: true,
        message: result.message,
        data: restData,
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function sendPasswordResetOTP(
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

    const result = await authService.sendPasswordResetOTP(email);
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

export async function verifyPasswordResetOtp(
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
          message: "Email and otp required",
        })
      );
    }
    const result = await authService.verifyPasswordResetOtp(email, otp);

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
        message: "Otp verified successfully",
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordWithOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json(
        createResponse({
          success: false,
          message: "Email,otp and newpassword required",
        })
      );
    }

    const result = await authService.resetPasswordWithOTP(
      email,
      otp,
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
        message: "Password changed successfully",
      })
    );
  } catch (error) {
    next(error);
  }
}

export async function googleAuthenticate(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
      return;
    }
    const result = await authService.googleAuth(credential);
    if (result.success) {
      res.cookie("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, 
      });

      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      res.status(200).json(
        createResponse({
          success: true,
          message: result.message,
          data: {
            user: result.data.user,
            isNewUser: result.data.isNewUser,
            role: result.data.user.role || "user",
            redirectTo: "/dashboard",
          },
        })
      );
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Google Auth Controller Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error during Google authentication",
    });
  }
}

export async function checkAuthProvider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }
    const result = await authService.checkAuthProvider(email);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Check auth provider error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check authentication provider",
    });
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId || req.user?.adminId || req.user?.ownerId;
    const userType = req.user?.role;
    
    if (userId && userType) {
      await authService.logout(userId, userType);
    }
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json(
      createResponse({
        success: true,
        message: "Logged out successfully",
      })
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(500).json(
      createResponse({
        success: false,
        message: "Logout failed",
      })
    );
  }
}
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId: string | undefined;
    let userRole: string | undefined;


    if (req.user?.id) {
      userId = req.user.id;
      userRole = req.user.role;
    } else if (req.owner?.ownerId) {
      userId = req.owner.ownerId;
      userRole = req.owner.role;
    } else if (req.admin?.adminId) {
      userId = req.admin.adminId;
      userRole = req.admin.role;
    }

    if (!userId) {
      return res.status(401).json(
        createResponse({
          success: false,
          message: 'Invalid token data'
        })
      );
    }

       const user = await authService.getUserByIdAndRole(userId, userRole);

    
    if (!user) {
      return res.status(404).json(
        createResponse({
          success: false,
          message: 'User not found'
        })
      );
    }

    return res.status(200).json(
      createResponse({
        success: true,
        message: 'User retrieved successfully',
        data: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          ownerName: user.ownerName
        }
      })
    );
    
  } catch (error) {
    console.error('Get current user controller error:', error);
    next(error);
  }
};
