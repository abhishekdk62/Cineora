import { getErrorMessage } from "../../../utils/errorUtil";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { IUserRepository } from "../../user/interfaces/user.repository.interface";
import { IAdminRepository } from "../../admin/interfaces/admin.repository.interface";
import { IOwnerRepository } from "../../owner/interfaces/owner.repository.interface";
import { IOTPRepository } from "../../otp/interfaces/otp.repository.interface";
import { IEmailService } from "../../../services/email.service";
import { IStaffRepository } from "../../staff/interfaces/staff.repository.interface";
import { RoleLoginChain } from "./handlers/role-login.chain";
import { AdminLoginHandler } from "./handlers/admin-login.handler";
import { OwnerLoginHandler } from "./handlers/owner-login.handler";
import { StaffLoginHandler } from "./handlers/staff-login.handler";
import { UserLoginHandler } from "./handlers/user-login.handler";
import { AuthLoginContext, AuthRole } from "./handlers/auth-login.context";
import { config } from "../../../config";
import { OAuth2Client } from "google-auth-library";
import { IOwnerRequestRepository } from "../../owner/interfaces/owner.repository.interface";
import { IAuthService } from "../interfaces/auth.service.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import {
  AuthErrorResponseDto,
  AuthSuccessResponseDto,
  CheckAuthProviderResponseDto,
  GoogleAuthResponseDto,
  GoogleUserDataDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  ResetPasswordWithOtpResponseDto,
  SendPasswordResetOtpResponseDto,
  JwtPayloadDto,
  TokenPairDto,
  UserDataDto,
  UserLookupResponseDto,
  VerifyPasswordResetOtpResponseDto,
} from "../dtos/dtos";
import { UserResponseDto } from "../../user/dtos/dto";

type AuthEntity = {
  _id?: unknown;
  id?: string;
  email: string;
  role?: string;
  username?: string;
  ownerName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  xpPoints?: number;
  lastActive?: string | Date;
  toObject?: () => Record<string, unknown>;
};
// import { RedisService } from "../../../services/redis.service";
interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserDataDto;
    accessToken: string;
    refreshToken: string;
    role: "user" | "admin" | "owner" | "staff";
    redirectTo: string;
  };
}

