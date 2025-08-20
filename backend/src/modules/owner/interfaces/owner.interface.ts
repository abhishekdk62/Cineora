import {  Document, Types } from "mongoose";


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

export interface IOwnerService {
  // Fetch profile by request ID
  getOwnerProfile(requestId: string): Promise<ServiceResponse>;

  // Fetch counts of different owner/request statuses
  getOwnerCounts(): Promise<ServiceResponse>;

  // Get owners list with filters
  getOwners(filters: any): Promise<ServiceResponse>;

  // Toggle active/inactive status of an owner
  toggleOwnerStatus(ownerId: string): Promise<ServiceResponse>;

  // Fetch owner by ID
  getOwnerById(ownerId: string): Promise<ServiceResponse>;

  // Update owner details
  updateOwner(ownerId: string, updateData: any): Promise<ServiceResponse>;

  // Delete an owner
  deleteOwner(ownerId: string): Promise<ServiceResponse>;

  // Send OTP for email change
  sendEmailChangeOtp(
    ownerId: string,
    newEmail: string,
    password: string
  ): Promise<ServiceResponse>;

  // Verify email change OTP and update email
  verifyEmailChangeOtp(
    id: string,
    email: string,
    otp: string
  ): Promise<ServiceResponse>;

  // Change owner password
  changeOwnerPassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ServiceResponse>;
}

export interface IOwnerRepository {
  findByEmail(email: string): Promise<IOwner | null>;
  findByKycRequestId(requestId: string): Promise<IOwner | null>;
  findById(id: string): Promise<IOwner | null>;
  findAll(
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  findByStatus(
    status: string,
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  create(data: Partial<IOwner>): Promise<IOwner | null>;
  toggleStatus(id: string): Promise<IOwner | null>;
  updateLastLogin(id: string): Promise<IOwner | null>;
  updatePassword(id: string, hashedPassword: string): Promise<boolean>;
  update(id: string, updateData: Partial<IOwner>): Promise<IOwner | null>;
  delete(id: string): Promise<IOwner | null>;

  findByPhone(phone: string): Promise<IOwner | null>;
  findByPan(pan: string): Promise<IOwner | null>;
  findByAadhaar(aadhaar: string): Promise<IOwner | null>;
  updateProfile(
    id: string,
    profileData: Partial<IOwner>
  ): Promise<IOwner | null>;
  addTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  removeTheatre(ownerId: string, theatreId: string): Promise<IOwner | null>;
  searchOwners(
    searchTerm: string,
    page?: number,
    limit?: number
  ): Promise<{ owners: IOwner[]; total: number }>;
  getOwnerStats(ownerId: string): Promise<IOwner | null>;
  bulkUpdateStatus(
    ownerIds: string[],
    isActive: boolean
  ): Promise<{ modifiedCount: number }>;
  updateRefreshToken(
    userId: string,
    hashedRefreshToken: string
  ): Promise<IOwner | null>;
  clearRefreshToken(userId: string): Promise<IOwner | null>;
}


export interface IOwnerRequestRepository {
  findByEmail(email: string): Promise<IOwnerRequest|null>;
  findByPhone(phone: string): Promise<IOwnerRequest|null>;
  findByAadhaar(aadhaar: string): Promise<IOwnerRequest|null>;
  findByPan(pan: string): Promise<IOwnerRequest|null>;
  findExistingNonRejected(data: { 
    phone: string; 
    email: string; 
    aadhaar: string; 
    pan: string 
  }): Promise<IOwnerRequest|null>;
  findById(id: string): Promise<IOwnerRequest|null>;
  findByStatus(status: string, page: number, limit: number): Promise<{ requests: IOwnerRequest[], total: number }>;
  findAll(page?: number, limit?: number): Promise<{ requests: IOwnerRequest[], total: number }>;
  create(data: Partial<IOwnerRequest>): Promise<IOwnerRequest>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<IOwnerRequest|null>;
  update(id: string, updateData: Partial<IOwnerRequest>): Promise<IOwnerRequest|null>;
  delete(id: string): Promise<IOwnerRequest|null>;
}

export interface IOwnerRequestService {
  // Send OTP for verifying owner email before KYC
  sendOTP(email: string): Promise<ServiceResponse>;

  // Verify OTP for email confirmation
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;

  // Submit owner KYC form
  submitKYC(ownerData: OwnerKYCData): Promise<ServiceResponse>;

  // Update the status of a KYC request (pending, under_review, approved, rejected)
  updateRequestStatus(
    requestId: string,
    status: string,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<ServiceResponse>;

  // Fetch request status of a specific KYC request
  getRequestStatus(requestId: string): Promise<ServiceResponse>;

  // Fetch all requests (with optional pagination + filtering by status)
  getAllRequests(
    page?: number,
    limit?: number,
    status?: string
  ): Promise<ServiceResponse>;

  // Get owner requests with search/sort/pagination filters
  getOwnerRequests(filters: any): Promise<ServiceResponse>;
}

export interface IOwner extends Document {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  password?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;
  refreshToken:string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;

  kycRequestId: Types.ObjectId; 
  approvedAt: Date;
  approvedBy: string;

  isActive: boolean;
  isVerified: boolean;

  theatres: Types.ObjectId[]; 

  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOwnerRequest extends Document {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  otp?: string;
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
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
}