import { OTPGenerationResponseDto, OTPResponseDto, OTPVerificationResponseDto } from "../dtos/dtos";
import { IOTP, OTPType } from "../interfaces/otp.model.interface";

export interface IOTPService {
  // Create OTP with optional expiration
  createOTP(
    email: string,
    type: OTPType,
    options?: { expiresAt?: Date }
  ): Promise<OTPResponseDto>;

  // Verify OTP and return detailed response
  verifyOTPWithResponse(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<OTPVerificationResponseDto>;

  // Basic OTP verification (returns OTP object or null)
  verifyOTP(email: string, otp: string, type: string): Promise<IOTP | null>;

  // Generate and save OTP with optional user data
  generateAndSaveOTP(
    email: string,
    type: OTPType,
    userData?: any
  ): Promise<OTPGenerationResponseDto>;
}
