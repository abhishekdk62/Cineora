// owner.interface.ts
import { Types } from "mongoose";

export interface OwnerKYCData {
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

export interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Owner Service Interface
export interface IOwnerService {
  getOwnerProfile(requestId: string): Promise<ServiceResponse>;
  getOwnerCounts(): Promise<ServiceResponse>;
  getOwners(filters: any): Promise<ServiceResponse>;
  toggleOwnerStatus(ownerId: string): Promise<ServiceResponse>;
  getOwnerById(ownerId: string): Promise<ServiceResponse>;
  updateOwner(ownerId: string, updateData: any): Promise<ServiceResponse>;
  deleteOwner(ownerId: string): Promise<ServiceResponse>;
}

// Owner Repository Interface
export interface IOwnerRepository {
  findByEmail(email: string): Promise<any>;
  findByKycRequestId(requestId: string): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(page: number, limit: number): Promise<{ owners: any[], total: number }>;
  findByStatus(status: string, page: number, limit: number): Promise<{ owners: any[], total: number }>;
  create(data: any): Promise<any>;
  toggleStatus(id: string): Promise<any>;
  updateLastLogin(id: string): Promise<any>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  update(id: string, updateData: any): Promise<any>;
  delete(id: string): Promise<any>;
  
  // Additional helper methods
  findByPhone(phone: string): Promise<any>;
  findByPan(pan: string): Promise<any>;
  findByAadhaar(aadhaar: string): Promise<any>;
  updateProfile(id: string, profileData: any): Promise<any>;
  addTheatre(ownerId: string, theatreId: string): Promise<any>;
  removeTheatre(ownerId: string, theatreId: string): Promise<any>;
  searchOwners(searchTerm: string, page: number, limit: number): Promise<{ owners: any[], total: number }>;
  getOwnerStats(ownerId: string): Promise<any>;
  bulkUpdateStatus(ownerIds: string[], isActive: boolean): Promise<any>;
}

// Owner Request Repository Interface
export interface IOwnerRequestRepository {
  findByEmail(email: string): Promise<any>;
  findByPhone(phone: string): Promise<any>;
  findByAadhaar(aadhaar: string): Promise<any>;
  findByPan(pan: string): Promise<any>;
  findExistingNonRejected(data: { 
    phone: string; 
    email: string; 
    aadhaar: string; 
    pan: string 
  }): Promise<any>;
  findById(id: string): Promise<any>;
  findByStatus(status: string, page: number, limit: number): Promise<{ requests: any[], total: number }>;
  findAll(page: number, limit: number): Promise<{ requests: any[], total: number }>;
  create(data: any): Promise<any>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<any>;
  update(id: string, updateData: any): Promise<any>;
  delete(id: string): Promise<any>;
}

// Owner Request Service Interface (separate from Owner Service)
export interface IOwnerRequestService {
  sendOTP(email: string): Promise<ServiceResponse>;
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;
  submitKYC(ownerData: OwnerKYCData): Promise<ServiceResponse>;
  getRequestStatus(requestId: string): Promise<ServiceResponse>;
  updateRequestStatus(requestId: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<ServiceResponse>;
  getAllRequests(page?: number, limit?: number, status?: string): Promise<ServiceResponse>;
  getOwnerRequests(filters: any): Promise<ServiceResponse>;
}
