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
  VerifyEmailChangeOTPResponseDto,
  VerifyOTPResponseDto,
} from "../dtos/dto";
import { ApiResponse, createResponse } from "../../../utils/createResponse";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { IOTPRepository } from "../../otp/interfaces/otp.repository.interface";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
} from "../../owner/interfaces/owner.repository.interface";
import {
  generateSignedUrl,
  uploadToCloudinary,
} from "../../../utils/cloudinaryUtil";
import { UserDto, UserMapper } from "../../../mappers/user.mapper";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly ownerRepository: IOwnerRepository,
    private readonly ownerRequestRepository: IOwnerRequestRepository,
    private readonly otpRepository: IOTPRepository,
    private readonly emailService: IEmailService
  ) {}

  async signup(userData: SignupDto): Promise<ApiResponse<SignupResponseDto>> {
    try {
      const { username, email, password, ...otherData } = userData;

      const validationError = await this._validateSignupData(email, username);
      if (validationError) {
        return createResponse({
          success: false,
          message: validationError,
        });
      }

      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
      const otp = this._generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepository.create({
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
        return createResponse({
          success: false,
          message: "Failed to send verification email",
        });
      }

      return createResponse({
        success: true,
        message:
          "Verification code sent to your email. Please verify to complete registration.",
        data: { email, username },
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Something went wrong during signup"
      );
    }
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<ApiResponse<VerifyOTPResponseDto>> {
    try {
      email = String(email || "")
        .trim()
        .toLowerCase();

      const validOTP = await this.otpRepository.findValidOTP(
        email,
        otp,
        "signup"
      );
      if (!validOTP || !validOTP.userData) {
        return createResponse({
          success: false,
          message: "Invalid or expired OTP",
        });
      }

      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return createResponse({
          success: false,
          message: "User already exists and verified",
        });
      }

      const newUser = await this.userRepository.createUser({
        ...validOTP.userData,
        isVerified: true,
        xpPoints: 100,
        joinedAt: new Date(),
        lastActive: new Date(),
        isActive: true,
      });

      await this.otpRepository.markAsUsed(validOTP._id as string);

      return createResponse({
        success: true,
        message:
          "Account created and verified successfully! Welcome bonus: 100 XP added.",
        data: {
          user: newUser,
          xpBonus: 100,
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(
        error,
        "Something went wrong during verification"
      );
    }
  }

  async resendOTP(email: string): Promise<ApiResponse<void>> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return createResponse({
          success: false,
          message: "User already verified. Please login instead.",
        });
      }

      const existingOTP = await this.otpRepository.findByEmail(email, "signup");
      if (!existingOTP || !existingOTP.userData) {
        return createResponse({
          success: false,
          message: "No pending signup found. Please signup again.",
        });
      }

      const otp = this._generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepository.create({
        email,
        otp,
        type: "signup",
        expiresAt,
        userData: existingOTP.userData,
      });

      const emailSent = await this.emailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        return createResponse({
          success: false,
          message: "Failed to send verification email",
        });
      }

      return createResponse({
        success: true,
        message: "Verification code sent to your email!",
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async getUserProfile(id: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.userRepository.findUserById(id);

      if (!user) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }

      await this.userRepository.updateUserLastActive(id);

      let profilePicUrl = null;
      if (user.profilePicture && !user.profilePicture.startsWith("http")) {
        profilePicUrl = generateSignedUrl(user.profilePicture, {
          width: 200,
          height: 200,
          crop: "fill",
        });
      }

    
      let userDto=UserMapper.toDto(user)

      return createResponse({
        success: true,
        message: "Profile fetched successfully",
        data: userDto,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async updateUserProfile(
    id: string,
    updateData: UpdateProfileDto,
    file?: Express.Multer.File
  ): Promise<ApiResponse<UserResponseDto>> {
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
          return createResponse({
            success: false,
            message: "Failed to upload profile picture. Please try again.",
          });
        }
      }

      const updatedUser = await this.userRepository.updateUserProfile(
        id,
        updateData
      );

      if (!updatedUser) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }
let user=UserMapper.toDto(updatedUser)
      return createResponse({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async getNearbyUsers(
    userId: string,
    maxDistance: number = 5000
  ): Promise<ApiResponse<UserResponseDto[]>> {
    try {
      const user = await this.userRepository.findUserById(userId);

      if (!user || !user.location.coordinates) {
        return createResponse({
          success: false,
          message: "User not found or location not set",
        });
      }

      const nearbyUsers = await this.userRepository.findNearbyUsers(
        user.location.coordinates,
        maxDistance
      );
let users=nearbyUsers.map((user)=>UserMapper.toDto(user))
      return createResponse({
        success: true,
        message: "Nearby users fetched successfully",
        data: users,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async addUserXpPoints(
    userId: string,
    points: number
  ): Promise<ApiResponse<void>> {
    try {
      const success = await this.userRepository.addUserXpPoints(userId, points);

      if (!success) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }

      return createResponse({
        success: true,
        message: `${points} XP points added successfully`,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async changeUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    try {
      const user = await this.userRepository.findUserByIdWithPassword(userId);
      if (!user) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return createResponse({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const hash = await bcrypt.hash(newPassword, config.bcryptRounds);
      const updated = await this.userRepository.updateUserPassword(
        userId,
        hash
      );

      if (!updated) {
        return createResponse({
          success: false,
          message: "Failed to update password",
        });
      }

      return createResponse({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async sendEmailChangeOTP(
    id: string,
    email: string,
    password: string
  ): Promise<ApiResponse<SendEmailChangeOTPResponseDto>> {
    try {
      const user = await this.userRepository.findUserByIdWithPassword(id);
      if (!user) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return createResponse({
          success: false,
          message: "Invalid password",
        });
      }

      if (user.email.toLowerCase() === email.toLowerCase()) {
        return createResponse({
          success: false,
          message: "New email must be different from current email",
        });
      }

      const emailValidation = await this._validateEmailAvailability(email);
      if (emailValidation) {
        return createResponse({
          success: false,
          message: emailValidation,
        });
      }

      await this.otpRepository.deleteByEmail(email, "email_change");

      const otp = this._generateOTP();
      const expiresAt = new Date(Date.now() + config.otpExpiry);

      await this.otpRepository.create({
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
        return createResponse({
          success: false,
          message: "Failed to send verification email",
        });
      }

      return createResponse({
        success: true,
        message: `Verification code sent to ${email}. Please check your email.`,
        data: {
          email,
          expiresIn: Math.floor(config.otpExpiry / 1000 / 60),
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async verifyEmailChangeOTP(
    id: string,
    email: string,
    otp: string
  ): Promise<ApiResponse<VerifyEmailChangeOTPResponseDto>> {
    try {
      const otpRecord = await this.otpRepository.findValidOTP(
        email,
        otp,
        "email_change"
      );

      if (!otpRecord) {
        return createResponse({
          success: false,
          message: "Invalid or expired verification code",
        });
      }

      if (otpRecord.userData?.id !== id) {
        return createResponse({
          success: false,
          message: "Invalid verification code",
        });
      }

      const isValidOTP = otp === otpRecord.otp;
      if (!isValidOTP) {
        return createResponse({
          success: false,
          message: "Invalid verification code",
        });
      }

      const emailValidation = await this._validateEmailAvailabilityForUser(
        email,
        id
      );
      if (emailValidation) {
        return createResponse({
          success: false,
          message: emailValidation,
        });
      }

      const updatedUser = await this.userRepository.updateUserProfile(id, {
        email,
        isVerified: true,
      });

      if (!updatedUser) {
        return createResponse({
          success: false,
          message: "Failed to update email",
        });
      }

      const emailSent =
        await this.emailService.sendEmailChangeSuccessNotification(
          updatedUser.email,
          otpRecord.userData?.oldEmail || "Unknown"
        );

      if (!emailSent) {
        return createResponse({
          success: false,
          message: "Failed to send Success email",
        });
      }

      await this.otpRepository.markAsUsed(otpRecord._id as string);
      await this.otpRepository.deleteByEmail(email, "email_change");

      return createResponse({
        success: true,
        message: "Email changed successfully",
        data: {
          email: updatedUser.email,
          oldEmail: otpRecord.userData?.oldEmail,
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async getUserCounts(): Promise<ApiResponse<UserCountsResponseDto>> {
    try {
      const [activeUsers, inactiveUsers, verifiedUsers, unverifiedUsers] =
        await Promise.all([
          this.userRepository
            .findUsersByStatus("active", 1, 1)
            .then((result) => result.total),
          this.userRepository
            .findUsersByStatus("inactive", 1, 1)
            .then((result) => result.total),
          this.userRepository
            .findUsersByVerification(true, 1, 1)
            .then((result) => result.total),
          this.userRepository
            .findUsersByVerification(false, 1, 1)
            .then((result) => result.total),
        ]);

      return createResponse({
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
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async getUsers(filters: any): Promise<ApiResponse<GetUsersResponseDto>> {
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
        result = await this.userRepository.findUsersByStatus(
          status,
          Number(page),
          Number(limit)
        );
      } else {
        result = await this.userRepository.findAllUsers(
          Number(page),
          Number(limit)
        );
      }

      if (search) {
        result.users = this._filterUsersBySearch(result.users, search);
      }

      if (isVerified !== undefined) {
        result.users = result.users.filter(
          (user: any) => user.isVerified === isVerified
        );
      }

      if (sortBy) {
        result.users = this._sortUsers(result.users, sortBy, sortOrder);
      }

      result.users = this._processUserProfilePictures(result.users);
const userDtos = result.users.map((user: any) => UserMapper.toDto(user));

      return createResponse({
        success: true,
        message: "Users fetched successfully",
        data: {
          users: userDtos,
          meta: {
            pagination: {
              currentPage: Number(page),
              totalPages: Math.ceil(result.total / Number(limit)),
              total: result.total,
              limit: Number(limit),
            },
          },
        },
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async toggleUserStatus(
    userId: string
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      if (!userId) {
        return createResponse({
          success: false,
          message: "User ID is required",
        });
      }

      const updatedUser = await this.userRepository.toggleUserStatus(userId);

      if (!updatedUser) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }

      return createResponse({
        success: true,
        message: `User ${
          updatedUser.isActive ? "activated" : "deactivated"
        } successfully`,
        data: updatedUser,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  async getUserDetails(userId: string): Promise<ApiResponse<UserResponseDto>> {
    try {
      if (!userId) {
        return createResponse({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await this.userRepository.findUserById(userId);

      if (!user) {
        return createResponse({
          success: false,
          message: "User not found",
        });
      }
      const userDto = UserMapper.toDto(user);
      return createResponse({
        success: true,
        message: "User details fetched successfully",
        data: userDto,
      });
    } catch (error: unknown) {
      return this._handleServiceError(error, "Something went wrong");
    }
  }

  private _generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async _validateSignupData(
    email: string,
    username: string
  ): Promise<string | null> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser && existingUser.isVerified) {
      return "User with this email already exists";
    }

    const isOwner = await this.ownerRequestRepository.findByEmail(email);
    if (isOwner) {
      return "User with this email already exists";
    }

    const isRequestedOwner = await this.ownerRepository.findByEmail(email);
    if (isRequestedOwner) {
      return "User with this email already exists";
    }

    const existingUsername = await this.userRepository.findUserByUsername(
      username
    );
    if (existingUsername && existingUsername.isVerified) {
      return "Username already taken";
    }

    return null;
  }

  private async _validateEmailAvailability(
    email: string
  ): Promise<string | null> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      return "Email already in use";
    }

    const isRequestedOwner = await this.ownerRequestRepository.findByEmail(
      email
    );
    if (
      isRequestedOwner &&
      isRequestedOwner.status !== "rejected" &&
      isRequestedOwner.status !== "approved"
    ) {
      return "Email already in use";
    }

    const existingOwner = await this.ownerRepository.findByEmail(email);
    if (existingOwner) {
      return "Email already in use";
    }

    return null;
  }

  private async _validateEmailAvailabilityForUser(
    email: string,
    userId: string
  ): Promise<string | null> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser && existingUser._id.toString() !== userId) {
      return "Email already in use";
    }

    const isRequestedOwner = await this.ownerRequestRepository.findByEmail(
      email
    );
    if (
      isRequestedOwner &&
      isRequestedOwner.status !== "rejected" &&
      isRequestedOwner.status !== "approved"
    ) {
      return "Email already in use";
    }

    const existingOwner = await this.ownerRequestRepository.findByEmail(email);
    if (existingOwner) {
      return "Email already in use";
    }

    return null;
  }

  private _filterUsersBySearch(users: any[], search: string): any[] {
    return users.filter(
      (user: any) =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.firstName &&
          user.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (user.lastName &&
          user.lastName.toLowerCase().includes(search.toLowerCase()))
    );
  }

  private _sortUsers(users: any[], sortBy: string, sortOrder: string): any[] {
    return users.sort((a: any, b: any) => {
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

  private _processUserProfilePictures(users: any[]): any[] {
    return users.map((user) => {
      return {
        ...user,
        profilePicture: user.profilePicture
          ? generateSignedUrl(user.profilePicture, {
              width: 800,
              height: 600,
              crop: "fit",
            })
          : null,
      };
    });
  }

  private _handleServiceError(
    error: unknown,
    defaultMessage: string
  ): ApiResponse<any> {
    console.error("Service error:", error);
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;

    return createResponse({
      success: false,
      message: errorMessage,
    });
  }
}
