export interface OwnerFilterDto {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UpdateOwnerProfileDto {
  ownerName?: string;
  phone?: string;
  email?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  ownerPhotoUrl?: string;
  isActive?: boolean;
  isVerified?: boolean;
}


export interface UpdateToNewPasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface EmailChangeRequestDto {
  newEmail: string;
  password: string;
}

export interface EmailChangeVerificationDto {
  email: string;
  otp: string;
}

export interface CreateOwnerDto {
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  aadhaar: string;
  pan: string;
  aadhaarUrl: string;
  panUrl: string;
  kycRequestId: string;
  approvedBy: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface EmailChangeDto {
  newEmail: string;
  password: string;
}

export interface VerifyEmailChangeDto {
  email: string;
  otp: string;
}

export interface ToggleOwnerStatusDto {
  ownerId: string;
}

export interface BulkUpdateStatusDto {
  ownerIds: string[];
  isActive: boolean;
}

export interface OwnerSearchDto {
  searchTerm: string;
  page?: number;
  limit?: number;
}


export interface SendOTPDto {
  email: string;
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export interface SubmitKYCDto {
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  declaration: boolean;
  agree: boolean;
}

export interface UpdateRequestStatusDto {
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface GetAllRequestsDto {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetOwnerRequestsFiltersDto {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UploadFileDto {
  file: Express.Multer.File;
  folder: string;
}

export interface UploadMultipleFilesDto {
  files: Express.Multer.File[];
  folder?: string;
}

export interface GenerateSignedUrlDto {
  publicId: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'crop';
}

export interface OwnerKYCDataDto extends SubmitKYCDto {
}

export interface KYCSubmissionResponseDataDto {
  requestId: string;
  status: string;
  submittedAt: Date;
}
