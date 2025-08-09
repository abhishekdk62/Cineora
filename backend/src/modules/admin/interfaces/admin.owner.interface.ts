export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IAdminOwnerRepository {
  findByEmail(email: string): Promise<any>;
  findByKycRequestId(requestId: string): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(page: number, limit: number): Promise<{ owners: any[], total: number }>;
  findByStatus(status: string, page: number, limit: number): Promise<{ owners: any[], total: number }>;
  create(data: any): Promise<any>;
  toggleStatus(id: string): Promise<any>;
  updateLastLogin(id: string): Promise<any>;
}

export interface IAdminOwnerRequestRepository {
  findByEmail(email: string): Promise<any>;
  findByPhone(phone: string): Promise<any>;
  findByAadhaar(aadhaar: string): Promise<any>;
  findByPan(pan: string): Promise<any>;
  findById(id: string): Promise<any>;
  findByStatus(status: string, page: number, limit: number): Promise<{ requests: any[], total: number }>;
  findAll(page: number, limit: number): Promise<{ requests: any[], total: number }>;
  create(data: any): Promise<any>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<any>;
}


export interface AdminOwnerFilters {
  search?: string;
  isActive?: boolean;
  kycStatus?: string;
  registrationDateStart?: Date;
  registrationDateEnd?: Date;
  sortBy?: 'ownerName' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export interface AdminOwnerRequestFilters {
  status?: 'pending' | 'approved' | 'rejected';
  search?: string;
  submittedDateStart?: Date;
  submittedDateEnd?: Date;
  reviewedBy?: string;
  sortBy?: 'submittedAt' | 'reviewedAt' | 'ownerName' | 'email';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
