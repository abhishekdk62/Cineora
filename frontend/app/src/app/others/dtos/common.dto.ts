import { OwnerResponseDto } from "./owner.dto";
import { TheaterResponseDto } from "./theater.dto";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T & {
    meta?: {
      pagination?: {
        currentPage: number;
        totalPages: number;
        total: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
      filters?: {
        applied: number;
      };
      [key: string]: any;
    };
    owners?: OwnerResponseDto[];
      theaters?: TheaterResponseDto[];

  };
  message?: string;
  errors?: { field: string; message: string }[];
  meta?: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      total: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters?: {
      applied: number;
    };
    [key: string]: any;
  };
  timestamp: string;
}


export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ErrorResponse {
  field: string;
  message: string;
}
