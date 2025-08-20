import { IAdmin, IAdminRepository } from "../interfaces/admin.interface";
import { Admin } from "../models/admin.model";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

  async findById(id: string) {
    return await Admin.findById(id);
  }
  async updateRefreshToken(userId: string, hashedRefreshToken: string) {
    return await Admin.findByIdAndUpdate(
      userId,
      { 
        refreshToken: hashedRefreshToken,
        updatedAt: new Date()
      },
      { new: true }
    );
  }
  
  async clearRefreshToken(userId: string) {
    return await Admin.findByIdAndUpdate(
      userId,
      { 
        $unset: { refreshToken: 1 },
        updatedAt: new Date()
      }
    );
  }
}