export class AuthService implements IAuthService {
  private _googleClient: OAuth2Client;
  private readonly _loginChain: RoleLoginChain;

  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _adminRepo: IAdminRepository,
    private readonly _ownerRepo: IOwnerRepository,
    private readonly _otpRepo: IOTPRepository,
    private readonly _emailService: IEmailService,
    private readonly _ownerRequestRepo: IOwnerRequestRepository,
    private readonly _staffRepo: IStaffRepository
    // private readonly _redisService?: RedisService
  ) {
    this._googleClient = new OAuth2Client(config.googleClientId);
    this._loginChain = new RoleLoginChain([
      new AdminLoginHandler(this._adminRepo),
      new OwnerLoginHandler(this._ownerRepo),
      new StaffLoginHandler(this._staffRepo),
      new UserLoginHandler(this._userRepo),
    ]);
  }

  private _generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const context: AuthLoginContext = {
        issueTokens: async (entity, role, userPayload, message, redirectTo) => {
          const { accessToken, refreshToken } = this.generateTokenPair(entity, role);
          const userId = String(entity.id ?? entity._id);
          await this.storeRefreshToken(userId, refreshToken, role as AuthRole);

          return {
            success: true,
            message,
            data: {
              user: userPayload as unknown as UserDataDto,
              accessToken,
              refreshToken,
              role,
              redirectTo,
            },
          };
        },
        onOwnerLogin: async (ownerId) => {
          await this._ownerRepo.updateLastLogin(ownerId);
        },
        onUserLogin: async (userId) => {
          await this._userRepo.updateUserLastActive(userId);
        },
      };

      return await this._loginChain.login(email, password, context);
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Something went wrong during login" };
    }
  }

  generateTokenPair(
    user: { email: string; id?: string; _id?: unknown },
    role: string
  ): TokenPairDto {
    const userId = String(user.id ?? user._id);
    const payload: JwtPayloadDto = {
      email: user.email,
      role,
    };
    if (role === "admin") {
      payload.adminId = userId;
    } else if (role === "owner") {
      payload.ownerId = userId;
    } else if (role === "user") {
      payload.userId = userId;
    } else if (role === "staff") {
      payload.staffId = userId;
    }

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: "15d",
    });

    const refreshToken = jwt.sign(
      { ...payload, tokenType: "refresh" },
      config.jwtRefreshSecret,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  async getUserByIdAndRole(
    userId: string,
    role: string
  ): Promise<UserLookupResponseDto> {
    try {
      let user;

      switch (role) {
        case "user":
          user = await this._userRepo.findById(userId);
          if (user) {
            return {
              _id: String(user._id),
              email: user.email,
              role: "user",
              name: user.username || user.firstName || user.email,
              ownerName: null,
            };
          }
          break;

        case "owner":
          user = await this._ownerRepo.findById(userId);
          if (user) {
            return {
              _id: String(user._id),
              email: user.email,
              role: "owner",
              name: user.ownerName,
              ownerName: user.ownerName,
            };
          }
          break;

        case "admin":
          user = await this._adminRepo.findById(userId);
          if (user) {
            return {
              _id: String(user._id),
              email: user.email,
              role: "admin",
              name: user.email,
              ownerName: null,
            };
          }
          break;
        case "staff":
          user = await this._staffRepo.findById(userId);
          if (user) {
            return {
              _id: String(user._id),
              email: user.email,
              role: "staff",
              name: `${user.firstName} ${user.lastName}`,
              ownerName: null,
            };
          }
          break;

        default:
          return null;
      }

      return null;
    } catch (error) {
      console.error("Auth service getUserByIdAndRole error:", error);
      return null;
    }
  }

  async storeRefreshToken(
    userId: string,
    refreshToken: string,
    userType: "user" | "admin" | "owner" | "staff"
  ) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    if (userType === "user") {
      await this._userRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "owner") {
      await this._ownerRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "admin") {
      await this._adminRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "staff") {
      await this._staffRepo.updateRefreshToken(userId, hashedToken);
    }
  }

  async sendPasswordResetOTP(
    email: string
  ): Promise<SendPasswordResetOtpResponseDto> {
    try {
      let user: AuthEntity | null = null;
      let userName = "User";
      let userType = "user";
      let otpType = "password_reset";

      user = await this._userRepo.findByEmail(email);
      if (user) {
        userName = user.username || "User";
        userType = "user";
        otpType = "password_reset";

        if (!user.isVerified) {
          return {
            success: false,
            message: "Please verify your email first before resetting password",
          };
        }
        if (!user.isActive) {
          return {
            success: false,
            message: "Your account has been blocked. Please contact support.",
          };
        }
      } else {
        const owner = await this._ownerRepo.findByEmail(email);
        if (owner) {
          user = owner;
          userName = owner.ownerName || "Owner";
          userType = "owner";
          otpType = "owner_password_reset";

          if (!owner.isActive) {
            return {
              success: false,
              message:
                "Your owner account has been suspended. Please contact support.",
            };
          }
          if (!owner.isVerified) {
            return {
              success: false,
              message: "Your owner account is not verified yet.",
            };
          }
        }
      }

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address",
        };
      }

      await this._otpRepo.deleteByEmail(email, otpType);

      const otp = this._generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this._otpRepo.create({
        email,
        otp,
        type: otpType,
        expiresAt,
        isUsed: false,
        userData: {
          userId: user._id?.toString() ?? "",
          userType: userType,
          userName: userName,
          email: user.email,
        },
      });

      const emailSent = await this._emailService.sendPasswordResetOTP(
        email,
        otp,
        userName
      );
      if (!emailSent) {
        return {
          success: false,
          message: "Failed to send password reset email",
        };
      }
      return {
        success: true,
        message: `Password reset code sent to ${email}. Please check your email.`,
        data: {
          email,
          userType,
          expiresIn: Math.floor(config.otpExpiry / 1000 / 60),
        },
      };
    } catch (error) {
      console.error("Send password reset OTP error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async verifyPasswordResetOtp(
    email: string,
    otp: string
  ): Promise<VerifyPasswordResetOtpResponseDto> {
    try {
      let otpRecord = await this._otpRepo.findValidOTP(
        email,
        otp,
        "password_reset"
      );

      if (!otpRecord) {
        otpRecord = await this._otpRepo.findValidOTP(
          email,
          otp,
          "owner_password_reset"
        );
      }

      if (!otpRecord) {
        return {
          success: false,
          message: "Invalid or expired verification code",
        };
      }

      return {
        success: true,
        message: "OTP verified successfully",
        data: {
          email,
          verified: true,
          userType: otpRecord.userData?.userType || "user",
        },
      };
    } catch (error) {
      console.error("Verify password reset OTP error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async resetPasswordWithOTP(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<ResetPasswordWithOtpResponseDto> {
    try {
      let otpRecord = await this._otpRepo.findValidOTP(
        email,
        otp,
        "password_reset"
      );
      let isOwner = false;

      if (!otpRecord) {
        otpRecord = await this._otpRepo.findValidOTP(
          email,
          otp,
          "owner_password_reset"
        );
        isOwner = true;
      }

      if (!otpRecord) {
        return {
          success: false,
          message: "Invalid or expired verification code",
        };
      }

      let user = null;
      let updateResult = false;

      if (isOwner) {
        const owner = await this._ownerRepo.findByEmail(email);
        if (!owner) {
          return {
            success: false,
            message: "Owner not found",
          };
        }

        const saltRounds = config.bcryptRounds;
        const hashed = await bcrypt.hash(newPassword, saltRounds);

        updateResult = await this._ownerRepo.updatePassword(
          owner._id.toString(),
          hashed
        );
        user = owner;
      } else {
        const userRecord = await this._userRepo.findByEmail(email);
        if (!userRecord) {
          return {
            success: false,
            message: "User not found",
          };
        }

        const saltRounds = config.bcryptRounds;
        const hashed = await bcrypt.hash(newPassword, saltRounds);

        updateResult = await this._userRepo.updatePassword(
          userRecord._id.toString(),
          hashed
        );
        user = userRecord;
      }

      if (!updateResult) {
        return {
          success: false,
          message: "Failed to update password",
        };
      }

      await this._otpRepo.markAsUsed(otpRecord._id as string);
      await this._otpRepo.deleteByEmail(email, otpRecord.type);

      try {
        await this._emailService.sendPasswordChangeConfirmation(
          email,
          otpRecord.userData?.userName || (isOwner ? "Owner" : "User")
        );
      } catch (emailError) {
        console.error(
          "Failed to send password change confirmation:",
          emailError
        );
      }

      return {
        success: true,
        message: "Password reset successfully",
        data: {
          userType: isOwner ? "owner" : "user",
        },
      };
    } catch (error) {
      console.error("Reset password with OTP error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  private async _verifyGoogleToken(
    credential: string
  ): Promise<GoogleUserDataDto> {
    try {
      if (!config.googleClientId) {
        throw new Error("Google Client ID not configured");
      }

      const ticket = await this._googleClient.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token payload");
      }

      return {
        googleId: payload.sub,
        email: payload.email!,
        name: payload.name!,
        avatar: payload.picture || "",
        emailVerified: payload.email_verified || false,
      };
    } catch (error) {
      throw new Error(`Google token verification failed: ${error}`);
    }
  }

  async googleAuth(credential: string): Promise<GoogleAuthResponseDto> {
    try {
      if (!config.googleClientId || !config.googleClientSecret) {
        return {
          success: false,
          message: "Google OAuth is not configured. Please contact support.",
        };
      }

      const googleUserData = await this._verifyGoogleToken(credential);

      let user = await this._userRepo.findUserByGoogleIdOrEmail(
        googleUserData.googleId,
        googleUserData.email
      );

      if (!user) {
        user = await this._userRepo.findByEmail(
          googleUserData.email.toLowerCase().trim()
        );
      }

      let isNewUser = false;

      if (!user) {
        user = await this._createGoogleUser(googleUserData);
        isNewUser = true;
      } else {
        user = await this._updateExistingGoogleUser(user, googleUserData);
      }

      const { accessToken, refreshToken } = this.generateTokenPair(
        user,
        "user"
      );

      await this.storeRefreshToken(user._id, refreshToken, "user");

      return {
        success: true,
        message: isNewUser
          ? "Account created successfully"
          : "Login successful",
        data: {
          accessToken,
          refreshToken,
          user: this._sanitizeUserData(user),
          isNewUser,
        },
      };
    } catch (error) {
      console.error("Google auth error:", error);
      const errMessage =
        error instanceof Error ? getErrorMessage(error) : "Something went wrong";

      return {
        success: false,
        message: errMessage,
      };
    }
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponseDto> {
    try {
      // const isBlacklisted = await this._redisService.isRefreshTokenBlacklisted(
      //   refreshToken
      // );
      // if (isBlacklisted) {
      //   return { success: false, message: "Token has been revoked" };
      // }

      const decoded = jwt.verify(
        refreshToken,
        config.jwtRefreshSecret
      ) as JwtPayloadDto;

      if (decoded.tokenType !== "refresh") {
        return { success: false, message: "Invalid token type" };
      }

      let user;
      let userType = decoded.role;

      if (userType === "user") {
        user = await this._userRepo.findById(decoded.userId);
      } else if (userType === "owner") {
        user = await this._ownerRepo.findById(decoded.ownerId);
      } else if (userType === "admin") {
        user = await this._adminRepo.findById(decoded.adminId);
      } else if (userType === "staff") {
        user = await this._staffRepo.findById(decoded.staffId);
      }

      if (!user || !user.refreshToken) {
        return { success: false, message: "Invalid refresh token" };
      }

      const isValidRefreshToken = await bcrypt.compare(
        refreshToken,
        user.refreshToken
      );

      if (!isValidRefreshToken) {
        return { success: false, message: "Invalid refresh token" };
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokenPair(user, userType as "user" | "admin" | "owner" | "staff");

      await this.storeRefreshToken(String(user._id), newRefreshToken, userType as "user" | "admin" | "owner" | "staff");

      return {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          user: {
            id: String(user._id),
            email: user.email,
            role: userType,
          },
        },
      };
    } catch (error) {
      console.error(" Refresh token error:", error);
      return { success: false, message: "Token refresh failed" };
    }
  }

  private async _createGoogleUser(
    googleUserData: GoogleUserDataDto
  ): Promise<import("../../user/interfaces/user.model.interface").IUser> {
    try {
      const existingUser = await this._userRepo.findByEmail(
        googleUserData.email.toLowerCase().trim()
      );

      if (existingUser) {
        throw new Error(
          "An account with this email already exists. Please sign in with Google again or use email login."
        );
      }

      const isOwner = await this._ownerRequestRepo.findByEmail(
        googleUserData.email
      );
      if (isOwner) {
        throw new Error("User with this email already exists");
      }

      const isRequestedOwner = await this._ownerRepo.findByEmail(
        googleUserData.email
      );
      if (isRequestedOwner) {
        throw new Error("User with this email already exists");
      }

      const baseUsername = googleUserData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      let username = baseUsername;
      let counter = 1;

      while (await this._userRepo.findUserByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const newUser = await this._userRepo.createGoogleUser({
        username,
        email: googleUserData.email.toLowerCase(),
        googleId: googleUserData.googleId,
        firstName: googleUserData.name,
        avatar: googleUserData.avatar,
        authProvider: "google",
        isVerified: googleUserData.emailVerified,
      });

      return newUser;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  private async _updateExistingGoogleUser(
    user: import("../../user/interfaces/user.model.interface").IUser,
    googleUserData: GoogleUserDataDto
  ): Promise<import("../../user/interfaces/user.model.interface").IUser> {
    try {
      if (!user.googleId) {
        const updatedUser = await this._userRepo.linkGoogleAccount(
          user._id,
          googleUserData.googleId,
          {
            firstName: googleUserData.name,
            avatar: googleUserData.avatar,
            isVerified: googleUserData.emailVerified,
          }
        );

        if (!updatedUser) {
          throw new Error("Failed to link Google account");
        }

        try {
          await this._sendAccountLinkNotification(user.email);
        } catch (notificationError) {
          console.log("Account link notification failed:", notificationError);
        }

        return updatedUser;
      } else {
        const updatedUser = await this._userRepo.updateUserFromGoogle(
          user._id,
          {
            firstName: googleUserData.name,
            avatar: googleUserData.avatar,
            isVerified: googleUserData.emailVerified,
          }
        );

        if (!updatedUser) {
          throw new Error("Failed to update user");
        }

        return updatedUser;
      }
    } catch (error) {
      throw new Error(`Failed to update Google user: ${error}`);
    }
  }

  private _sanitizeUserData(user: AuthEntity): UserDataDto {
    const sanitizedUser = user.toObject
      ? user.toObject()
      : (user as Record<string, unknown>);

    return {
      id: String(sanitizedUser._id ?? sanitizedUser.id ?? ""),
      email: String(sanitizedUser.email),
      username: sanitizedUser.username as string | undefined,
      firstName: sanitizedUser.firstName as string | undefined,
      lastName: sanitizedUser.lastName as string | undefined,
      avatar: sanitizedUser.avatar as string | undefined,
      isVerified: sanitizedUser.isVerified as boolean | undefined,
      xpPoints: sanitizedUser.xpPoints as number | undefined,
      role: String(sanitizedUser.role ?? "user"),
      lastActive: sanitizedUser.lastActive as string | undefined,
    };
  }

  async logout(
    userId: string,
    userType: "user" | "admin" | "owner" | "staff",
    refreshToken?: string 
  ): Promise<AuthSuccessResponseDto | AuthErrorResponseDto> {
    try {
      // if (refreshToken) {
      //   await this._redisService.blacklistRefreshToken(refreshToken);
      // }

      if (userType === "user") {
        await this._userRepo.clearRefreshToken(userId);
      } else if (userType === "owner") {
        await this._ownerRepo.clearRefreshToken(userId);
      } else if (userType === "admin") {
        await this._adminRepo.clearRefreshToken(userId);
      } else if (userType === "staff") {
        await this._staffRepo.clearRefreshToken(userId);
      }

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      return { success: false, message: "Logout failed" };
    }
  }

  async checkAuthProvider(
    email: string
  ): Promise<CheckAuthProviderResponseDto> {
    try {
      const user = await this._userRepo.findByEmail(email);

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "",
        data: {
          authProvider: user.authProvider,
          hasGoogleLinked: !!user.googleId,
          hasPassword: !!user.password,
          canUseEmailLogin: !!user.password,
          canUseGoogleLogin: !!user.googleId,
        },
      };
    } catch (error) {
      console.error("Check auth provider error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  private async _sendAccountLinkNotification(email: string) {
    try {
      const emailContent = {
        to: email,
        subject: "Google Account Linked",
        text: "Your account has been successfully linked with Google Sign-In.",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Account Linked Successfully</h2>
            <p>Your account has been successfully linked with Google Sign-In.</p>
            <p>You can now sign in using either:</p>
            <ul>
              <li>Your email and password</li>
              <li>Google Sign-In</li>
            </ul>
            <p>If you didn't request this change, please contact support immediately.</p>
          </div>
        `,
      };

      await this._emailService.sendOTPEmail(
        email,
        "Google account linked successfully"
      );
    } catch (error) {
      console.error("Failed to send account link notification:", error);
    }
  }
}
