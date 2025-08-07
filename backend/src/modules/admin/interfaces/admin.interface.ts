import { IAdmin } from '../models/admin.model';

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
}
// Keep admin-specific interfaces in admin module
// Remove IAdminUserRepository - use IUserRepository from users module instead

// If you have admin-specific user filters, keep them here:
export interface AdminUserFilters {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  joinedDateStart?: Date;
  joinedDateEnd?: Date;
  lastActiveStart?: Date;
  lastActiveEnd?: Date;
  sortBy?: 'username' | 'email' | 'joinedAt' | 'lastActive';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Keep admin-specific interfaces in admin module
export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AdminOwnerFilters {
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminOwnerRequestFilters {
  search?: string;
  status?: 'pending' | 'under_review' | 'approved' | 'rejected';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AdminUserFilters {
  search?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
