import { Document } from "mongoose";



export type OTPType =
  | "signup"
  | "password_reset"
  | "login"
  | "owner_verification"
  | "owner_email_change"
  | "email_change"
  | "owner_password_reset";

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
