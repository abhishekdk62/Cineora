import { ServiceResponse } from "../../../interfaces/interface";

import { GetOwnerRequestsFiltersDto, KYCSubmissionResponseDataDto, OwnerKYCDataDto } from "../dtos/ownerReq.dtos";
import { IOwnerRequest } from "../interfaces/owner.model.interface";

export interface IOwnerRequestService {
  sendOTP(email: string): Promise<ServiceResponse>;

  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;

  // Submit KYC request
  submitKYC(ownerData: OwnerKYCDataDto): Promise<ServiceResponse<KYCSubmissionResponseDataDto>>;

  // Update request status (approve/reject/etc)
  updateRequestStatus(
    requestId: string,
    status: string,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<ServiceResponse>;

  // Get request status by ID
  getRequestStatus(requestId: string): Promise<ServiceResponse<IOwnerRequest>>;

  // Get all requests with pagination
  getAllRequests(
    page?: number,
    limit?: number,
    status?: string
  ): Promise<ServiceResponse>;

  // Get owner requests with filters
  getOwnerRequests(filters: GetOwnerRequestsFiltersDto): Promise<ServiceResponse>;
}


import { OwnerFilterDto, UpdateOwnerProfileDto } from "../dtos/owner.dtos";

export interface IOwnerService {
  // Fetch profile by request ID
  getOwnerProfile(requestId: string): Promise<ServiceResponse>;

  // Fetch owner by ID
  getOwnerById(ownerId: string): Promise<ServiceResponse>;

  // Fetch counts of different owner/request statuses
  getOwnerCounts(): Promise<ServiceResponse>;

  // Get owners list with filters
  getOwners(filters: OwnerFilterDto): Promise<ServiceResponse>;

  // Toggle active/inactive status of an owner
  toggleOwnerStatus(ownerId: string): Promise<ServiceResponse>;

  // Update owner details
  updateOwner(ownerId: string, updateData: UpdateOwnerProfileDto): Promise<ServiceResponse>;

  // Delete an owner
  deleteOwner(ownerId: string): Promise<ServiceResponse>;

  // Send OTP for email change
  sendEmailChangeOtp(
    ownerId: string,
    newEmail: string,
    password: string
  ): Promise<ServiceResponse>;

  // Verify email change OTP and update email
  verifyEmailChangeOtp(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse>;

  // Change owner password
  changeOwnerPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse>;
}


