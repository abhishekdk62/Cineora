import * as bcrypt from "bcryptjs";
import { EmailService } from "../../../services/email.service";
import { IOTPRepository } from "../../otp/interfaces/otp.interface";
import { IUserRepository } from "../../user/interfaces/user.interface";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
  ServiceResponse,
} from "../interfaces/owner.interface";
import { config } from "../../../config";

const emailService = new EmailService();

export class OwnerService {
  constructor(
    private ownerRepo: IOwnerRepository,
    private ownerRequestRepo: IOwnerRequestRepository,
    private otpRepo: IOTPRepository,
    private userRepo: IUserRepository
  ) {}

  async getOwnerProfile(requestId: string): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findById(requestId);

      if (!owner) {
        return {
          success: false,
          message: "Owner account not found",
        };
      }

      return {
        success: true,
        message: "Owner account fetched successfully",
        data: owner,
      };
    } catch (error) {
      console.error("Get owner account error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwnerById(ownerId: string): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findById(ownerId);

      if (!owner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner fetched successfully",
        data: owner,
      };
    } catch (error) {
      console.error("Get owner by ID error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwnerCounts(): Promise<ServiceResponse> {
    try {
      const [
        activeOwners,
        inactiveOwners,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      ] = await Promise.all([
        this.ownerRepo
          .findByStatus("active", 1, 1)
          .then((result) => result.total),
        this.ownerRepo
          .findByStatus("inactive", 1, 1)
          .then((result) => result.total),
        this.ownerRequestRepo
          .findByStatus("pending", 1, 1)
          .then((result) => result.total),
        this.ownerRequestRepo
          .findByStatus("approved", 1, 1)
          .then((result) => result.total),
        this.ownerRequestRepo
          .findByStatus("rejected", 1, 1)
          .then((result) => result.total),
      ]);

      return {
        success: true,
        message: "Owner counts fetched successfully",
        data: {
          counts: {
            activeOwners,
            inactiveOwners,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
          },
        },
      };
    } catch (error) {
      console.error("Get owner counts error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwners(filters: any): Promise<ServiceResponse> {
    try {
      const {
        search,
        status,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
      } = filters;

      let result;
      if (status) {
        result = await this.ownerRepo.findByStatus(
          status,
          Number(page),
          Number(limit)
        );
      } else {
        result = await this.ownerRepo.findAll(Number(page), Number(limit));
      }

      if (search) {
        result.owners = result.owners.filter(
          (owner: any) =>
            owner.ownerName.toLowerCase().includes(search.toLowerCase()) ||
            owner.email.toLowerCase().includes(search.toLowerCase()) ||
            owner.phone.includes(search)
        );
      }

      if (sortBy) {
        result.owners.sort((a: any, b: any) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];

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

      return {
        success: true,
        message: "Owners fetched successfully",
        data: {
          owners: result.owners,
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
        message: "Something went wrong",
      };
    }
  }

  async toggleOwnerStatus(ownerId: string): Promise<ServiceResponse> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      const updatedOwner = await this.ownerRepo.toggleStatus(ownerId);

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
        message: "Something went wrong",
      };
    }
  }

  async updateOwner(
    ownerId: string,
    updateData: any
  ): Promise<ServiceResponse> {
    try {
      const updatedOwner = await this.ownerRepo.update(ownerId, updateData);

      if (!updatedOwner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }

      return {
        success: true,
        message: "Owner updated successfully",
        data: updatedOwner,
      };
    } catch (error) {
      console.error("Update owner error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async deleteOwner(ownerId: string): Promise<ServiceResponse> {
    try {
      const deletedOwner = await this.ownerRepo.delete(ownerId);

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
        message: "Something went wrong",
      };
    }
  }

  async sendEmailChangeOtp(
    ownerId: string,
    newEmail: string,
    password: string
  ): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findById(ownerId);

      if (!owner) {
        return {
          success: false,
          message: "Owner not found",
        };
      }
      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      if (owner.email === newEmail) {
        return {
          success: false,
          message: "New email cannot be the same as current email",
        };
      }

      const existingUser = await this.userRepo.findByEmail(newEmail);
      if (existingUser) {
        return { success: false, message: "Email already in use" };
      }

      const existingOwner = await this.ownerRepo.findByEmail(newEmail);
      if (existingOwner && existingOwner._id.toString() !== ownerId) {
        return { success: false, message: "Email already in use" };
      }

      const existingOwnerRequest = await this.ownerRequestRepo.findByEmail(
        newEmail
      );
      if (
        existingOwnerRequest.status !== "rejected" &&
        existingOwnerRequest.status !== "approved"
      ) {
        return { success: false, message: "Email already in use" };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.otpRepo.create({
        email: newEmail,
        otp,
        expiresAt,
        type: "owner_email_change",
        userData: {
          id: ownerId,
          oldEmail: owner.email,
        },
      });

      const emailSent = await emailService.sendEmailChangeOTP(
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
    } catch (error) {
      console.error("Send email change OTP error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async verifyEmailChangeOtp(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse> {
    try {
      const otpRecord = await this.otpRepo.findValidOTP(
        email,
        otp,
        "owner_email_change"
      );

      if (!otpRecord) {
        return {
          success: false,
          message: "Invalid or expired OTP",
        };
      }

      if (otpRecord.userData?.id != id) {
        return {
          success: false,
          message: "Invalid OTP",
        };
      }

      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== id) {
        return { success: false, message: "Email already in use" };
      }

      const isRequestedOwner = await this.ownerRequestRepo.findByEmail(email);
      if (
        isRequestedOwner.status !== "rejected" &&
        isRequestedOwner.status !== "approved"
      ) {
        return { success: false, message: "Email already in use" };
      }

      const existingOwner = await this.ownerRepo.findByEmail(email);
      if (existingOwner && existingOwner._id.toString() !== id) {
        return { success: false, message: "Email already in use" };
      }

      const updatedOwner = await this.ownerRepo.updateProfile(id, { email });

      if (!updatedOwner) {
        return {
          success: false,
          message: "Email update failed",
        };
      }

      const emailSent = await emailService.sendEmailChangeSuccessNotification(
        updatedOwner.email,
        otpRecord.userData?.oldEmail || "Unknown"
      );

      if (!emailSent) {
        return { success: false, message: "Failed to send success email" };
      }

      await this.otpRepo.markAsUsed(otpRecord._id as string);
      await this.otpRepo.deleteByEmail(email, "owner_email_change");

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
        message: "Something went wrong",
      };
    }
  }
  async changeOwnerPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const owner = await this.ownerRepo.findById(userId);
      if (!owner) {
        return { success: false, message: "User not found" };
      }
      const isMatch = await bcrypt.compare(oldPassword, owner.password);
      if (!isMatch) {
        return { success: false, message: "Old password is incorrect" };
      }
      const hash = await bcrypt.hash(newPassword, config.bcryptRounds);
      const updated = await this.ownerRepo.updatePassword(userId, hash);
      if (!updated) {
        return { success: false, message: "Failed to update password" };
      }
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      return { success: false, message: "Something went wrong" };
    }
  }
}
