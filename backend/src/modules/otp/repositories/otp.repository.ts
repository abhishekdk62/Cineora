import { IOTP } from "../interfaces/otp.model.interface";
import { IOTPRepository } from "../interfaces/otp.repository.interface";
import { OTP } from "../models/otp.model";

export class OTPRepository implements IOTPRepository {
  async create(otpData: Partial<IOTP>): Promise<IOTP> {
    await OTP.deleteMany({
      email: otpData.email,
      type: otpData.type,
    });

    const otp = new OTP(otpData);
    return otp.save();
  }

  async findValidOTP(
    email: string,
    otpCode: string,
    otpType: string
  ): Promise<IOTP | null> {
    return OTP.findOne({
      email,
      otp: otpCode,
      type: otpType,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  async markAsUsed(otpId: string): Promise<boolean> {
    const result = await OTP.updateOne({ _id: otpId }, { isUsed: true });
    return result.modifiedCount > 0;
  }

  async deleteByEmail(email: string, otpType: string): Promise<boolean> {
    const result = await OTP.deleteMany({ email, type: otpType });
    return result.deletedCount > 0;
  }

  async findByEmail(email: string, otpType: string): Promise<IOTP | null> {
    return OTP.findOne({
      email,
      type: otpType,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  async deleteExpiredOTPs(): Promise<number> {
    const result = await OTP.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount || 0;
  }
}
