import * as bcrypt from "bcryptjs";
import { IEmailService } from "../../../services/email.service";
import { config } from "../../../config";
import { IUserRepository } from "../../user/interfaces/user.repository.interface";
import { IOwnerService } from "../interfaces/owner.services.interfaces";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
} from "../interfaces/owner.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import { OwnerFilterDto, UpdateOwnerProfileDto } from "../dtos/owner.dtos";
import { IOTPRepository } from "../../otp/interfaces/otp.repository.interface";
import { IOwner } from "../interfaces/owner.model.interface";
import { OwnerMapper } from "../../../mappers/owner.mapper";

export class OwnerService implements IOwnerService {
  constructor(
    private readonly emailService: IEmailService,
    private readonly ownerRepository: IOwnerRepository,
    private readonly ownerRequestRepository: IOwnerRequestRepository,
    private readonly otpRepository: IOTPRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getOwnerProfile(requestId: string): Promise<ServiceResponse> {
    try {
      this.validateId(requestId);

      const owner = await this.ownerRepository.findById(requestId);

      if (!owner) {
        return {
          success: false,
          message: "Owner account not found",
        };
      }

      const profileData = this._transformOwnerProfileData(owner);
      
      const ownerDto = OwnerMapper.toDto(profileData);
      console.log(ownerDto);
      
      
      return {
        success: true,
        message: "Owner account fetched successfully",
        data: ownerDto,
      };
    } catch (error) {
      console.error("Get owner account error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getOwnerById(ownerId: string): Promise<ServiceResponse> {
    try {
      this.validateId(ownerId);

      const owner = await this.ownerRepository.findById(ownerId);

      if (!owner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }
      const ownerDto = OwnerMapper.toDto(owner);

      return {
        success: true,
        message: "Owner fetched successfully",
        data: ownerDto,
      };
    } catch (error) {
      console.error("Get owner by ID error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getOwnerCounts(): Promise<ServiceResponse> {
    try {
      const counts = await this.fetchOwnerCounts();

      return {
        success: true,
        message: "Owner counts fetched successfully",
        data: {
          counts,
        },
      };
    } catch (error) {
      console.error("Get owner counts error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getOwners(filters: OwnerFilterDto): Promise<ServiceResponse> {
    try {
      this.validateOwnerFilters(filters);

      const { page = 1, limit = 10 } = filters;
      let result = await this._fetchOwnersWithFilters(filters);

      result = this._applyClientSideFilters(result, filters);
      result = this._applySorting(result, filters);
      result = this._transformOwnersData(result);

      const ownerDtos = result.owners.map((owner) => OwnerMapper.toDto(owner));

      return {
        success: true,
        message: "Owners fetched successfully",
        data: {
          owners: ownerDtos,
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
      console.error("Get owners error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async toggleOwnerStatus(ownerId: string): Promise<ServiceResponse> {
    try {
      this.validateId(ownerId);

      const updatedOwner = await this.ownerRepository.toggleStatus(ownerId);

      if (!updatedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: `Owner ${
          updatedOwner.isActive ? "activated" : "blocked"
        } successfully`,
        data: updatedOwner,
      };
    } catch (error) {
      console.error("Toggle owner status error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async updateOwner(
    ownerId: string,
    updateData: UpdateOwnerProfileDto
  ): Promise<ServiceResponse> {
    try {
      this.validateId(ownerId);
      this.validateUpdateData(updateData);

      const updatedOwner = await this.ownerRepository.update(
        ownerId,
        updateData
      );

      if (!updatedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }
      const ownerDto = OwnerMapper.toDto(updatedOwner);
      return {
        success: true,
        message: "Owner updated successfully",
        data: ownerDto,
      };
    } catch (error) {
      console.error("Update owner error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async deleteOwner(ownerId: string): Promise<ServiceResponse> {
    try {
      this.validateId(ownerId);

      const deletedOwner = await this.ownerRepository.delete(ownerId);

      if (!deletedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner deleted successfully",
      };
    } catch (error) {
      console.error("Delete owner error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async sendEmailChangeOtp(
    ownerId: string,
    newEmail: string,
    password: string
  ): Promise<ServiceResponse> {
    try {
      this.validateId(ownerId);
      this.validateEmailChangeData({ newEmail, password });

      const owner = await this.ownerRepository.findById(ownerId);
      if (!owner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      const isPasswordValid = await this.verifyOwnerPassword(owner, password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      const emailValidation = await this.validateEmailAvailability(
        newEmail,
        ownerId,
        owner.email
      );
      if (!emailValidation.isValid) {
        return {
          success: false,
          message: emailValidation.message,
        };
      }

      const otpResult = await this._generateAndSendEmailChangeOtp(
        newEmail,
        owner
      );

      return otpResult;
    } catch (error) {
      console.error("Send email change OTP error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async verifyEmailChangeOtp(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse> {
    try {
      this.validateId(id);
      this.validateEmailOtpData({ email, otp });

      const otpRecord = await this.otpRepository.findValidOTP(
        email,
        otp,
        "owner_email_change"
      );

      if (!otpRecord || otpRecord.userData?.id !== id) {
        return {
          success: false,
          message: "Invalid or expired OTP",
        };
      }

      const emailValidation = await this.validateEmailAvailability(email, id);
      if (!emailValidation.isValid) {
        return {
          success: false,
          message: emailValidation.message,
        };
      }

      const updatedOwner = await this.ownerRepository.updateProfile(id, {
        email,
      });

      if (!updatedOwner) {
        return {
          success: false,
          message: "Email update failed",
        };
      }

      const emailSent =
        await this.emailService.sendEmailChangeSuccessNotification(
          updatedOwner.email,
          otpRecord.userData?.oldEmail || "Unknown"
        );

      if (!emailSent) {
        return { success: false, message: "Failed to send success email" };
      }

      await this._cleanupOtpRecords(otpRecord._id as string, email);

      return {
        success: true,
        message: "Email changed successfully",
        data: {
          email: updatedOwner.email,
          oldEmail: otpRecord.userData?.oldEmail,
        },
      };
    } catch (error) {
      console.error("Verify email change OTP error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async changeOwnerPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse> {
    try {
      this.validateId(userId);
      this.validatePasswordChangeData({ oldPassword, newPassword });

      const owner = await this.ownerRepository.findById(userId);
      if (!owner) {
        return { success: false, message: "User not found" };
      }

      const isOldPasswordValid = await this.verifyOwnerPassword(
        owner,
        oldPassword
      );
      if (!isOldPasswordValid) {
        return { success: false, message: "Old password is incorrect" };
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      const updated = await this.ownerRepository.updatePassword(
        userId,
        hashedNewPassword
      );

      if (!updated) {
        return { success: false, message: "Failed to update password" };
      }

      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim() === "") {
      throw new Error("Valid ID is required");
    }
  }

  private validateOwnerFilters(filters: OwnerFilterDto): void {
    if (!filters) {
      throw new Error("Filters are required");
    }
  }

  private validateUpdateData(updateData: UpdateOwnerProfileDto): void {
    if (!updateData || Object.keys(updateData).length === 0) {
      throw new Error("Update data cannot be empty");
    }
  }

  private validateEmailChangeData(data: {
    newEmail: string;
    password: string;
  }): void {
    if (!data.newEmail || !data.password) {
      throw new Error("New email and password are required");
    }
    if (!this.isValidEmail(data.newEmail)) {
      throw new Error("Invalid email format");
    }
  }

  private validateEmailOtpData(data: { email: string; otp: string }): void {
    if (!data.email || !data.otp) {
      throw new Error("Email and OTP are required");
    }
  }

  private validatePasswordChangeData(data: {
    oldPassword: string;
    newPassword: string;
  }): void {
    if (!data.oldPassword || !data.newPassword) {
      throw new Error("Old password and new password are required");
    }
    if (data.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters long");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async verifyOwnerPassword(
    owner: IOwner,
    password: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, owner.password);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, config.bcryptRounds);
  }

  private async validateEmailAvailability(
    email: string,
    ownerId?: string,
    currentEmail?: string
  ): Promise<{ isValid: boolean; message?: string }> {
    if (currentEmail && email === currentEmail) {
      return {
        isValid: false,
        message: "New email cannot be the same as current email",
      };
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return { isValid: false, message: "Email already in use" };
    }

    const existingOwner = await this.ownerRepository.findByEmail(email);
    if (existingOwner && existingOwner._id.toString() !== ownerId) {
      return { isValid: false, message: "Email already in use" };
    }

    const existingOwnerRequest = await this.ownerRequestRepository.findByEmail(
      email
    );
    if (
      existingOwnerRequest &&
      !["rejected", "approved"].includes(existingOwnerRequest.status)
    ) {
      return { isValid: false, message: "Email already in use" };
    }

    return { isValid: true };
  }

  private async fetchOwnerCounts(): Promise<Record<string, number>> {
    const [
      activeOwners,
      inactiveOwners,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    ] = await Promise.all([
      this.ownerRepository
        .findByStatus("active", 1, 1)
        .then((result) => result.total),
      this.ownerRepository
        .findByStatus("inactive", 1, 1)
        .then((result) => result.total),
      this.ownerRequestRepository
        .findByStatus("pending", 1, 1)
        .then((result) => result.total),
      this.ownerRequestRepository
        .findByStatus("approved", 1, 1)
        .then((result) => result.total),
      this.ownerRequestRepository
        .findByStatus("rejected", 1, 1)
        .then((result) => result.total),
    ]);

    return {
      activeOwners,
      inactiveOwners,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    };
  }

  private async _fetchOwnersWithFilters(
    filters: OwnerFilterDto
  ): Promise<{ owners: IOwner[]; total: number }> {
    const { status, page = 1, limit = 10 } = filters;

    if (status) {
      return await this.ownerRepository.findByStatus(
        status,
        Number(page),
        Number(limit)
      );
    } else {
      return await this.ownerRepository.findAll(Number(page), Number(limit));
    }
  }

  private _applyClientSideFilters(
    result: { owners: IOwner[]; total: number },
    filters: OwnerFilterDto
  ): { owners: IOwner[]; total: number } {
    const { search } = filters;

    if (search) {
      result.owners = result.owners.filter(
        (owner: IOwner) =>
          owner.ownerName.toLowerCase().includes(search.toLowerCase()) ||
          owner.email.toLowerCase().includes(search.toLowerCase()) ||
          owner.phone.includes(search)
      );
    }

    return result;
  }

  private _applySorting(
    result: { owners: IOwner[]; total: number },
    filters: OwnerFilterDto
  ): { owners: IOwner[]; total: number } {
    const { sortBy, sortOrder } = filters;

    if (sortBy) {
      result.owners.sort((a: IOwner, b: IOwner) => {
        let aValue = (a as string)[sortBy];
        let bValue = (b as string)[sortBy];

        if (sortBy.includes("Date") || sortBy.includes("At")) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return result;
  }

  private _transformOwnerProfileData(owner: IOwner): IOwner {
    return {
      ...owner,
    };
  }

  private _transformOwnersData(result: { owners: IOwner[]; total: number }): {
    owners: IOwner[];
    total: number;
  } {
    return result;
  }

  private async _generateAndSendEmailChangeOtp(
    newEmail: string,
    owner: IOwner
  ): Promise<ServiceResponse> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepository.create({
      email: newEmail,
      otp,
      expiresAt,
      type: "owner_email_change",
      userData: {
        id: owner._id.toString(),
        oldEmail: owner.email,
      },
    });

    const emailSent = await this.emailService.sendEmailChangeOTP(
      newEmail,
      otp,
      owner.ownerName || "Owner"
    );

    if (!emailSent) {
      return {
        success: false,
        message: "Failed to send OTP email",
      };
    }

    return {
      success: true,
      message: "OTP sent successfully to your new email",
      data: {
        email: newEmail,
        expiresIn: "5 minutes",
      },
    };
  }

  private async _cleanupOtpRecords(
    otpId: string,
    email: string
  ): Promise<void> {
    await this.otpRepository.markAsUsed(otpId);
    await this.otpRepository.deleteByEmail(email, "owner_email_change");
  }
}
