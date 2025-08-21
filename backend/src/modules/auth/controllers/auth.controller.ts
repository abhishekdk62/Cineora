import { Request, Response } from "express";
import { createResponse } from "../../../utils/createResponse";
import { IAuthService } from "../interfaces/auth.service.interface";
import {
  CheckAuthProviderParamsDto,
  GoogleAuthRequestDto,
  LoginRequestDto,
  ResetPasswordRequestDto,
  SendPasswordResetOtpRequestDto,
  VerifyPasswordResetOtpRequestDto,
} from "../dtos/dtos";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequestDto = req.body;

      if (!loginData.email || !loginData.password) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and password are required",
          })
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Please enter a valid email address",
          })
        );
      }

      const result = await this.authService.login(
        loginData.email,
        loginData.password
      );

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
      res.status(500).json(
        createResponse({
          success: false,
          message: err.message,
        })
      );
    }
  }

  async sendPasswordResetOTP(req: Request, res: Response): Promise<void> {
    try {
      const requestData: SendPasswordResetOtpRequestDto = req.body;

      if (!requestData.email) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email is required",
          })
        );
      }

      const result = await this.authService.sendPasswordResetOTP(
        requestData.email
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
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async verifyPasswordResetOtp(req: Request, res: Response): Promise<void> {
    try {
      const requestData: VerifyPasswordResetOtpRequestDto = req.body;

      if (!requestData.email || !requestData.otp) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email and otp required",
          })
        );
      }
      const result = await this.authService.verifyPasswordResetOtp(
        requestData.email,
        requestData.otp
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
          message: "Otp verified successfully",
        })
      );
    } catch (error) {
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async resetPasswordWithOTP(req: Request, res: Response): Promise<void> {
    try {
      const requestData: ResetPasswordRequestDto = req.body;

      if (!requestData.email || !requestData.otp || !requestData.newPassword) {
        return res.status(400).json(
          createResponse({
            success: false,
            message: "Email,otp and newpassword required",
          })
        );
      }

      const result = await this.authService.resetPasswordWithOTP(
        requestData.email,
        requestData.otp,
        requestData.newPassword
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
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  }

  async googleAuthenticate(req: Request, res: Response): Promise<void> {
    try {
      const requestData: GoogleAuthRequestDto = req.body;

      if (!requestData.credential) {
        res.status(400).json({
          success: false,
          message: "Google credential is required",
        });
        return;
      }
      const result = await this.authService.googleAuth(requestData.credential);
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

  async checkAuthProvider(req: Request, res: Response): Promise<void> {
    try {
      const params: CheckAuthProviderParamsDto =
        req.params as CheckAuthProviderParamsDto;

      if (!params.email) {
        res.status(400).json({
          success: false,
          message: "Email is required",
        });
        return;
      }
      const result = await this.authService.checkAuthProvider(params.email);
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

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || req.user?.adminId || req.user?.ownerId;
      const userType = req.user?.role;

      if (userId && userType) {
        await this.authService.logout(userId, userType);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(200).json(
        createResponse({
          success: true,
          message: "Logged out successfully",
        })
      );
    } catch (error) {
      console.error("Logout error:", error);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(500).json(
        createResponse({
          success: false,
          message: "Logout failed",
        })
      );
    }
  }
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
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
            message: "Invalid token data",
          })
        );
      }

      const user = await this.authService.getUserByIdAndRole(userId, userRole);

      if (!user) {
        return res.status(404).json(
          createResponse({
            success: false,
            message: "User not found",
          })
        );
      }

      return res.status(200).json(
        createResponse({
          success: true,
          message: "User retrieved successfully",
          data: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            ownerName: user.ownerName,
          },
        })
      );
    } catch (error) {
      console.error("Get current user controller error:", error);
      res.status(500).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  };
}
