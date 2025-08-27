import { Types } from "mongoose";
import * as bcrypt from "bcryptjs";

import { IOwnerRequestService } from "../interfaces/owner.services.interfaces";
import {
  IOwnerRepository,
  IOwnerRequestRepository,
} from "../interfaces/owner.repository.interface";
import { IUserRepository } from "../../user/interfaces/user.repository.interface";
import { ServiceResponse } from "../../../interfaces/interface";
import {
  GenerateSignedUrlDto,
  GetOwnerRequestsFiltersDto,
  KYCSubmissionResponseDataDto,
  OwnerKYCDataDto,
  UploadFileDto,
  UploadMultipleFilesDto,
} from "../dtos/ownerReq.dtos";
import { IOwnerRequest } from "../interfaces/owner.model.interface";
import { IOTPRepository } from "../../otp/interfaces/otp.repository.interface";
import { OTPType } from "../../otp/interfaces/otp.model.interface";
import { IEmailService } from "../../../services/email.service";
import {
  generateSignedUrl,
  uploadMultipleToCloudinary,
  uploadToCloudinary,
} from "../../../utils/signCloudinaryUpload";

export class OwnerRequestService implements IOwnerRequestService {
  constructor(
    private readonly ownerRequestRepo: IOwnerRequestRepository,
    private readonly ownerRepo: IOwnerRepository,
    private readonly otpRepo: IOTPRepository,
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRandomPassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
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
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.otpRepo.create({
        email,
        otp,
        type: "owner_verification" as OTPType,
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
      console.log('valid not at bait');

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

  async submitKYC(
    ownerData: OwnerKYCDataDto
  ): Promise<ServiceResponse<KYCSubmissionResponseDataDto>> {
    try {
      const existingRequest =
        await this.ownerRequestRepo.findExistingNonRejected({
          phone: ownerData.phone,
          email: ownerData.email,
          aadhaar: ownerData.aadhaar,
          pan: ownerData.pan,
        });

      if (existingRequest) {
        if (existingRequest.phone === ownerData.phone) {
          return {
            success: false,
            message:
              "A pending/approved request with this phone number already exists",
          };
        }
        if (existingRequest.email === ownerData.email) {
          return {
            success: false,
            message:
              "A pending/approved request with this email address already exists",
          };
        }
        if (existingRequest.aadhaar === ownerData.aadhaar) {
          return {
            success: false,
            message:
              "A pending/approved request with this Aadhaar number already exists",
          };
        }
        if (existingRequest.pan === ownerData.pan) {
          return {
            success: false,
            message:
              "A pending/approved request with this PAN number already exists",
          };
        }
      }

      const existingOwner = await this.ownerRepo.findByEmail(ownerData.email);
      if (existingOwner) {
        return {
          success: false,
          message: "An owner with this email already exists",
        };
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

      if (status === "approved") {
        const existingOwner = await this.ownerRepo.findByKycRequestId(
          requestId
        );
        if (existingOwner) {
          return {
            success: false,
            message: "Owner account already exists for this request",
          };
        }

        const randomPassword = this.generateRandomPassword();
        const hashedPassword = await this.hashPassword(randomPassword);

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
          kycRequestId: new Types.ObjectId(requestId),
          approvedAt: new Date(),
          approvedBy: reviewedBy || "system",
          isActive: true,
          isVerified: true,
          theatres: [],
        });
console.log('the password for the new owner is :',randomPassword);

        await this.emailService.sendOwnerWelcomeEmail(
          kycRequest.email,
          kycRequest.ownerName,
          randomPassword
        );
      }

      if (status === "rejected") {
        await this.emailService.sendKYCRejectedEmail(
          kycRequest.email,
          kycRequest.ownerName,
          rejectionReason || "Your application did not meet our requirements."
        );
      }

      const updatedRequest = await this.ownerRequestRepo.updateStatus(
        requestId,
        status,
        reviewedBy,
        rejectionReason
      );

      return {
        success: true,
        message:
          status === "approved"
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

  async getRequestStatus(
    requestId: string
  ): Promise<ServiceResponse<IOwnerRequest>> {
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

  async getOwnerRequests(
    filters: GetOwnerRequestsFiltersDto
  ): Promise<ServiceResponse> {
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
        result = await this.ownerRequestRepo.findByStatus(
          status,
          Number(page),
          Number(limit)
        );
      } else {
        result = await this.ownerRequestRepo.findAll(
          Number(page),
          Number(limit)
        );
      }

      if (search) {
        result.requests = result.requests.filter(
          (request: IOwnerRequest) =>
            request.ownerName.toLowerCase().includes(search.toLowerCase()) ||
            request.email.toLowerCase().includes(search.toLowerCase()) ||
            request.phone.includes(search)
        );
      }

      if (sortBy) {
        result.requests.sort((a: any, b: any) => {
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

      result.requests = result.requests.map((request) => {
        return {
          ...request,
          aadhaarUrl: request.aadhaarUrl
            ? generateSignedUrl(request.aadhaarUrl, {
                width: 800,
                height: 600,
                crop: "fit",
              })
            : null,
          ownerPhotoUrl: request.ownerPhotoUrl
            ? generateSignedUrl(request.ownerPhotoUrl, {
                width: 800,
                height: 600,
                crop: "fit",
              })
            : null,

          panUrl: request.panUrl
            ? generateSignedUrl(request.panUrl, {
                width: 800,
                height: 600,
                crop: "fit",
              })
            : null,

          profilePictureUrl: request.ownerPhotoUrl
            ? generateSignedUrl(request.ownerPhotoUrl, {
                width: 400,
                height: 400,
                crop: "fill",
              })
            : null,
        };
      });
      

      return {
        success: true,
        message: "Owner requests fetched successfully",
        data: {
          requests: result.requests,
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
      console.error("Get owner requests error:", error);
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<ServiceResponse> {
    try {
      const { file, folder } = uploadFileDto;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return {
          success: false,
          message:
            "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
        };
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          success: false,
          message: "File size too large. Maximum 5MB allowed.",
        };
      }
      const options = {
        folder: folder,
        resource_type: file.mimetype.startsWith("image/")
          ? ("image" as const)
          : ("raw" as const),
      };

      const result = await uploadToCloudinary(file, options);

      return {
        success: true,
        message: "File uploaded successfully",
        data: {
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "File upload failed",
      };
    }
  }

  async uploadMultipleFiles(
    uploadMultipleDto: UploadMultipleFilesDto
  ): Promise<ServiceResponse> {
    try {
      const { files, folder } = uploadMultipleDto;

      // Validate each file
      for (const file of files) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return {
            success: false,
            message: `Invalid file type for ${file.originalname}. Only JPEG, PNG, and PDF files are allowed.`,
          };
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          return {
            success: false,
            message: `File ${file.originalname} is too large. Maximum 5MB allowed.`,
          };
        }
      }

      const options = {
        folder: folder || "uploads",
      };

      const results = await uploadMultipleToCloudinary(files, options);

      return {
        success: true,
        message: `Successfully uploaded ${results.length} files`,
        data: results.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Multiple file upload failed",
      };
    }
  }

  async generateSignedUrl(
    signedUrlDto: GenerateSignedUrlDto
  ): Promise<ServiceResponse> {
    try {
      const { publicId, width, height, crop } = signedUrlDto;

      const options = {
        width,
        height,
        crop,
      };

      const signedUrl = generateSignedUrl(publicId, options);

      if (!signedUrl) {
        return {
          success: false,
          message: "Failed to generate signed URL",
        };
      }

      return {
        success: true,
        message: "Signed URL generated successfully",
        data: {
          signedUrl,
          publicId,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to generate signed URL",
      };
    }
  }
}
