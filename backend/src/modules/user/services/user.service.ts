import * as bcrypt from "bcryptjs";

import { IEmailService } from "../../../services/email.service";
import { config } from "../../../config";

import {
  GetUsersResponseDto,
  SendEmailChangeOTPResponseDto,
  SignupDto,
  SignupResponseDto,
  UpdateProfileDto,
  UserCountsResponseDto,
  UserResponseDto,
  UserResponseDtoWithUrl,
  VerifyEmailChangeOTPResponseDto,
  VerifyOTPResponseDto,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { IOTPRepository } from "../../otp/interfaces/otp.repository.interface";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
} from "../../owner/interfaces/owner.repository.interface";
import { generateSignedUrl, uploadToCloudinary } from "../../../utils/cloudinaryUtil";

export class UserService implements IUserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly ownerRepo: IOwnerRepository,
    private readonly ownerRequestRepo: IOwnerRequestRepository,
    private readonly otpRepo: IOTPRepository,
    private readonly emailService: IEmailService
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async signup(
    userData: SignupDto
  ): Promise<ServiceResponse<SignupResponseDto>> {
    try {
      const { username, email, password, ...otherData } = userData;

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      const isOwner = await this.ownerRequestRepo.findByEmail(email);
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

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<ServiceResponse<VerifyOTPResponseDto>> {
    try {
      email = String(email || "")
        .trim()
        .toLowerCase(); // normalization

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
          user: newUser,
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

  async resendOTP(email: string): Promise<ServiceResponse<void>> {
    try {
      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return {
          success: false,
          message: "User already verified. Please login instead.",
        };
      }

      const existingOTP = await this.otpRepo.findByEmail(email, "signup");
      if (!existingOTP || !existingOTP.userData) {
        return {
          success: false,
          message: "No pending signup found. Please signup again.",
        };
      }

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepo.create({
        email,
        otp,
        type: "signup",
        expiresAt,
        userData: existingOTP.userData,
      });

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

  async getUserProfile(id: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepo.findById(id);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      await this.userRepo.updateLastActive(id);
    let profilePicUrl = null;
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      profilePicUrl = generateSignedUrl(user.profilePicture, {
        width: 200,
        height: 200,
        crop: 'fill'
      });
    }
  
const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      language: user.language,
      gender: user.gender,
      phone: user.phone,
      locationCity: user.locationCity,
      locationState: user.locationState,
      location: user.location,
      isVerified: user.isVerified,
      xpPoints: user.xpPoints,
      joinedAt: user.joinedAt,
      lastActive: user.lastActive,
      isActive: user.isActive,
      profilePicture: profilePicUrl 
    };
      return {
        success: true,
        message: "Profile fetched successfully",
        data: userResponse,
      };
    } catch (error) {
      console.error("Get profile error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async updateProfile(
    id: string,
    updateData: UpdateProfileDto,
    file?: Express.Multer.File
  ): Promise<ServiceResponse<UserResponseDto>> {
    try {
      if (updateData.profilePicture?.startsWith("data:image") || file) {
        try {
          let uploadResult;
          if (file) {
            uploadResult = await uploadToCloudinary(file, {
              folder: "users/profile-pictures",
              width: 500,
              height: 500,
              crop: "fill",
              quality: "auto:good",
            });
          } else if (updateData.profilePicture) {
            uploadResult = await uploadToCloudinary(updateData.profilePicture, {
              folder: "users/profile-pictures",
              width: 500,
              height: 500,
              crop: "fill",
              quality: "auto:good",
            });
          }
          if (uploadResult) {
            updateData.profilePicture = uploadResult.public_id;
          }
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return {
            success: false,
            message: "Failed to upload profile picture. Please try again.",
          };
        }
      }

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
  ): Promise<ServiceResponse<UserResponseDto[]>> {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user || !user.location.coordinates) {
        return {
          success: false,
          message: "User not found or location not set",
        };
      }

      const nearbyUsers = await this.userRepo.findNearbyUsers(
        user.location.coordinates,
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

  async addXpPoints(
    userId: string,
    points: number
  ): Promise<ServiceResponse<void>> {
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

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse<void>> {
    try {
      const user = await this.userRepo.findByIdWithPassword(userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return { success: false, message: "Old password is incorrect" };
      }

      const hash = await bcrypt.hash(newPassword, config.bcryptRounds);
      const updated = await this.userRepo.updatePassword(userId, hash);

      if (!updated) {
        return { success: false, message: "Failed to update password" };
      }

      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async sendEmailChangeOTP(
    id: string,
    email: string,
    password: string
  ): Promise<ServiceResponse<SendEmailChangeOTPResponseDto>> {
    try {
      const user = await this.userRepo.findByIdWithPassword(id);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { success: false, message: "Invalid password" };
      }

      if (user.email.toLowerCase() === email.toLowerCase()) {
        return {
          success: false,
          message: "New email must be different from current email",
        };
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        return { success: false, message: "Email already in use" };
      }

      const isRequestedOwner = await this.ownerRequestRepo.findByEmail(email);
      if (
        isRequestedOwner &&
        isRequestedOwner.status !== "rejected" &&
        isRequestedOwner.status !== "approved"
      ) {
        return { success: false, message: "Email already in use" };
      }

      const existingOwner = await this.ownerRepo.findByEmail(email);
      if (existingOwner) {
        return { success: false, message: "Email already in use" };
      }

      await this.otpRepo.deleteByEmail(email, "email_change");

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepo.create({
        email,
        otp,
        type: "email_change",
        expiresAt,
        isUsed: false,
        userData: {
          id,
          oldEmail: user.email,
        },
      });

      const emailSent = await this.emailService.sendEmailChangeOTP(
        email,
        otp,
        user.email
      );

      if (!emailSent) {
        return { success: false, message: "Failed to send verification email" };
      }

      return {
        success: true,
        message: `Verification code sent to ${email}. Please check your email.`,
        data: {
          email,
          expiresIn: Math.floor(config.otpExpiry / 1000 / 60),
        },
      };
    } catch (error) {
      console.error("Send email change OTP error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async verifyEmailChangeOTP(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse<VerifyEmailChangeOTPResponseDto>> {
    try {
      const otpRecord = await this.otpRepo.findValidOTP(
        email,
        otp,
        "email_change"
      );

      if (!otpRecord) {
        return {
          success: false,
          message: "Invalid or expired verification code",
        };
      }

      if (otpRecord.userData?.id !== id) {
        return {
          success: false,
          message: "Invalid verification code",
        };
      }

      const isValidOTP = otp === otpRecord.otp;
      if (!isValidOTP) {
        return {
          success: false,
          message: "Invalid verification code",
        };
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== id) {
        return { success: false, message: "Email already in use" };
      }

      const isRequestedOwner = await this.ownerRequestRepo.findByEmail(email);
      if (
        isRequestedOwner &&
        isRequestedOwner.status !== "rejected" &&
        isRequestedOwner.status !== "approved"
      ) {
        return { success: false, message: "Email already in use" };
      }

      const existingOwner = await this.ownerRequestRepo.findByEmail(email);
      if (existingOwner) {
        return { success: false, message: "Email already in use" };
      }

      const updatedUser = await this.userRepo.updateProfile(id, {
        email,
        isVerified: true,
      });

      if (!updatedUser) {
        return {
          success: false,
          message: "Failed to update email",
        };
      }

      const emailSent =
        await this.emailService.sendEmailChangeSuccessNotification(
          updatedUser.email,
          otpRecord.userData?.oldEmail || "Unknown"
        );

      if (!emailSent) {
        return { success: false, message: "Failed to send Success email" };
      }

      await this.otpRepo.markAsUsed(otpRecord._id as string);
      await this.otpRepo.deleteByEmail(email, "email_change");

      return {
        success: true,
        message: "Email changed successfully",
        data: {
          email: updatedUser.email,
          oldEmail: otpRecord.userData?.oldEmail,
        },
      };
    } catch (error) {
      console.error("Verify email change OTP error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getUserCounts(): Promise<ServiceResponse<UserCountsResponseDto>> {
    try {
      const [activeUsers, inactiveUsers, verifiedUsers, unverifiedUsers] =
        await Promise.all([
          this.userRepo
            .findByStatus("active", 1, 1)
            .then((result) => result.total),
          this.userRepo
            .findByStatus("inactive", 1, 1)
            .then((result) => result.total),
          this.userRepo
            .findByVerification(true, 1, 1)
            .then((result) => result.total),
          this.userRepo
            .findByVerification(false, 1, 1)
            .then((result) => result.total),
        ]);

      return {
        success: true,
        message: "User counts fetched successfully",
        data: {
          counts: {
            activeUsers,
            inactiveUsers,
            verifiedUsers,
            unverifiedUsers,
          },
        },
      };
    } catch (error) {
      console.error("Get user counts error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async getUsers(filters: any): Promise<ServiceResponse<GetUsersResponseDto>> {
    try {
      const {
        search,
        status,
        isVerified,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
      } = filters;

      let result;
      if (status) {
        result = await this.userRepo.findByStatus(
          status,
          Number(page),
          Number(limit)
        );
      } else {
        result = await this.userRepo.findAll(Number(page), Number(limit));
      }

      if (search) {
        result.users = result.users.filter(
          (user: any) =>
            user.username.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            (user.firstName &&
              user.firstName.toLowerCase().includes(search.toLowerCase())) ||
            (user.lastName &&
              user.lastName.toLowerCase().includes(search.toLowerCase()))
        );
      }

      if (isVerified !== undefined) {
        result.users = result.users.filter(
          (user: any) => user.isVerified === isVerified
        );
      }

      if (sortBy) {
        result.users.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];

          if (
            sortBy.includes("Date") ||
            sortBy.includes("At") ||
            sortBy === "joinedAt"
          ) {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }

          if (sortOrder === "desc") {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });
      }

         result.users = result.users.map((request) => {
           return {
             ...request,
             profilePicture: request.profilePicture
               ? generateSignedUrl(request.profilePicture, {
                   width: 800,
                   height: 600,
                   crop: "fit",
                 })
               : null,
           };
         });
      return {
        success: true,
        message: "Users fetched successfully",
        data: {
          users: result.users,
          meta: {
            pagination: {
              currentPage: Number(page),
              totalPages: Math.ceil(result.total / Number(limit)),
              total: result.total,
              limit: Number(limit),
            },
          },
        },
      };
    } catch (error) {
      console.error("Get users error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async toggleUserStatus(
    userId: string
  ): Promise<ServiceResponse<UserResponseDto>> {
    try {
      if (!userId) {
        return { success: false, message: "User ID is required" };
      }

      const updatedUser = await this.userRepo.toggleStatus(userId);

      if (!updatedUser) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: `User ${
          updatedUser.isActive ? "activated" : "deactivated"
        } successfully`,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Toggle user status error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }

  async getUserDetails(
    userId: string
  ): Promise<ServiceResponse<UserResponseDto>> {
    try {
      if (!userId) {
        return { success: false, message: "User ID is required" };
      }

      const user = await this.userRepo.findById(userId);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        message: "User details fetched successfully",
        data: user,
      };
    } catch (error) {
      console.error("Get user details error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }
}
