import { IOTP } from "../interfaces/otp.model.interface";

export interface IOTPRepository {
  // Create new OTP (deletes existing ones for same email/type)
  create(otpData: Partial<IOTP>): Promise<IOTP>;

  // Find valid OTP by email, otp code, and type
  findValidOTP(email: string, otp: string, type: string): Promise<IOTP | null>;

  // Mark OTP as used by ID
  markAsUsed(id: string): Promise<boolean>;

  // Delete all OTPs by email and type
  deleteByEmail(email: string, type: string): Promise<boolean>;

  // Find OTP by email and type (valid only)
  findByEmail(email: string, type: string): Promise<IOTP | null>;

  // Delete all expired OTPs
  deleteExpiredOTPs(): Promise<number>;
}
