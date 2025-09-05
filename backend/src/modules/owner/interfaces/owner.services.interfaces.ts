import { ServiceResponse } from "../../../interfaces/interface";

import { 
  OwnerKYCDataDto, 
  GetOwnerRequestsFiltersDto, 
  UploadFileDto, 
  UploadMultipleFilesDto, 
  GenerateSignedUrlDto,
  KYCSubmissionResponseDataDto 
} from "../dtos/ownerReq.dtos";
import { IOwnerRequest } from "./owner.model.interface";

export interface IOwnerRequestService {
  sendOTP(email: string): Promise<ServiceResponse>;
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;
  submitKYC(ownerData: OwnerKYCDataDto): Promise<ServiceResponse<KYCSubmissionResponseDataDto>>;
  updateRequestStatus(requestId: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<ServiceResponse>;
  getRequestStatus(requestId: string): Promise<ServiceResponse<IOwnerRequest>>;
  getAllRequests(page?: number, limit?: number, status?: string): Promise<ServiceResponse>;
  getOwnerRequests(filters: GetOwnerRequestsFiltersDto): Promise<ServiceResponse>;
  uploadFile(uploadFileDto: UploadFileDto): Promise<ServiceResponse>;
  uploadMultipleFiles(uploadMultipleDto: UploadMultipleFilesDto): Promise<ServiceResponse>;
  generateSignedUrl(signedUrlDto: GenerateSignedUrlDto): Promise<ServiceResponse>;
}




import { OwnerFilterDto, UpdateOwnerProfileDto } from "../dtos/owner.dtos";

export interface IOwnerService {
  getOwnerProfile(requestId: string): Promise<ServiceResponse>;
  getOwnerById(ownerId: string): Promise<ServiceResponse>;
  getOwnerCounts(): Promise<ServiceResponse>;
  getOwners(filters: OwnerFilterDto): Promise<ServiceResponse>;
  toggleOwnerStatus(ownerId: string): Promise<ServiceResponse>;
  updateOwner(ownerId: string, updateData: UpdateOwnerProfileDto): Promise<ServiceResponse>;
  deleteOwner(ownerId: string): Promise<ServiceResponse>;
  sendEmailChangeOtp(ownerId: string, newEmail: string, password: string): Promise<ServiceResponse>;
  verifyEmailChangeOtp(id: string, email: string, otp: string): Promise<ServiceResponse>;
  changeOwnerPassword(userId: string, oldPassword: string, newPassword: string): Promise<ServiceResponse>;
}



