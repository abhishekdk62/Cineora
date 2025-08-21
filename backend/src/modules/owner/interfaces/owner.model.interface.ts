import { Types } from "mongoose";

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

