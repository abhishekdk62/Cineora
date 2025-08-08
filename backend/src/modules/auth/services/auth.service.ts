import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { UserRepository } from "../../user/repositories/user.repository";
import { AdminRepository } from "../../admin/repositories/admin.repository";
import { OwnerRepository } from "../../owner/repositories/owner.repository";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { EmailService } from "../../../services/email.service";
import { config } from "../../../config";

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
    role: "user" | "admin" | "owner";
    redirectTo: string;
  };
}

export class AuthService {
  private userRepo = new UserRepository();
  private adminRepo = new AdminRepository();
  private ownerRepo = new OwnerRepository();
  private otpRepo = new OTPRepository();
  private emailService = new EmailService();
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
        const token = jwt.sign(
          {
            id: admin._id,
            adminId: admin._id,
            email: admin.email,
            role: "admin",
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );
        return {
          success: true,
          message: "Admin login successful",
          data: {
            user: {
              id: admin._id,
              email: admin.email,
              role: "admin",
            },
            token,
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

        const token = jwt.sign(
          {
            id: owner._id,
            ownerId: owner._id,
            email: owner.email,
            role: "owner",
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );

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
            token,
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

        // Generate JWT token for user
        const token = jwt.sign(
          {
            id: user._id,
            userId: user._id,
            email: user.email,
            role: "user",
          },
          config.jwtSecret,
          { expiresIn: config.jwtExpiresIn }
        );

        // Update last active
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
            token,
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
        type: "owner_password_reset",
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
        message: "OTP verified successfully", // ✅ Fixed typo: "succesfully" → "successfully"
        data: {
          email,
          verified: true,
          userType: otpRecord.userData?.userType || "user",
        },
      };
    } catch (error) {
      console.error("Verify password reset OTP error:", error); // ✅ Added proper logging
      return { success: false, message: "Something went wrong" }; // ✅ Capitalized
    }
  }

  async resetPasswordWithOTP(email: string, otp: string, newPassword: string) {
    try {
      // ✅ Try both user and owner OTP types
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
        // ✅ Handle owner password reset
        const owner = await this.ownerRepo.findByEmail(email);
        if (!owner) {
          return {
            success: false,
            message: "Owner not found",
          };
        }

        // ✅ Owner-specific password validation (stricter)
        if (newPassword.length < 8) {
          return {
            success: false,
            message: "Owner password must be at least 8 characters long",
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

        // ✅ User password validation
        if (newPassword.length < 6) {
          return {
            success: false,
            message: "Password must be at least 6 characters long",
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

      // ✅ Clean up OTP
      await this.otpRepo.markAsUsed(otpRecord._id as string);
      await this.otpRepo.deleteByEmail(email, otpRecord.type);

      // ✅ Send confirmation email
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
      console.error("Reset password with OTP error:", error); // ✅ Added proper error handling
      return { success: false, message: "Something went wrong" };
    }
  }
}
