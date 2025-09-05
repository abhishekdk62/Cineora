import { ApiResponse, PaginationQuery } from './common.dto';

export interface OwnerRequestEntity {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  otp?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  declaration: boolean;
  agree: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
}

export interface OwnerEntity {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  password?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  refreshToken: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  kycRequestId: string;
  approvedAt: Date;
  approvedBy: string;
  isActive: boolean;
  isVerified: boolean;
  theatres: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnerRequestData {
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  declaration: boolean;
  agree: boolean;
}

export interface PartialUserProfile {
  ownerName?: string;
  phone?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  ownerPhotoUrl?: string;
}

export interface OwnerFilters extends PaginationQuery {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OwnerRequestFilters extends PaginationQuery {
  search?: string;
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  emailVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface AcceptOwnerRequestDto {}

export interface RejectOwnerRequestDto {
  rejectionReason?: string;
}

export interface SendOwnerOTPRequestDto {
  email: string;
}

export interface VerifyOwnerOTPRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  newPassword: string;
  oldPassword: string;
}

export interface SendEmailChangeOtpRequestDto {
  newEmail: string;
  password: string;
}

export interface VerifyEmailChangeOtpRequestDto {
  email: string;
  otp: string;
}

export interface OwnerRequestResponseDto {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  declaration: boolean;
  agree: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
}

export interface OwnerResponseDto {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  kycRequestId: string;
  approvedAt: Date;
  approvedBy: string;
  isActive: boolean;
  isVerified: boolean;
  theatres: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnerCountsResponseDto {
  totalOwners: number;
  activeOwners: number;
  inactiveOwners: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export interface GetOwnersResponseDto extends ApiResponse<OwnerResponseDto[]> {}
export interface GetOwnerRequestsResponseDto extends ApiResponse<OwnerRequestResponseDto[]> {}
export interface GetOwnerCountsResponseDto extends ApiResponse<OwnerCountsResponseDto> {}
export interface AcceptOwnerRequestResponseDto extends ApiResponse<OwnerRequestResponseDto> {}
export interface RejectOwnerRequestResponseDto extends ApiResponse<OwnerRequestResponseDto> {}
export interface ToggleOwnerStatusResponseDto extends ApiResponse<OwnerResponseDto> {}
export interface SendOwnerOTPResponseDto extends ApiResponse<{ message: string }> {}
export interface VerifyOwnerOTPResponseDto extends ApiResponse<{ verified: boolean; requestId?: string }> {}
export interface SubmitOwnerRequestResponseDto extends ApiResponse<OwnerRequestResponseDto> {}
export interface GetOwnerRequestStatusResponseDto extends ApiResponse<OwnerRequestResponseDto> {}
export interface GetOwnerProfileResponseDto extends ApiResponse<OwnerResponseDto> {}
export interface UpdateOwnerProfileResponseDto extends ApiResponse<OwnerResponseDto> {}
export interface ResetPasswordResponseDto extends ApiResponse<{ message: string }> {}
export interface SendEmailChangeOtpResponseDto extends ApiResponse<{ message: string }> {}
export interface VerifyEmailChangeOtpResponseDto extends ApiResponse<{ message: string }> {}
