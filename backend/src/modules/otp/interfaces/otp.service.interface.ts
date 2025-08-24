import { OTPGenerationResponseDto, OTPResponseDto, OTPVerificationResponseDto } from "../dtos/dtos";
import { IOTP, OTPType } from "../interfaces/otp.model.interface";

export interface IOTPService {
  createOTP(
    email: string,
    type: OTPType,
    options?: { expiresAt?: Date }
  ): Promise<OTPResponseDto>;

  verifyOTPWithResponse(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<OTPVerificationResponseDto>;

  verifyOTP(email: string, otp: string, type: string): Promise<IOTP | null>;

  generateAndSaveOTP(
    email: string,
    type: OTPType,
    userData?: any
  ): Promise<OTPGenerationResponseDto>;
}
