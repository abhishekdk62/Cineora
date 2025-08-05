import { Types } from "mongoose";
import * as bcrypt from "bcryptjs";
import { OwnerRequestRepository } from "../repositories/ownerRequest.repository";
import { OwnerRepository } from "../repositories/owner.repository";
import { EmailService } from "../../../services/email.service";
import {
  IOwnerService,
  OwnerKYCData,
  ServiceResponse,
} from "../interfaces/owner.interface";
import { OTPRepository } from "../../otp/repositories/otp.repository";
import { UserRepository } from "../../user/repositories/user.repository";

export class OwnerService implements IOwnerService {
  private ownerRequestRepo = new OwnerRequestRepository();
  private ownerRepo = new OwnerRepository();
  private otpRepo = new OTPRepository();
  private userRepo = new UserRepository();
  private emailService = new EmailService();

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async sendOTP(email: string): Promise<ServiceResponse> {
    try {
      const existingUser = await this.userRepo.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: "This email is already registered.",
        };
      }

      const existingRequest = await this.ownerRequestRepo.findByEmail(email);
      if (existingRequest && existingRequest.status !== "rejected") {
        return {
          success: false,
          message: "Email already in use",
        };
      }

      const existingOwner = await this.ownerRepo.findByEmail(email);
      if (existingOwner) {
        return {
          success: false,
          message: "Email already in use",
        };
      }

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await this.otpRepo.create({
        email,
        otp,
        type: "owner_verification",
        expiresAt,
        isUsed: false,
      });

