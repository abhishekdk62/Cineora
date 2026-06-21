import { OwnerResponseDto } from "./owner.dto";
import { TheaterResponseDto } from "./theater.dto";

export interface ApiMeta {
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
  owners?: OwnerResponseDto[];
  theaters?: TheaterResponseDto[];
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
  meta?: ApiMeta;
  timestamp?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ErrorResponse {
  field: string;
  message: string;
}

export interface PaginatedData<T> {
  data: T[];
  total: number;
  totalPages?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}
