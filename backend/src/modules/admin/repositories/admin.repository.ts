import { AdminResponseDto } from "../dtos/dtos";
import { IAdmin } from "../interfaces/admin.model.interface";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { Admin } from "../models/admin.model";

export class AdminRepository implements IAdminRepository {
  async findByEmail(adminEmail: string): Promise<IAdmin | null> {
    return Admin.findOne({ email: adminEmail }).exec();
  }

  async findById(adminId: string): Promise<IAdmin | null> {
    return await Admin.findById(adminId);
  }

  async updateRefreshToken(
    adminId: string,
    hashedRefreshToken: string
  ): Promise<AdminResponseDto | null> {
    return await Admin.findByIdAndUpdate(
      adminId,
      {
        refreshToken: hashedRefreshToken,
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async clearRefreshToken(adminId: string): Promise<AdminResponseDto | null> {
    return await Admin.findByIdAndUpdate(
      adminId,
      {
        $unset: { refreshToken: 1 },
        updatedAt: new Date(),
      }
    );
  }
}
