


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
export interface IAdmin extends Document {
  _id:string;
  email: string;
  password: string;
  refreshToken: string;
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
  sortBy?: "username" | "email" | "joinedAt" | "lastActive"
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}




export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(id: string): Promise<IAdmin | null>;
  updateRefreshToken(userId: string, hashedRefreshToken: string): Promise<IAdmin | null>;
  clearRefreshToken(userId: string): Promise<IAdmin | null>;
}
