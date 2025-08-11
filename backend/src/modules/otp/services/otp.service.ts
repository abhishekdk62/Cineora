import { IOTPService, IOTPRepository, OTPType } from '../interfaces/otp.interface';
import { IOTP } from '../models/otp.model';

export class OTPService implements IOTPService { 
  constructor(private otpRepo: IOTPRepository) {}

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(email: string, type: OTPType, options?: { expiresAt?: Date }): Promise<{
    success: boolean;
    message?: string;
    data?: { otp: string; id: string };
  }> {
    const otp = this.generateOTP();
    const expiresAt = options?.expiresAt || new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = await this.otpRepo.create({
      email,
      otp,
      type,
      expiresAt,
      isUsed: false
    });

    return {
      success: true,
      data: { otp, id: otpRecord._id as string }
    };
  }

  async verifyOTPWithResponse(email: string, otp: string, type: OTPType): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    const validOTP = await this.otpRepo.findValidOTP(email, otp, type);
    
    if (!validOTP) {
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

    await this.otpRepo.markAsUsed(validOTP._id as string);

    return {
      success: true,
      message: 'OTP verified successfully',
      data: validOTP
    };
  }

  async verifyOTP(email: string, otp: string, type: string): Promise<IOTP | null> {
    const validOTP = await this.otpRepo.findValidOTP(email, otp, type);
    
    if (validOTP) {
      await this.otpRepo.markAsUsed(validOTP._id as string);
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

    await this.otpRepo.create({
      email,
      otp,
      type,
      expiresAt,
      isUsed: false,
      userData
    });

    return { otp, expiresAt };
  }

  async validateAndMarkOTP(
    email: string, 
    otp: string, 
    type: OTPType
  ): Promise<{
    success: boolean;
    message?: string;
    data?: IOTP;
  }> {
    const validOTP = await this.otpRepo.findValidOTP(email, otp, type);
    
    if (!validOTP) {
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

    const marked = await this.otpRepo.markAsUsed(validOTP._id as string);
    if (!marked) {
      return {
        success: false,
        message: 'Failed to validate OTP'
      };
    }

    return {
      success: true,
      message: 'OTP validated successfully',
      data: validOTP
    };
  }

  async createAndSendOTP(
    email: string, 
    type: OTPType, 
    emailService: any
  ): Promise<{
    success: boolean;
    message?: string;
    data?: { otp: string; id: string };
  }> {
    const canSend = await this.canSendOTP(email, type, 1);
    if (!canSend) {
      const remainingTime = await this.getRemainingCooldown(email, type, 1);
      return {
        success: false,
        message: `Please wait ${Math.ceil(remainingTime / 1000)} seconds before requesting another OTP`
      };
    }

    const otpResult = await this.createOTP(email, type);
    if (!otpResult.success) {
      return otpResult;
    }

    const emailSent = await emailService.sendOTPEmail(email, otpResult.data!.otp);
    if (!emailSent) {
      return {
        success: false,
        message: 'Failed to send OTP email'
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      data: otpResult.data
    };
  }

  async cleanupExpiredOTPs(): Promise<void> {
    await this.otpRepo.deleteExpiredOTPs();
  }

  async canSendOTP(email: string, type: string, cooldownMinutes: number = 1): Promise<boolean> {
    const lastOTPTime = await this.otpRepo.getLastOTPTime(email, type);
    if (!lastOTPTime) return true;

    const cooldownMs = cooldownMinutes * 60 * 1000;
    const timeSinceLastOTP = Date.now() - lastOTPTime.getTime();
    
    return timeSinceLastOTP >= cooldownMs;
  }

  async getRemainingCooldown(email: string, type: string, cooldownMinutes: number = 1): Promise<number> {
    const lastOTPTime = await this.otpRepo.getLastOTPTime(email, type);
    if (!lastOTPTime) return 0;

    const cooldownMs = cooldownMinutes * 60 * 1000;
    const timeSinceLastOTP = Date.now() - lastOTPTime.getTime();
    
    return Math.max(0, cooldownMs - timeSinceLastOTP);
  }

  async isOTPValid(email: string, otp: string, type: OTPType): Promise<boolean> {
    const validOTP = await this.otpRepo.findValidOTP(email, otp, type);
    return validOTP !== null;
  }

  async getOTPDetails(email: string, type: OTPType): Promise<IOTP | null> {
    return this.otpRepo.findByEmail(email, type);
  }
}
