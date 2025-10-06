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
import { StatusCodes } from "../../../utils/statuscodes";
import { AUTH_MESSAGES } from "../../../utils/messages.constants";

export class AuthController {
  constructor(private readonly _authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequestDto = req.body;
      if (!loginData.email || !loginData.password) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED,
          })
        );
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginData.email)) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.INVALID_EMAIL,
          })
        );
      }

      const result = await this._authService.login(
        loginData.email,
        loginData.password
      );

      if (!result.success) {
        return res.status(StatusCodes.UNAUTHORIZED).json(
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
        maxAge: 15 * 60 * 10000,
      });

      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { accessToken, refreshToken, ...restData } = result.data;

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: restData,
        })
      );
    } catch (err) {
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.EMAIL_REQUIRED,
          })
        );
      }

      const result = await this._authService.sendPasswordResetOTP(
        requestData.email
      );
      if (!result.success) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: result.message,
          data: result.data,
        })
      );
    } catch (error) {
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.OTP_REQUIRED,
          })
        );
      }
      const result = await this._authService.verifyPasswordResetOtp(
        requestData.email,
        requestData.otp
      );

      if (!result.success) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: AUTH_MESSAGES.OTP_VERIFIED,
        })
      );
    } catch (error) {
    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.EMAIL_OTP_PASSWORD_REQUIRED,
          })
        );
      }

      const result = await this._authService.resetPasswordWithOTP(
        requestData.email,
        requestData.otp,
        requestData.newPassword
      );
      if (!result.success) {
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: AUTH_MESSAGES.PASSWORD_CHANGED,
        })
      );
    } catch (error) {
    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
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
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.GOOGLE_CREDENTIAL_REQUIRED,
          })
        );
      }
      const result = await this._authService.googleAuth(requestData.credential);
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
       return res.status(StatusCodes.OK).json(
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
        return res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      console.error("Google Auth Controller Error:", error);

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: AUTH_MESSAGES.INTERNAL_GOOGLE_AUTH_ERROR,
        })
      );
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || req.user?.adminId || req.user?.ownerId;
      const userType = req.user?.role;

      if (userId && userType) {
        await this._authService.logout(userId, userType);
      }

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: AUTH_MESSAGES.LOGGED_OUT,
        })
      );
    } catch (error) {
      console.error("Logout error:", error);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: AUTH_MESSAGES.LOGOUT_FAILED,
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
        return res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.INVALID_TOKEN,
          })
        );
      }

      const user = await this._authService.getUserByIdAndRole(userId, userRole);

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: AUTH_MESSAGES.USER_NOT_FOUND,
          })
        );
      }

      return res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: AUTH_MESSAGES.USER_RETRIEVED,
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
     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: error.message,
        })
      );
    }
  };
}
