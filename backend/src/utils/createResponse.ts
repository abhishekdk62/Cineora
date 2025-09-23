export interface ApiResponse<T = string> {
  success: boolean;
  data?: T;
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
    [key: string]: string;
  };
  timestamp: string;
}

export function createResponse<T>(params: {
  success: boolean;
  data?: T;
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
    [key: string]: string;
  };
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
