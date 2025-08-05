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

export interface IOwnerService {
  sendOTP(email: string): Promise<ServiceResponse>;
  verifyOTP(email: string, otp: string): Promise<ServiceResponse>;
  submitKYC(ownerData: OwnerKYCData): Promise<ServiceResponse>;
  getRequestStatus(requestId: string): Promise<ServiceResponse>;
  getOwnerProfile(requestId: string): Promise<ServiceResponse>;
}

// ✅ OPTIONAL: Add repository interface if you want type safety
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
  create(data: any): Promise<any>;
  updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<any>;
}
