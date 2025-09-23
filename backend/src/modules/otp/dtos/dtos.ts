import { UserDto } from "../../../mappers/user.mapper";
import { IOTP, OTPType } from "../interfaces/otp.model.interface";

export interface CreateOTPDto {
  email: string;
  type: OTPType;
  expiresAt?: Date;
}

export interface VerifyOTPDto {
  email: string;
  otp: string;
  type: OTPType;
}

export interface GenerateAndSaveOTPDto {
  email: string;
  type: OTPType;
  userData?: UserDto;
}

export interface SendOTPDto {
  email: string;
  type: OTPType;
}

export interface OTPCooldownDto {
  email: string;
  type: string;
  cooldownMinutes?: number;
}

export interface OTPStatsQueryDto {
  email?: string;
}

export interface OTPTimeFrameDto {
  email: string;
  type: string;
  timeFrameMinutes: number;
}

export interface CleanupOldOTPsDto {
  olderThanDays: number;
}

export interface OTPResponseDto {
  success: boolean;
  message?: string;
  data?: {
    otp: string;
    id: string;
  };
}

export interface OTPVerificationResponseDto {
  success: boolean;
  message?: string;
  data?: IOTP;
}

export interface OTPGenerationResponseDto {
  otp: string;
  expiresAt: Date;
}

export interface OTPStatsDto {
  total: number;
  active: number;
  expired: number;
  used: number;
}

export interface OTPDetailsDto {
  _id: string;
  email: string;
  otp: string;
  type: OTPType;
  expiresAt: Date;
  isUsed: boolean;
  userData?: UserDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface CooldownResponseDto {
  canSend: boolean;
  remainingTime?: number;
}
