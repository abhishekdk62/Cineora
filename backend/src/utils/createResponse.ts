export interface ApiMetaPagination {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiMetaFilters {
  applied: number;
}

export interface ApiMeta {
  pagination?: ApiMetaPagination;
  filters?: ApiMetaFilters;
  [key: string]: string | ApiMetaPagination | ApiMetaFilters | undefined;
}

export interface ApiResponse<T = string> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
  meta?: ApiMeta;
  timestamp: string;
}

export function createResponse<T>(params: {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
  meta?: ApiMeta;
}): ApiResponse<T> {
  return {
    success: params.success,
    ...(params.data !== undefined && { data: params.data }),
    ...(params.message !== undefined && { message: params.message }),
    ...(params.errors !== undefined && { errors: params.errors }),
    ...(params.meta !== undefined && { meta: params.meta }),
    timestamp: new Date().toISOString(),
  };
}
