import { IOTP } from "../interfaces/otp.model.interface";

export interface IOTPRepository {
  create(otpData: Partial<IOTP>): Promise<IOTP>;

  findValidOTP(email: string, otp: string, type: string): Promise<IOTP | null>;

  markAsUsed(id: string): Promise<boolean>;

  deleteByEmail(email: string, type: string): Promise<boolean>;

  findByEmail(email: string, type: string): Promise<IOTP | null>;

  deleteExpiredOTPs(): Promise<number>;
}
