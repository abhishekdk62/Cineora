export interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive';
  isVerified?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OwnerFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: string;
}

export interface OwnerRequestFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
}