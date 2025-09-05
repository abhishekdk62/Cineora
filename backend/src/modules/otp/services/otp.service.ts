import { IOTP, OTPType } from "../interfaces/otp.model.interface";
import { IOTPRepository } from "../interfaces/otp.repository.interface";
import { IOTPService } from "../interfaces/otp.service.interface";

export class OTPService implements IOTPService {
  constructor(private readonly _otpRepo: IOTPRepository) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(
    email: string,
    type: OTPType,
    options?: { expiresAt?: Date }
  ): Promise<{
    success: boolean;
    message?: string;
    data?: { otp: string; id: string };
  }> {
    const otp = this.generateOTP();
    const expiresAt =
      options?.expiresAt || new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = await this._otpRepo.create({
      email,
      otp,
      type,
      expiresAt,
      isUsed: false,
    });

    return {
      success: true,
      data: { otp, id: otpRecord._id as string },
    };
  }

  async verifyOTPWithResponse(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    const validOTP = await this._otpRepo.findValidOTP(email, otp, type);

    if (!validOTP) {
      console.log('valid not ');
      
      return {
        success: false,
        message: "Invalid or expired OTP",
      };
    }

    await this._otpRepo.markAsUsed(validOTP._id as string);

    return {
      success: true,
      message: "OTP verified successfully",
      data: validOTP,
    };
  }

  async verifyOTP(
    email: string,
    otp: string,
    type: string
  ): Promise<IOTP | null> {
    const validOTP = await this._otpRepo.findValidOTP(email, otp, type);

    if (validOTP) {
      await this._otpRepo.markAsUsed(validOTP._id as string);
    }

    return validOTP;
  }

  async generateAndSaveOTP(
    email: string,
    type: OTPType,
    userData?: any
  ): Promise<{ otp: string; expiresAt: Date }> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepo.create({
      email,
      otp,
      type,
      expiresAt,
      isUsed: false,
      userData,
    });

    return { otp, expiresAt };
  }
}
