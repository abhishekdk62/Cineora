import { OTP, IOTP } from '../models/otp.model';
import { IOTPRepository } from './IOtp.repository';

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

  async findById(id: string): Promise<IOTP | null> {
    return OTP.findById(id).exec();
  }

  async deleteExpiredOTPs(): Promise<number> {
    const result = await OTP.deleteMany({ 
      expiresAt: { $lt: new Date() } 
    });
    return result.deletedCount || 0;
  }

  async findAllByEmail(email: string): Promise<IOTP[]> {
    return OTP.find({ email }).sort({ createdAt: -1 });
  }

  async updateOTP(id: string, updateData: Partial<IOTP>): Promise<IOTP | null> {
    return OTP.findByIdAndUpdate(id, updateData, { new: true });
  }

  async cleanupUsedOTPs(): Promise<number> {
    const result = await OTP.deleteMany({ isUsed: true });
    return result.deletedCount || 0;
  }

  async cleanupOldOTPs(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const result = await OTP.deleteMany({ 
      createdAt: { $lt: cutoffDate } 
    });
    return result.deletedCount || 0;
  }

  async getOTPStats(email?: string): Promise<{
    total: number;
    active: number;
    expired: number;
    used: number;
  }> {
    const query = email ? { email } : {};
    const now = new Date();
    
    const [total, active, expired, used] = await Promise.all([
      OTP.countDocuments(query),
      OTP.countDocuments({ ...query, isUsed: false, expiresAt: { $gt: now } }),
      OTP.countDocuments({ ...query, isUsed: false, expiresAt: { $lt: now } }),
      OTP.countDocuments({ ...query, isUsed: true })
    ]);

    return { total, active, expired, used };
  }

  async countOTPsInTimeFrame(email: string, type: string, timeFrameMinutes: number): Promise<number> {
    const cutoffTime = new Date(Date.now() - (timeFrameMinutes * 60 * 1000));
    return OTP.countDocuments({
      email,
      type,
      createdAt: { $gte: cutoffTime }
    });
  }

  async getLastOTPTime(email: string, type: string): Promise<Date | null> {
    const otp = await OTP.findOne({ email, type }).sort({ createdAt: -1 });
    return otp ? otp.createdAt : null;
  }
}
