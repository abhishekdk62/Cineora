import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../../user/repositories/user.repository";
import { AdminRepository } from "../../admin/repositories/admin.repository";
import { OwnerRepository } from "../../owner/repositories/owner.repository";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { EmailService } from "../../../services/email.service";
import { config } from "../../../config";
import { OAuth2Client } from "google-auth-library";
import { OwnerRequestRepository } from "../../owner/repositories/ownerRequest.repository";
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
  TokenPairDto,
  UserDataDto,
  UserLookupResponseDto,
  VerifyPasswordResetOtpResponseDto,
} from "../dtos/dtos";
import { Staff } from "../../staff/model/staff.model";
import { UserResponseDto } from "../../user/dtos/dto";
import { UserInfo } from "os";
import { RedisService } from "../../../services/redis.service";
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

  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _adminRepo: AdminRepository,
    private readonly _ownerRepo: OwnerRepository,
    private readonly _otpRepo: OTPRepository,
    private readonly _emailService: EmailService,
    private readonly _ownerRequestRepo: OwnerRequestRepository,
    private readonly _redisService?: RedisService
  ) {
    this._googleClient = new OAuth2Client(config.googleClientId);
  }

  private _generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(email: string, password: string): Promise<LoginResponseDto> {
    try {
      const admin = await this._adminRepo.findByEmail(email);
      if (admin) {
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
          return { success: false, message: "Invalid Password" };
        }

        const { accessToken, refreshToken } = this.generateTokenPair(
          admin,
          "admin"
        );

        await this.storeRefreshToken(
          admin._id as string,
          refreshToken,
          "admin"
        );

        return {
          success: true,
          message: "Admin login successful",
          data: {
            user: {
              id: admin._id as string,
              email: admin.email,
              role: "admin",
            },
            accessToken,
            refreshToken,
            role: "admin",
            redirectTo: "/admin/dashboard",
          },
        };
      }

      const owner = await this._ownerRepo.findByEmail(email);
      if (owner) {
        const isValidPassword = await bcrypt.compare(password, owner.password);

        if (!isValidPassword) {
          return { success: false, message: "Invalid Password" };
        }

        if (!owner.isActive) {
          return {
            success: false,
            message: "Your account has been blocked. Please contact support.",
          };
        }

        if (!owner.isVerified) {
          return {
            success: false,
            message: "Your account is not verified yet.",
          };
        }

        const { accessToken, refreshToken } = this.generateTokenPair(
          owner,
          "owner"
        );

        await this.storeRefreshToken(owner._id, refreshToken, "owner");

        await this._ownerRepo.updateLastLogin(owner._id);

        return {
          success: true,
          message: "Owner login successful",
          data: {
            user: {
              id: owner._id,
              ownerName: owner.ownerName,
              email: owner.email,
              phone: owner.phone,
              isVerified: owner.isVerified,
              isActive: owner.isActive,
              role: "owner",
            },
            accessToken,
            refreshToken,
            role: "owner",
            redirectTo: "/owner/dashboard",
          },
        };
      }
      const staff = await Staff.findOne({ email });
      if (staff) {
        const isValidPassword = await bcrypt.compare(password, staff.password);

        if (!isValidPassword) {
          return { success: false, message: "Invalid Password" };
        }

        if (!staff.isActive) {
          return {
            success: false,
            message: "Your account has been blocked. Please contact support.",
          };
        }

        const { accessToken, refreshToken } = this.generateTokenPair(
          staff,
          "staff"
        );

        await this.storeRefreshToken(
          staff._id as string,
          refreshToken,
          "staff"
        );

        return {
          success: true,
          message: "Staff login successful",
          data: {
            user: {
              id: staff._id as string,
              firstName: staff.firstName,
              lastName: staff.lastName,
              email: staff.email,
              role: "staff",
            },
            accessToken,
            refreshToken,
            role: "staff",
            redirectTo: "/staff/dashboard",
          },
        };
      }
      const user = await this._userRepo.findByEmail(email);
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return { success: false, message: "Invalid Password" };
        }

        if (!user.isVerified) {
          return {
            success: false,
            message: "Please verify your email before logging in",
          };
        }

        if (!user.isActive) {
          return {
            success: false,
            message: "Your account has been blocked. Please contact support.",
          };
        }

        const { accessToken, refreshToken } = this.generateTokenPair(
          user,
          "user"
        );

        await this.storeRefreshToken(user._id, refreshToken, "user");

        await this._userRepo.updateUserLastActive(user._id);

        return {
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              isVerified: user.isVerified,
              xpPoints: user.xpPoints,
              role: "user",
            },
            accessToken,
            refreshToken,
            role: "user",
            redirectTo: "/dashboard",
          },
        };
      }

      return {
        success: false,
        message: "Account not found please signup",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Something went wrong during login" };
    }
  }

  generateTokenPair(user: UserDataDto, role: string): TokenPairDto {
    let payload = {
      email: user.email,
      role,
    };
    if (role === "admin") {
      payload.adminId = user._id;
    } else if (role === "owner") {
      payload.ownerId = user._id;
    } else if (role === "user") {
      payload.userId = user._id;
    } else if (role === "staff") {
      payload.staffId = user._id;
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
              _id: user._id,
              email: user.email,
              role: "user",
              name: user.name,
              ownerName: null,
            };
          }
          break;

        case "owner":
          user = await this._ownerRepo.findById(userId);
          if (user) {
            return {
              _id: user._id,
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
              _id: user._id,
              email: user.email,
              role: "admin",
              name: user.adminName || user.name,
              ownerName: null,
            };
          }
          break;
        case "staff":
          user = await Staff.findById(userId);
          if (user) {
            return {
              _id: user._id,
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
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    if (userType === "user") {
      await this._userRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "owner") {
      await this._ownerRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "admin") {
      await this._adminRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === "staff") {
      await Staff.findByIdAndUpdate(userId, { refreshToken: hashedToken });
    }
  }

  async sendPasswordResetOTP(
    email: string
  ): Promise<SendPasswordResetOtpResponseDto> {
    try {
      let user: UserDataDto = null;
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
          userId: user._id.toString(),
          userType: userType,
          userName: userName,
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
      const errMessage = error?.message || "Something went wrong";

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

      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);

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
        user = await Staff.findById(decoded.staffId);
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
        this.generateTokenPair(user, userType);

      await this.storeRefreshToken(user._id, newRefreshToken, userType);

      return {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken,
          refreshToken: newRefreshToken,
          user: {
            id: user._id,
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
  ): Promise<UserResponseDto> {
    try {
      const existingUser = await this._userRepo.findByEmail(
        googleUserData.email
      );

      if (existingUser && existingUser.isVerified) {
        throw new Error("User with this email already exists");
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
    user,
    googleUserData: GoogleUserDataDto
  ): Promise<UserResponseDto> {
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

  private _sanitizeUserData(user: UserInfo): UserDataDto {
    const { password, __v, ...sanitizedUser } = user.toObject
      ? user.toObject()
      : user;

    return {
      id: sanitizedUser._id,
      email: sanitizedUser.email,
      username: sanitizedUser.username,
      firstName: sanitizedUser.firstName,
      lastName: sanitizedUser.lastName,
      avatar: sanitizedUser.avatar,
      isVerified: sanitizedUser.isVerified,
      xpPoints: sanitizedUser.xpPoints,
      role: sanitizedUser.role || "user",
      lastActive: sanitizedUser.lastActive,
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
        await Staff.findByIdAndUpdate(userId, { refreshToken: null });
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

  private async _sendAccountLinkNotification(email: string): Promise<void> {
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
