import { OTP, IOTP } from '../models/otp.model';

export interface IOTPRepository {
  create(otpData: Partial<IOTP>): Promise<IOTP>;
  findValidOTP(email: string, otp: string, type: string): Promise<IOTP | null>;
  markAsUsed(id: string): Promise<boolean>;
  deleteByEmail(email: string, type: string): Promise<boolean>;
  findByEmail(email: string, type: string): Promise<IOTP | null>;
}

export class OTPRepository implements IOTPRepository {
  async create(otpData: Partial<IOTP>): Promise<IOTP> {
    await OTP.deleteMany({ 
      email: otpData.email, 
      type: otpData.type 
    });
    
    const otp = new OTP(otpData);
    return otp.save();
  }

  async findValidOTP(email: string, otp: string, type: string): Promise<IOTP | null> {
    return OTP.findOne({
      email,
      otp,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).exec();
  }

  async markAsUsed(id: string): Promise<boolean> {
    const result = await OTP.updateOne(
      { _id: id },
      { isUsed: true }
    );
    return result.modifiedCount > 0;
  }

  async deleteByEmail(email: string, type: string): Promise<boolean> {
    const result = await OTP.deleteMany({ email, type });
    return result.deletedCount > 0;
  }

  async findByEmail(email: string, type: string): Promise<IOTP | null> {
    return OTP.findOne({
      email,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).exec();
  }
}
