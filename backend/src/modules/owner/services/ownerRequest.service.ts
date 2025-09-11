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
    private readonly ownerRequestRepository: IOwnerRequestRepository,
    private readonly ownerRepository: IOwnerRepository,
    private readonly otpRepository: IOTPRepository,
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async sendOTP(email: string): Promise<ServiceResponse> {
    try {
      this._validateEmail(email);

      const emailAvailability = await this._checkEmailAvailability(email);
      if (!emailAvailability.isAvailable) {
        return {
          success: false,
          message: emailAvailability.message,
        };
      }

      const otp = this._generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await this.otpRepository.create({
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
        message: error instanceof Error ? error.message : "Something went wrong while sending OTP",
      };
    }
  }

  async verifyOTP(email: string, otp: string): Promise<ServiceResponse> {
    try {
      this._validateEmail(email);
      this._validateOTP(otp);

      const validOTP = await this.otpRepository.findValidOTP(
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

      await this.otpRepository.markAsUsed(validOTP._id as string);

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong during OTP verification",
      };
    }
  }

  async submitKYC(ownerData: OwnerKYCDataDto): Promise<ServiceResponse<KYCSubmissionResponseDataDto>> {
    try {
      this._validateKYCData(ownerData);

      const duplicateCheck = await this._checkForDuplicateRequests(ownerData);
      if (!duplicateCheck.isValid) {
        return {
          success: false,
          message: duplicateCheck.message,
        };
      }

      const existingOwner = await this.ownerRepository.findByEmail(ownerData.email);
      if (existingOwner) {
        return {
          success: false,
          message: "An owner with this email already exists",
        };
      }

      const ownerRequest = await this.ownerRequestRepository.create({
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
        message: error instanceof Error ? error.message : "Something went wrong during KYC submission",
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
      this._validateRequestId(requestId);
      this._validateStatus(status);

      const kycRequest = await this.ownerRequestRepository.findById(requestId);
      if (!kycRequest) {
        return {
          success: false,
          message: "Request not found",
        };
      }

      if (status === "approved") {
        const ownerCreationResult = await this._createOwnerFromRequest(kycRequest, reviewedBy);
        if (!ownerCreationResult.success) {
          return ownerCreationResult;
        }
      }

      if (status === "rejected") {
        await this.emailService.sendKYCRejectedEmail(
          kycRequest.email,
          kycRequest.ownerName,
          rejectionReason || "Your application did not meet our requirements."
        );
      }

      const updatedRequest = await this.ownerRequestRepository.updateStatus(
        requestId,
        status,
        reviewedBy,
        rejectionReason
      );

      return {
        success: true,
        message: this._getStatusUpdateMessage(status),
        data: updatedRequest,
      };
    } catch (error) {
      console.error("Update request status error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getRequestStatus(requestId: string): Promise<ServiceResponse<IOwnerRequest>> {
    try {
      this._validateRequestId(requestId);

      const request = await this.ownerRequestRepository.findById(requestId);

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
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getAllRequests(page: number = 1, limit: number = 10, status?: string): Promise<ServiceResponse> {
    try {
      this._validatePagination(page, limit);

      let result;
      if (status) {
        result = await this.ownerRequestRepository.findByStatus(status, page, limit);
      } else {
        result = await this.ownerRequestRepository.findAll(page, limit);
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
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async getOwnerRequests(filters: GetOwnerRequestsFiltersDto): Promise<ServiceResponse> {
    try {
      this._validateOwnerRequestFilters(filters);

      const { search, status, sortBy, sortOrder, page = 1, limit = 10 } = filters;

      let result = await this._fetchRequestsWithFilters(filters);
      result = this._applyClientSideFilters(result, filters);
      result = this._applySorting(result, filters);
      result = this._transformRequestsData(result);

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
        message: error instanceof Error ? error.message : "Something went wrong",
      };
    }
  }

  async uploadFile(uploadFileDto: UploadFileDto): Promise<ServiceResponse> {
    try {
      this._validateUploadFile(uploadFileDto);

      const { file, folder } = uploadFileDto;

      const validationResult = this._validateFileUpload(file);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const options = {
        folder: folder,
        resource_type: file.mimetype.startsWith("image/") ? ("image" as const) : ("raw" as const),
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
        message: error instanceof Error ? error.message : "File upload failed",
      };
    }
  }

  async uploadMultipleFiles(uploadMultipleDto: UploadMultipleFilesDto): Promise<ServiceResponse> {
    try {
      this._validateUploadMultipleFiles(uploadMultipleDto);

      const { files, folder } = uploadMultipleDto;

      for (const file of files) {
        const validationResult = this._validateFileUpload(file);
        if (!validationResult.isValid) {
          return {
            success: false,
            message: `${validationResult.message} for ${file.originalname}`,
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
        message: error instanceof Error ? error.message : "Multiple file upload failed",
      };
    }
  }

  async generateSignedUrl(signedUrlDto: GenerateSignedUrlDto): Promise<ServiceResponse> {
    try {
      this._validateSignedUrlData(signedUrlDto);

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
        message: error instanceof Error ? error.message : "Failed to generate signed URL",
      };
    }
  }

  private _generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private _generateRandomPassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private async _hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private _validateEmail(email: string): void {
    if (!email || !email.includes("@")) {
      throw new Error("Valid email is required");
    }
  }

  private _validateOTP(otp: string): void {
    if (!otp || otp.length !== 6) {
      throw new Error("Valid 6-digit OTP is required");
    }
  }

  private _validateKYCData(data: OwnerKYCDataDto): void {
    if (!data.ownerName || !data.email || !data.phone || !data.aadhaar || !data.pan) {
      throw new Error("All required KYC fields must be provided");
    }
  }

  private _validateRequestId(requestId: string): void {
    if (!requestId) {
      throw new Error("Request ID is required");
    }
  }

  private _validateStatus(status: string): void {
    const validStatuses = ["pending", "under_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }
  }

  private _validatePagination(page: number, limit: number): void {
    if (page < 1 || limit < 1) {
      throw new Error("Page and limit must be positive numbers");
    }
  }

  private _validateOwnerRequestFilters(filters: GetOwnerRequestsFiltersDto): void {
    if (!filters) {
      throw new Error("Filters are required");
    }
  }

  private _validateUploadFile(dto: UploadFileDto): void {
    if (!dto.file) {
      throw new Error("File is required");
    }
  }

  private _validateUploadMultipleFiles(dto: UploadMultipleFilesDto): void {
    if (!dto.files || dto.files.length === 0) {
      throw new Error("At least one file is required");
    }
  }

  private _validateSignedUrlData(dto: GenerateSignedUrlDto): void {
    if (!dto.publicId) {
      throw new Error("Public ID is required");
    }
  }

  private async _checkEmailAvailability(email: string): Promise<{ isAvailable: boolean; message?: string }> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      return { isAvailable: false, message: "This email is already registered." };
    }

    const existingRequest = await this.ownerRequestRepository.findByEmail(email);
    if (existingRequest && existingRequest.status !== "rejected") {
      return { isAvailable: false, message: "Email already in use" };
    }

    const existingOwner = await this.ownerRepository.findByEmail(email);
    if (existingOwner) {
      return { isAvailable: false, message: "Email already in use" };
    }

    return { isAvailable: true };
  }

  private async _checkForDuplicateRequests(ownerData: OwnerKYCDataDto): Promise<{ isValid: boolean; message?: string }> {
    const existingRequest = await this.ownerRequestRepository.findExistingNonRejected({
      phone: ownerData.phone,
      email: ownerData.email,
      aadhaar: ownerData.aadhaar,
      pan: ownerData.pan,
    });

    if (existingRequest) {
      if (existingRequest.phone === ownerData.phone) {
        return { isValid: false, message: "A pending/approved request with this phone number already exists" };
      }
      if (existingRequest.email === ownerData.email) {
        return { isValid: false, message: "A pending/approved request with this email address already exists" };
      }
      if (existingRequest.aadhaar === ownerData.aadhaar) {
        return { isValid: false, message: "A pending/approved request with this Aadhaar number already exists" };
      }
      if (existingRequest.pan === ownerData.pan) {
        return { isValid: false, message: "A pending/approved request with this PAN number already exists" };
      }
    }

    return { isValid: true };
  }

  private async _createOwnerFromRequest(kycRequest: IOwnerRequest, reviewedBy?: string): Promise<ServiceResponse> {
    try {
      const existingOwner = await this.ownerRepository.findByKycRequestId(kycRequest._id as string);
      if (existingOwner) {
        return {
          success: false,
          message: "Owner account already exists for this request",
        };
      }

      const randomPassword = this._generateRandomPassword();
      const hashedPassword = await this._hashPassword(randomPassword);

      await this.ownerRepository.create({
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
        kycRequestId: new Types.ObjectId(kycRequest._id as string),
        approvedAt: new Date(),
        approvedBy: reviewedBy || "system",
        isActive: true,
        isVerified: true,
        theatres: [],
      });

      console.log('The password for the new owner is:', randomPassword);

      await this.emailService.sendOwnerWelcomeEmail(
        kycRequest.email,
        kycRequest.ownerName,
        randomPassword
      );

      return { success: true, message: "Owner created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create owner account",
      };
    }
  }

  private _getStatusUpdateMessage(status: string): string {
    switch (status) {
      case "approved":
        return "Request approved and owner account created successfully";
      case "rejected":
        return "Request rejected and notification sent";
      default:
        return "Request status updated successfully";
    }
  }

  private _validateFileUpload(file: any): { isValid: boolean; message?: string } {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        message: "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
      };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: "File size too large. Maximum 5MB allowed.",
      };
    }

    return { isValid: true };
  }

  private async _fetchRequestsWithFilters(filters: GetOwnerRequestsFiltersDto): Promise<{ requests: IOwnerRequest[]; total: number }> {
    const { status, page = 1, limit = 10 } = filters;

    if (status) {
      return await this.ownerRequestRepository.findByStatus(status, Number(page), Number(limit));
    } else {
      return await this.ownerRequestRepository.findAll(Number(page), Number(limit));
    }
  }

  private _applyClientSideFilters(result: { requests: IOwnerRequest[]; total: number }, filters: GetOwnerRequestsFiltersDto): { requests: IOwnerRequest[]; total: number } {
    const { search } = filters;

    if (search) {
      result.requests = result.requests.filter(
        (request: IOwnerRequest) =>
          request.ownerName.toLowerCase().includes(search.toLowerCase()) ||
          request.email.toLowerCase().includes(search.toLowerCase()) ||
          request.phone.includes(search)
      );
    }

    return result;
  }

  private _applySorting(result: { requests: IOwnerRequest[]; total: number }, filters: GetOwnerRequestsFiltersDto): { requests: IOwnerRequest[]; total: number } {
    const { sortBy, sortOrder } = filters;

    if (sortBy) {
      result.requests.sort((a: IOwnerRequest, b: IOwnerRequest) => {
        let aValue = (a as any)[sortBy];
        let bValue = (b as any)[sortBy];

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

  private _transformRequestsData(result: { requests: IOwnerRequest[]; total: number }): { requests: IOwnerRequest[]; total: number } {
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

    return result;
  }
}
