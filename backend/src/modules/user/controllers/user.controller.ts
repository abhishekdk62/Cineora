
import { Request, Response, NextFunction } from "express";
import { createResponse } from "../../../utils/createResponse";
import {
  ChangePasswordDto,
  GetUsersFilterDto,
  GetUsersResponseDto,
  LocationData,
  ResendOTPDto,
  SendEmailChangeOTPDto,
  SendEmailChangeOTPResponseDto,
  SignupDto,
  SignupResponseDto,
  UpdateProfileDto,
  UpdateUserProfileDto,
  UserCountsResponseDto,
  UserResponseDto,
  VerifyEmailChangeOTPDto,
  VerifyEmailChangeOTPResponseDto,
  VerifyOTPDto,
  VerifyOTPResponseDto,
} from "../dtos/dto";
import { RefreshTokenDto, RefreshTokenResponseDto } from "../../../interfaces/interface";
import { IUserService } from "../interfaces/user.service.interface";
import { IAuthService } from "../../auth/interfaces/auth.service.interface";
import { IWalletService } from "../../wallet/interfaces/wallet.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { USER_MESSAGES } from "../../../utils/messages.constants";
import { IUser } from "../interfaces/user.model.interface";

interface AuthenticatedRequest extends Request {
  user?: { id: string; _id?: string };
  owner?: { ownerId: string };
}

