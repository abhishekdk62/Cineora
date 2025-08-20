import { Document } from "mongoose";



export interface IOTPService {
  createOTP(email: string, type: OTPType, options?: { expiresAt?: Date }): Promise<{
    success: boolean;
    message?: string;
    data?: { otp: string; id: string };
  }>;
  
  verifyOTPWithResponse(email: string, otp: string, type: OTPType): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  
  verifyOTP(email: string, otp: string, type: string): Promise<IOTP | null>;
  generateAndSaveOTP(email: string, type: OTPType, userData?: any): Promise<{ otp: string; expiresAt: Date }>;
}
export interface IOTP extends Document {
  email: string;
  otp: string;
  type: string;
  expiresAt: Date;
  isUsed: boolean;
  refreshToken: string;
  userData?: any;
  createdAt: Date;
  updatedAt: Date;
}


export type OTPType =
  | "signup"
  | "password_reset"
  | "login"
  | "owner_verification"
  | "owner_email_change"
  | "email_change"
  | "owner_password_reset";



export interface IOTPRepository {

  create(otpData: Partial<IOTP>): Promise<IOTP>;
  findValidOTP(email: string, otp: string, type: string): Promise<IOTP | null>;
  markAsUsed(id: string): Promise<boolean>;
  deleteByEmail(email: string, type: string): Promise<boolean>;
  findByEmail(email: string, type: string): Promise<IOTP | null>;
  findById(id: string): Promise<IOTP | null>;
  
  deleteExpiredOTPs(): Promise<number>;
  findAllByEmail(email: string): Promise<IOTP[]>;
  updateOTP(id: string, updateData: Partial<IOTP>): Promise<IOTP | null>;
  cleanupUsedOTPs(): Promise<number>;
  cleanupOldOTPs(olderThanDays: number): Promise<number>;
  getOTPStats(email?: string): Promise<{
    total: number;
    active: number;
    expired: number;
    used: number;
  }>;
  countOTPsInTimeFrame(email: string, type: string, timeFrameMinutes: number): Promise<number>;
  getLastOTPTime(email: string, type: string): Promise<Date | null>;
}