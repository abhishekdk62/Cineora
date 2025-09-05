import { ApiResponse } from './common.dto';

export type OTPType =
  | "signup"
  | "password_reset"
  | "login"
  | "owner_verification"
  | "owner_email_change"
  | "email_change"
  | "owner_password_reset";

export interface OTPEntity {
  _id: string;
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

export interface SendOTPRequestDto {
  email: string;
  type: OTPType;
  userData?: any;
}

export interface VerifyOTPRequestDto {
  email: string;
  otp: string;
  type: OTPType;
}

export interface ResendOTPRequestDto {
  email: string;
  type: OTPType;
}

export interface OTPResponseDto {
  _id: string;
  email: string;
  type: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendOTPResponseDto extends ApiResponse<OTPResponseDto> {}
export interface VerifyOTPResponseDto extends ApiResponse<{
  verified: boolean;
  refreshToken?: string;
  userData?: any;
}> {}
export interface ResendOTPResponseDto extends ApiResponse<OTPResponseDto> {}