export class UserController {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthService,
    private readonly walletService: IWalletService
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const userData: SignupDto = req.body;
      const validationError = this._validateSignupData(userData);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const result = await this.userService.signup(userData);
      
      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.CREATED).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const verifyOTPDto: VerifyOTPDto = {
        email: String(req.body?.email || "").trim().toLowerCase(),
        otp: String(req.body?.otp || "").trim(),
      };

      const validationError = this._validateVerifyOTPData(verifyOTPDto);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const result = await this.userService.verifyOTP(verifyOTPDto.email, verifyOTPDto.otp);
      
      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      await this._createUserWallet(result.data?.user._id);

      const user = result.data?.user;
      if (!user) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createResponse({
          success: false,
          message: USER_MESSAGES.VERIFICATION_USER_MISSING,
        }));
        return;
      }

      await this._handleTokenGeneration(res, user, result.data);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const resendOTPDto: ResendOTPDto = req.body;
      
      if (!resendOTPDto.email) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.EMAIL_REQUIRED,
        }));
        return;
      }

      const result = await this.userService.resendOTP(resendOTPDto.email);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      
      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.userService.getUserProfile(userId);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: req.cookies?.refreshToken,
      };

      

      if (!refreshTokenDto.refreshToken) {
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: USER_MESSAGES.TOKEN_REQUIRED,
        }));
        return;
      }

      const refreshResult = await this.authService.refreshAccessToken(refreshTokenDto.refreshToken);

      if (!refreshResult.success) {
        this._clearAuthCookies(res);
        res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
          success: false,
          message: USER_MESSAGES.INVALID_TOKEN,
        }));
        return;
      }

      this._setAuthCookies(res, refreshResult.data.accessToken, refreshResult.data.refreshToken);

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.TOKEN_REFRESHED,
      }));
    } catch (error: unknown) {
      console.error("Token refresh error:", error);
      res.status(StatusCodes.UNAUTHORIZED).json(createResponse({
        success: false,
        message: USER_MESSAGES.TOKEN_REFRESH_FAILED,
      }));
    }
  }

  async updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      const updateData: UpdateProfileDto = req.body;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.userService.updateUserProfile(userId, updateData);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserLocation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      const { latitude, longitude } = req.body;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const coordinateValidationError = this._validateCoordinates(latitude, longitude);
      if (coordinateValidationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: coordinateValidationError,
        }));
        return;
      }

      const locationData = this._prepareLocationData(longitude, latitude);
      const result = await this.userService.updateUserProfile(userId, locationData);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getNearbyUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { maxDistance } = req.query;

      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const distance = maxDistance ? parseInt(maxDistance as string) : 5000;
      const result = await this.userService.getNearbyUsers(id, distance);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      const changePasswordDto: ChangePasswordDto = {
        oldPassword: req.body.oldpassword,
        newPassword: req.body.newPassword,
      };

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const validationError = this._validatePasswordData(changePasswordDto);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const result = await this.userService.changeUserPassword(
        userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.PASSWORD_UPDATED,
      }));
    } catch (error: unknown) {
      this._handleControllerError(res, error, "Failed to reset password");
    }
  }

  async changeEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      const sendEmailOTPDto: SendEmailChangeOTPDto = {
        email: req.body.newEmail,
        password: req.body.password,
      };

      const validationError = this._validateEmailChangeData(sendEmailOTPDto);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const result = await this.userService.sendEmailChangeOTP(
        userId!,
        sendEmailOTPDto.email,
        sendEmailOTPDto.password
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.EMAIL_CHANGED,
      }));
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyChangeEmailOtp(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = this._extractUserId(req);
      const verifyEmailOTPDto: VerifyEmailChangeOTPDto = req.body;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const validationError = this._validateVerifyEmailChangeData(verifyEmailOTPDto);
      if (validationError) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: validationError,
        }));
        return;
      }

      const result = await this.userService.verifyEmailChangeOTP(
        userId,
        verifyEmailOTPDto.email,
        verifyEmailOTPDto.otp
      );

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.EMAIL_CHANGED,
      }));
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserCounts(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.userService.getUserCounts();

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const filters: GetUsersFilterDto = req.query;
      const result = await this.userService.getUsers(filters);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async toggleUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.userService.toggleUserStatus(id);

      if (!result.success) {
        res.status(StatusCodes.BAD_REQUEST).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json(createResponse({
          success: false,
          message: USER_MESSAGES.USER_ID_REQUIRED,
        }));
        return;
      }

      const result = await this.userService.getUserDetails(id);

      if (!result.success) {
        res.status(StatusCodes.NOT_FOUND).json(result);
        return;
      }

      res.status(StatusCodes.OK).json(result);
    } catch (error: unknown) {
      this._handleControllerError(res, error, USER_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  private _extractUserId(req: AuthenticatedRequest): string | null {
    return req.user?.id || req.user?._id || null;
  }

  private _validateSignupData(userData: SignupDto): string | null {
    if (!userData.username || !userData.email || !userData.password) {
      return USER_MESSAGES.SIGNUP_FIELDS_REQUIRED;
    }
    return null;
  }

  private _validateVerifyOTPData(verifyOTPDto: VerifyOTPDto): string | null {
    if (!verifyOTPDto.email || !verifyOTPDto.otp) {
      return USER_MESSAGES.OTP_REQUIRED;
    }
    return null;
  }

  private _validatePasswordData(changePasswordDto: ChangePasswordDto): string | null {
    if (!changePasswordDto.oldPassword || !changePasswordDto.newPassword) {
      return USER_MESSAGES.PASSWORDS_REQUIRED;
    }
    return null;
  }

  private _validateEmailChangeData(sendEmailOTPDto: SendEmailChangeOTPDto): string | null {
    if (!sendEmailOTPDto.email || !sendEmailOTPDto.password) {
      return USER_MESSAGES.EMAIL_PASSWORD_REQUIRED;
    }
    return null;
  }

  private _validateVerifyEmailChangeData(verifyEmailOTPDto: VerifyEmailChangeOTPDto): string | null {
    if (!verifyEmailOTPDto.email || !verifyEmailOTPDto.otp) {
      return USER_MESSAGES.OTP_REQUIRED;
    }
    return null;
  }

  private _validateCoordinates(latitude: number, longitude: number): string | null {
    if (latitude === undefined || longitude === undefined) {
      return USER_MESSAGES.COORDINATE_REQUIRED;
    }

    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return USER_MESSAGES.INVALID_COORDINATES;
    }

    return null;
  }

  private _prepareLocationData(longitude: number, latitude: number): Partial<UpdateUserProfileDto> {
    return {
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };
  }

  private async _createUserWallet(userId: string | undefined): Promise<void> {
    if (!userId) return;

    try {
      const walletResult = await this.walletService.createWallet({
        userId,
        userModel: "User"
      });

      if (!walletResult.success) {
        console.error(`Failed to create wallet for user ${userId}:`, walletResult.message);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  }

  private async _handleTokenGeneration(res: Response, user: IUser, resultData: any): Promise<void> {
    try {
      const { accessToken, refreshToken } = this.authService.generateTokenPair(user, "user");
      await this.authService.storeRefreshToken(String(user._id), refreshToken, "user");

      this._setAuthCookies(res, accessToken, refreshToken);

      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.EMAIL_VERIFIED_AND_LOGGED_IN,
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
      }));
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      res.status(StatusCodes.OK).json(createResponse({
        success: true,
        message: USER_MESSAGES.EMAIL_VERIFIED_MANUAL_LOGIN,
        data: resultData,
      }));
    }
  }

  private _setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
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

  private _clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }

  private _handleControllerError(res: Response, error: unknown, defaultMessage: string): void {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createResponse({
      success: false,
      message: errorMessage,
    }));
  }
}