      const emailSent = await this.emailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        return {
          success: false,
          message: "Failed to send verification email. Please try again.",
        };
      }

      return {
        success: true,
        message: "OTP sent successfully to your email address",
      };
    } catch (error) {
      console.error("Send OTP error:", error);
      return {
        success: false,
        message: "Something went wrong while sending OTP",
      };
    }
  }

  async verifyOTP(email: string, otp: string): Promise<ServiceResponse> {
    try {
      const validOTP = await this.otpRepo.findValidOTP(
        email,
        otp,
        "owner_verification"
      );

      if (!validOTP) {
        return {
          success: false,
          message: "Invalid or expired OTP",
        };
      }

      await this.otpRepo.markAsUsed(validOTP._id as string);

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return {
        success: false,
        message: "Something went wrong during OTP verification",
      };
    }
  }

  async submitKYC(ownerData: OwnerKYCData): Promise<ServiceResponse> {
    try {
      const existingRequest = await this.ownerRequestRepo.findExistingNonRejected({
        phone: ownerData.phone,
        email: ownerData.email,
        aadhaar: ownerData.aadhaar,
        pan: ownerData.pan
      });

      if (existingRequest) {
        if (existingRequest.phone === ownerData.phone) {
          return { success: false, message: "A pending/approved request with this phone number already exists" };
        }
        if (existingRequest.email === ownerData.email) {
          return { success: false, message: "A pending/approved request with this email address already exists" };
        }
        if (existingRequest.aadhaar === ownerData.aadhaar) {
          return { success: false, message: "A pending/approved request with this Aadhaar number already exists" };
        }
        if (existingRequest.pan === ownerData.pan) {
          return { success: false, message: "A pending/approved request with this PAN number already exists" };
        }
      }

      const existingOwner = await this.ownerRepo.findByEmail(ownerData.email);
      if (existingOwner) {
        return { success: false, message: "An owner with this email already exists" };
      }

      const ownerRequest = await this.ownerRequestRepo.create({
        ...ownerData,
        status: "pending",
        submittedAt: new Date(),
        emailVerified: true,
      });

      await this.emailService.sendKYCSubmittedEmail(
        ownerData.email,
        ownerData.ownerName,
        ownerRequest._id
      );

      return {
        success: true,
        message: "KYC request submitted successfully",
        data: {
          requestId: ownerRequest._id,
          status: ownerRequest.status,
          submittedAt: ownerRequest.submittedAt,
        },
      };
    } catch (error) {
      console.error("Submit KYC error:", error);
      return {
        success: false,
        message: "Something went wrong during KYC submission",
      };
    }
  }

  async updateRequestStatus(
    requestId: string,
    status: string,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<ServiceResponse> {
    try {
      const validStatuses = ["pending", "under_review", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Invalid status",
        };
      }

      const kycRequest = await this.ownerRequestRepo.findById(requestId);
      if (!kycRequest) {
        return {
          success: false,
          message: "Request not found",
        };
      }

      // If approving, create Owner account
      if (status === "approved") {
        const existingOwner = await this.ownerRepo.findByKycRequestId(requestId);
        if (existingOwner) {
          return {
            success: false,
            message: "Owner account already exists for this request",
          };
        }

        // ✅ Generate random 8-character password instead of "owner123"
        const randomPassword = this.generateRandomPassword();
        const hashedPassword = await this.hashPassword(randomPassword);

        // Create owner account
        const newOwner = await this.ownerRepo.create({
          ownerName: kycRequest.ownerName,
          phone: kycRequest.phone,
          email: kycRequest.email,
          password: hashedPassword,
          aadhaar: kycRequest.aadhaar,
          pan: kycRequest.pan,
          accountHolder: kycRequest.accountHolder,
          bankName: kycRequest.bankName,
          accountNumber: kycRequest.accountNumber,
          ifsc: kycRequest.ifsc,
          aadhaarUrl: kycRequest.aadhaarUrl,
          panUrl: kycRequest.panUrl,
          ownerPhotoUrl: kycRequest.ownerPhotoUrl,
          
          // Approval metadata
          kycRequestId: new Types.ObjectId(requestId),
          approvedAt: new Date(),
          approvedBy: reviewedBy || "system",
          
          // Default values
          isActive: true,
          isVerified: true,
          theatres: [],
        });

        // ✅ Send welcome email with random password
        await this.emailService.sendOwnerWelcomeEmail(
          kycRequest.email,
          kycRequest.ownerName,
          randomPassword // Send the original random password
        );

        console.log("✅ Owner account created:", newOwner._id);
      }

      // ✅ If rejecting, send rejection email
      if (status === "rejected") {
        await this.emailService.sendKYCRejectedEmail(
          kycRequest.email,
          kycRequest.ownerName,
          rejectionReason || "Your application did not meet our requirements."
        );
      }

      // Update the KYC request status
      const updatedRequest = await this.ownerRequestRepo.updateStatus(
        requestId,
        status,
        reviewedBy,
        rejectionReason
      );

      return {
        success: true,
        message: status === "approved"
          ? "Request approved and owner account created successfully"
          : status === "rejected"
          ? "Request rejected and notification sent"
          : "Request status updated successfully",
        data: updatedRequest,
      };
    } catch (error) {
      console.error("Update request status error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getRequestStatus(requestId: string): Promise<ServiceResponse> {
    try {
      const request = await this.ownerRequestRepo.findById(requestId);

      if (!request) {
        return {
          success: false,
          message: "Request not found",
        };
      }

      return {
        success: true,
        message: "Request status fetched successfully",
        data: request,
      };
    } catch (error) {
      console.error("Get request status error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getAllRequests(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ServiceResponse> {
    try {
      let result;

      if (status) {
        result = await this.ownerRequestRepo.findByStatus(status, page, limit);
      } else {
        result = await this.ownerRequestRepo.findAll(page, limit);
      }

      return {
        success: true,
        message: "Requests fetched successfully",
        data: {
          requests: result.requests,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalRequests: result.total,
            limit,
          },
        },
      };
    } catch (error) {
      console.error("Get all requests error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async getOwnerProfile(requestId: string): Promise<ServiceResponse> {
    try {
      const owner = await this.ownerRepo.findByKycRequestId(requestId);

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
}
