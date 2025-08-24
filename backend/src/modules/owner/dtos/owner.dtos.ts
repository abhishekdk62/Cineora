import { IOwner } from "../interfaces/owner.model.interface";

export interface PaginationDto {
  page: number;
  limit: number;
}

export interface CreateOwnerDto {
  ownerName: string;
  phone: string;
  email: string;
  password: string;
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
  approvedAt?: Date;
  approvedBy?: string;
  isActive?: boolean;
  isVerified?: boolean;
  theatres?: string[];
  
}

export interface UpdateOwnerDto {
  ownerName?: string;
  phone?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  ownerPhotoUrl?: string;
}

export interface UpdateOwnerPasswordRepositoryDto {
  id: string;
  hashedPassword: string;
}


export interface RefreshTokenDto {
  userId: string;
  hashedRefreshToken: string;
}

export interface SearchOwnersDto extends PaginationDto {
  searchTerm: string;
}

export interface BulkUpdateStatusDto {
  ownerIds: string[];
  isActive: boolean;
}

export interface TheatreManagementDto {
  ownerId: string;
  theatreId: string;
}

export interface OwnerResponseDto {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  theatres?: string[];
}

export interface PaginatedOwnersDto {
  owners: IOwner[];
  total: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}



export interface BulkUpdateResultDto {
  modifiedCount: number;
  success: boolean;
}

export enum OwnerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
  VERIFIED = "verified",
  UNVERIFIED = "unverified"
}



export interface UpdateOwnerProfileDto {
  ownerName?: string;
  phone?: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  ownerPhotoUrl?: string;
}

export interface OwnerAuthDto {
  email: string;
  password: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
export interface UpdateToNewPasswordDto {
  newPassword: string;
  oldPassword: string;
}
export interface EmailChangeVerificationDto {
  email: string;
  otp: string;
}
export interface EmailChangeRequestDto {
  newEmail: string;
  password: string;
}


export interface OwnerProfileDto {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  ownerPhotoUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  theatres: string[];
  createdAt: Date;
  approvedAt: Date;
  approvedBy: string;
}

export interface OwnerAuthResponseDto {
  owner: Omit<OwnerResponseDto, 'theatres'>;
  accessToken: string;
  refreshToken: string;
}

export interface OwnerStatsDto {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  theatres: any[]; 
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  totalTheatres: number;
}

export interface OwnerLoginDto {
  email: string;
  password: string;
}

export interface OwnerFilterDto extends PaginationDto {
  status?: OwnerStatus;
  isActive?: boolean;
  isVerified?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OwnerPublicProfileDto {
  _id: string;
  ownerName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  totalTheatres: number;
}

export interface ServiceResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
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

export interface UpdateRequestStatusDto {
  status: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface GetAllRequestsDto {
  page?: number;
  limit?: number;
  status?: string;
}

export interface RejectOwnerRequestDto {
  rejectionReason: string;
}

export interface KYCSubmissionResponseDto {
  requestId: string;
  status: string;
  submittedAt: Date;
}

export interface RequestsWithPaginationDto {
  requests: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRequests: number;
    limit: number;
  };
}

export interface RequestsWithMetaDto {
  requests: any[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
    };
  };
}
