import * as bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";

import { OTPRepository } from "../../otp/repositories/otp.repository";
import { EmailService } from "../../../services/email.service";
import { config } from "../../../config";
import {
  IUserService,
  SignupData,
  UpdateProfileData,
  ServiceResponse,
} from "../interfaces/user.interface";
import { OwnerRepository } from "../../owner/repositories/owner.repository";
import { OwnerRequestRepository } from "../../owner/repositories/ownerRequest.repository";

export class UserService implements IUserService {
  private userRepo = new UserRepository();
  private ownerRepo = new OwnerRepository();
  private ownerProfileRepo = new OwnerRequestRepository();
  private otpRepo = new OTPRepository();
  private emailService = new EmailService();

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(userData: SignupData): Promise<ServiceResponse> {
    try {
      const { username, email, password, ...otherData } = userData;

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }
      const isOwner = await this.ownerProfileRepo.findByEmail(email);

      if (isOwner) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }
      const isRequestedOwner = await this.ownerRepo.findByEmail(email);
      if (isRequestedOwner) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }
      const existingUsername = await this.userRepo.findByUsername(username);
      if (existingUsername && existingUsername.isVerified) {
        return { success: false, message: "Username already taken" };
      }

      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepo.create({
        email,
        otp,
        type: "signup",
        expiresAt,
        userData: {
          username,
          email,
          password: hashedPassword,
          ...otherData,
        },
      });

      // Send OTP email
      const emailSent = await this.emailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        return { success: false, message: "Failed to send verification email" };
      }

      return {
        success: true,
        message:
          "Verification code sent to your email. Please verify to complete registration.",
        data: { email, username },
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Something went wrong during signup" };
    }
  }

  async verifyOTP(email: string, otp: string): Promise<ServiceResponse> {
    try {
      const validOTP = await this.otpRepo.findValidOTP(email, otp, "signup");

      if (!validOTP || !validOTP.userData) {
        return { success: false, message: "Invalid or expired OTP" };
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return { success: false, message: "User already exists and verified" };
      }

      const newUser = await this.userRepo.create({
        ...validOTP.userData,
        isVerified: true,
        xpPoints: 100,
        joinedAt: new Date(),
        lastActive: new Date(),
        isActive: true,
      });

      await this.otpRepo.markAsUsed(validOTP._id as string);

      return {
        success: true,
        message:
          "Account created and verified successfully! Welcome bonus: 100 XP added.",
        data: {
          userId: newUser._id,
          username: newUser.username,
          isVerified: true,
          xpBonus: 100,
        },
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message: "Something went wrong during verification",
      };
    }
  }

  async resendOTP(email: string): Promise<ServiceResponse> {
    try {
      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return {
          success: false,
          message: "User already verified. Please login instead.",
        };
      }

      // Find existing OTP to get the stored user data
      const existingOTP = await this.otpRepo.findByEmail(email, "signup");
      if (!existingOTP || !existingOTP.userData) {
        return {
          success: false,
          message: "No pending signup found. Please signup again.",
        };
      }

      // Generate new OTP
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepo.create({
        email,
        otp,
        type: "signup",
        expiresAt,
        userData: existingOTP.userData,
      });

      // Send OTP email
      const emailSent = await this.emailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        return { success: false, message: "Failed to send verification email" };
      }

      return {
        success: true,
        message: "Verification code sent to your email!",
      };
    } catch (error) {
      console.error("Resend OTP error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  // ... rest of your methods remain the same ...
  async getUserProfile(id: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepo.findById(id);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      await this.userRepo.updateLastActive(id);

      return {
        success: true,
        message: "Profile fetched successfully",
        data: user,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async updateProfile(
    id: string,
    updateData: UpdateProfileData
  ): Promise<ServiceResponse> {
    try {
      const updatedUser = await this.userRepo.updateProfile(id, updateData);

      if (!updatedUser) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async getNearbyUsers(
    userId: string,
    maxDistance: number = 5000
  ): Promise<ServiceResponse> {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user || !user.coordinates) {
        return {
          success: false,
          message: "User not found or location not set",
        };
      }

      const nearbyUsers = await this.userRepo.findNearbyUsers(
        user.coordinates,
        maxDistance
      );

      return {
        success: true,
        message: "Nearby users fetched successfully",
        data: nearbyUsers,
      };
    } catch (error) {
      console.error("Get nearby users error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async addXpPoints(userId: string, points: number): Promise<ServiceResponse> {
    try {
      const success = await this.userRepo.addXpPoints(userId, points);

      if (!success) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: `${points} XP points added successfully`,
      };
    } catch (error) {
      console.error("Add XP points error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }
}
