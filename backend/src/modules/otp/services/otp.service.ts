import { OTPRepository } from '../repositories/otp.repository';
import { IOTP } from '../models/otp.model';

export class OTPService {
  private otpRepo = new OTPRepository();

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateAndSaveOTP(
    email: string, 
    type: 'signup' | 'password_reset' | 'login' | 'owner_verification',
    userData?: any
  ): Promise<{ otp: string; expiresAt: Date }> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

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

  async verifyOTP(email: string, otp: string, type: string): Promise<IOTP | null> {
    const validOTP = await this.otpRepo.findValidOTP(email, otp, type);
    
    if (validOTP) {
      await this.otpRepo.markAsUsed(validOTP._id as string);
    }
    
    return validOTP;
  }

  async cleanupExpiredOTPs(): Promise<void> {
  }
}
