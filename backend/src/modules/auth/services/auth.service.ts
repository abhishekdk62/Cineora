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
import { ServiceResponse } from "../../user/interfaces/user.interface";

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
    role: "user" | "admin" | "owner";
    redirectTo: string;
  };
}

export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly adminRepo: AdminRepository,
    private readonly ownerRepo: OwnerRepository,
    private readonly otpRepo: OTPRepository,
    private readonly emailService: EmailService,
    private readonly ownerRequestRepo: OwnerRequestRepository
  ) {
    this.googleClient = new OAuth2Client(config.googleClientId);
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const admin = await this.adminRepo.findByEmail(email);
      if (admin) {
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
          return { success: false, message: "Invalid credentials" };
        }

        const { accessToken, refreshToken } = this.generateTokenPair(admin, 'admin');
        
        await this.storeRefreshToken(admin._id as string, refreshToken, 'admin');

        return {
          success: true,
          message: "Admin login successful",
          data: {
            user: {
              id: admin._id,
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

      const owner = await this.ownerRepo.findByEmail(email);
      if (owner) {
        const isValidPassword = await bcrypt.compare(password, owner.password);

        if (!isValidPassword) {
          return { success: false, message: "Invalid credentials" };
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

        const { accessToken, refreshToken } = this.generateTokenPair(owner, 'owner');
        
        await this.storeRefreshToken(owner._id, refreshToken, 'owner');

        await this.ownerRepo.updateLastLogin(owner._id);

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

      const user = await this.userRepo.findByEmail(email);
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return { success: false, message: "Invalid credentials" };
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

        const { accessToken, refreshToken } = this.generateTokenPair(user, 'user');
        
        await this.storeRefreshToken(user._id, refreshToken, 'user');

        await this.userRepo.updateLastActive(user._id);

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
        message: "No account found with this email address",
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Something went wrong during login" };
    }
  }

  generateTokenPair(user: any, role: string) {
    let payload: any = {
      email: user.email,
      role,
    };
    if (role === 'admin') {
      payload.adminId = user._id;
    } else if (role === 'owner') {
      payload.ownerId = user._id;
    } else if (role === 'user') {
      payload.userId = user._id;
    }

    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(
      { ...payload, tokenType: 'refresh' },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async getUserByIdAndRole(userId: string, role: string) {
    try {
      let user;

      switch (role) {
        case 'user':
          user = await this.userRepo.findById(userId)
          if (user) {
            return {
              _id: user._id,
              email: user.email,
              role: 'user',
              name: user.name,
              ownerName: null
            };
          }
          break;

        case 'owner':
          user = await this.ownerRepo.findById(userId)
          if (user) {
            return {
              _id: user._id,
              email: user.email,
              role: 'owner',
              name: user.ownerName,
              ownerName: user.ownerName
            };
          }
          break;

        case 'admin':
          user = await this.adminRepo.findById(userId)
          if (user) {
            return {
              _id: user._id,
              email: user.email,
              role: 'admin',
              name: user.adminName || user.name,
              ownerName: null
            };
          }
          break;

        default:
          return null;
      }

      return null;
      
    } catch (error) {
      console.error('Auth service getUserByIdAndRole error:', error);
      return null;
    }
  }

  async storeRefreshToken(userId: string, refreshToken: string, userType: 'user' | 'admin' | 'owner') {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    
    if (userType === 'user') {
      await this.userRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === 'owner') {
      await this.ownerRepo.updateRefreshToken(userId, hashedToken);
    } else if (userType === 'admin') {
      await this.adminRepo.updateRefreshToken(userId, hashedToken);
    }
  }

  async sendPasswordResetOTP(email: string) {
    try {
      let user: any = null;
      let userName = "User";
      let userType = "user";
      let otpType = "password_reset";

      user = await this.userRepo.findByEmail(email);
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
        const owner = await this.ownerRepo.findByEmail(email);
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

      await this.otpRepo.deleteByEmail(email, otpType);

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepo.create({
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

      const emailSent = await this.emailService.sendPasswordResetOTP(
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

  async verifyPasswordResetOtp(email: string, otp: string) {
    try {
      let otpRecord = await this.otpRepo.findValidOTP(
        email,
        otp,
        "password_reset"
      );

      if (!otpRecord) {
        otpRecord = await this.otpRepo.findValidOTP(
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

  async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
    try {
      let otpRecord = await this.otpRepo.findValidOTP(
        email,
        otp,
        "password_reset"
      );
      let isOwner = false;

      if (!otpRecord) {
        otpRecord = await this.otpRepo.findValidOTP(
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

      let user: any = null;
      let updateResult = false;

      if (isOwner) {
        const owner = await this.ownerRepo.findByEmail(email);
        if (!owner) {
          return {
            success: false,
            message: "Owner not found",
          };
        }

        const saltRounds = config.bcryptRounds;
        const hashed = await bcrypt.hash(newPassword, saltRounds);

        updateResult = await this.ownerRepo.updatePassword(
          owner._id.toString(),
          hashed
        );
        user = owner;
      } else {
        const userRecord = await this.userRepo.findByEmail(email);
        if (!userRecord) {
          return {
            success: false,
            message: "User not found",
          };
        }

        const saltRounds = config.bcryptRounds;
        const hashed = await bcrypt.hash(newPassword, saltRounds);

        updateResult = await this.userRepo.updatePassword(
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

      await this.otpRepo.markAsUsed(otpRecord._id as string);
      await this.otpRepo.deleteByEmail(email, otpRecord.type);

      try {
        await this.emailService.sendPasswordChangeConfirmation(
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

  private async verifyGoogleToken(credential: string): Promise<{
    googleId: string;
    email: string;
    name: string;
    avatar: string;
    emailVerified: boolean;
  }> {
    try {
      if (!config.googleClientId) {
        throw new Error("Google Client ID not configured");
      }

      const ticket = await this.googleClient.verifyIdToken({
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

  async googleAuth(credential: string): Promise<ServiceResponse> {
    try {
      if (!config.googleClientId || !config.googleClientSecret) {
        return {
          success: false,
          message: "Google OAuth is not configured. Please contact support.",
        };
      }

      const googleUserData = await this.verifyGoogleToken(credential);

      let user = await this.userRepo.findByGoogleIdOrEmail(
        googleUserData.googleId,
        googleUserData.email
      );

      let isNewUser = false;

      if (!user) {
        user = await this.createGoogleUser(googleUserData);
        isNewUser = true;
      } else {
        user = await this.updateExistingGoogleUser(user, googleUserData);
      }

      const { accessToken, refreshToken } = this.generateTokenPair(user, 'user');
      
      await this.storeRefreshToken(user._id, refreshToken, 'user');

      return {
        success: true,
        message: isNewUser
          ? "Account created successfully"
          : "Login successful",
        data: {
          accessToken,
          refreshToken,
          user: this.sanitizeUserData(user),
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

  async refreshAccessToken(refreshToken: string): Promise<{
    success: boolean;
    message: string;
    data?: { accessToken: string; refreshToken: string };
  }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      if (decoded.tokenType !== 'refresh') {
        return { success: false, message: 'Invalid token type' };
      }

      let user;
      let userType = decoded.role;
      
      if (userType === 'user') {
        user = await this.userRepo.findById(decoded.userId);
      } else if (userType === 'owner') {
        user = await this.ownerRepo.findById(decoded.ownerId);
      } else if (userType === 'admin') {
        user = await this.adminRepo.findById(decoded.adminId);
      }

      if (!user || !user.refreshToken) {
        return { success: false, message: 'Invalid refresh token' };
      }

      const isValidRefreshToken = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValidRefreshToken) {
        return { success: false, message: 'Invalid refresh token' };
      }

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokenPair(user, userType);
      
      await this.storeRefreshToken(user._id, newRefreshToken, userType);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return { success: false, message: 'Token refresh failed' };
    }
  }

  private async createGoogleUser(googleUserData: {
    googleId: string;
    email: string;
    name: string;
    avatar: string;
    emailVerified: boolean;
  }): Promise<any> {
    try {
      const existingUser = await this.userRepo.findByEmail(
        googleUserData.email
      );

      if (existingUser && existingUser.isVerified) {
        throw new Error("User with this email already exists");
      }

      const isOwner = await this.ownerRequestRepo.findByEmail(
        googleUserData.email
      );
      if (isOwner) {
        throw new Error("User with this email already exists");
      }

      const isRequestedOwner = await this.ownerRepo.findByEmail(
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

      while (await this.userRepo.findByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const newUser = await this.userRepo.createGoogleUser({
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

  private async updateExistingGoogleUser(
    user: any,
    googleUserData: {
      googleId: string;
      email: string;
      name: string;
      avatar: string;
      emailVerified: boolean;
    }
  ): Promise<any> {
    try {
      if (!user.googleId) {
        const updatedUser = await this.userRepo.linkGoogleAccount(
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
          await this.sendAccountLinkNotification(user.email);
        } catch (notificationError) {
          console.log("Account link notification failed:", notificationError);
        }

        return updatedUser;
      } else {
        const updatedUser = await this.userRepo.updateUserFromGoogle(user._id, {
          firstName: googleUserData.name,
          avatar: googleUserData.avatar,
          isVerified: googleUserData.emailVerified,
        });

        if (!updatedUser) {
          throw new Error("Failed to update user");
        }

        return updatedUser;
      }
    } catch (error) {
      throw new Error(`Failed to update Google user: ${error}`);
    }
  }

  private sanitizeUserData(user: any): any {
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
      authProvider: sanitizedUser.authProvider,
      xpPoints: sanitizedUser.xpPoints,
      role: sanitizedUser.role || "user",
      lastActive: sanitizedUser.lastActive,
    };
  }

  async logout(userId: string, userType: 'user' | 'admin' | 'owner') {
    try {
      if (userType === 'user') {
        await this.userRepo.clearRefreshToken(userId);
      } else if (userType === 'owner') {
        await this.ownerRepo.clearRefreshToken(userId);
      } else if (userType === 'admin') {
        await this.adminRepo.clearRefreshToken(userId);
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, message: 'Logout failed' };
    }
  }

  async checkAuthProvider(email: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepo.findByEmail(email);

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

  private async sendAccountLinkNotification(email: string): Promise<void> {
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

      await this.emailService.sendOTPEmail(
        email,
        "Google account linked successfully"
      );
    } catch (error) {
      console.error("Failed to send account link notification:", error);
    }
  }
}
