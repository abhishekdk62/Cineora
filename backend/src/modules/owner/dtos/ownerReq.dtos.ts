import { IOwnerRequest } from "../interfaces/owner.model.interface";


export interface FindExistingNonRejectedDto {
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
}

export interface UpdateRequestStatusDto {
  status: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface SearchRequestsDto extends PaginationDto {
  searchTerm: string;
}

export interface DateRangeQueryDto extends PaginationDto {
  startDate: Date;
  endDate: Date;
}

export interface PaginatedResultDto<T> {
  requests: T[];
  total: number;
}

// ===== INPUT DTOs =====
export interface SendOTPDto {
  email: string;
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
}

export interface OwnerKYCDataDto {
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
  requestId: string;
  status: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface GetAllRequestsFiltersDto {
  page?: number;
  limit?: number;
  status?: string;
}

export interface GetOwnerRequestsFiltersDto {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

// ===== OUTPUT DTOs =====
export interface ServiceResponseDto<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface KYCSubmissionResponseDataDto {
  requestId: string;
  status: string;
  submittedAt: Date;
}

export interface PaginationDto {
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  limit: number;
}

export interface RequestsWithPaginationDto {
  requests: IOwnerRequest[];
  pagination: PaginationDto;
}

export interface RequestsMetaPaginationDto {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface RequestsWithMetaDto {
  requests: IOwnerRequest[];
  meta: {
    pagination: RequestsMetaPaginationDto;
  };
}
