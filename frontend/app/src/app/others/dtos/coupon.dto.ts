import { ApiResponse, PaginationQuery } from './common.dto';

export interface GetCouponsQueryDto extends PaginationQuery {
  ownerId?: string;
}

export interface CouponResponseDto {
  _id: string;
  name: string;
  uniqueId: string;
  theaterIds: {
    _id: string;
    name: string;
    location: string;
  }[];
  discountPercentage: number;
  description: string;
  expiryDate: Date;
  isActive: boolean;
  isUsed: boolean;
  maxUsageCount: number;
  currentUsageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCouponResponseDto {
  data: CouponResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export interface CreateCouponRequestDto {
  name: string;
  uniqueId: string;
  theaterIds: string[];
  discountPercentage: number;
  description?: string;
  expiryDate: string;
  maxUsageCount?: number;
  theaterNames?: string[];
}

export interface UpdateCouponRequestDto {
  name?: string;
  uniqueId?: string;
  theaterIds?: string[];
  discountPercentage?: number;
  description?: string;
  expiryDate?: string;
  maxUsageCount?: number;
  isActive?: boolean;
}

export interface CreateCouponResponseDto extends ApiResponse<CouponResponseDto> {}
export interface UpdateCouponResponseDto extends ApiResponse<CouponResponseDto> {}
export interface DeleteCouponResponseDto extends ApiResponse<void> {}

export interface GetCouponsResponseDto extends ApiResponse<PaginatedCouponResponseDto> {}
export interface GetCouponsByTheaterResponseDto extends ApiResponse<CouponResponseDto[]> {}
