import { AdminResponseDto } from "../dtos/dtos";
import { IAdmin } from "../interfaces/admin.model.interface";
import { IAdminRepository } from "../interfaces/admin.repository.interface";
import { Admin } from "../models/admin.model";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }

  async findById(id: string):Promise<IAdmin | null> {
    return await Admin.findById(id);
  }
  async updateRefreshToken(userId: string, hashedRefreshToken: string):Promise<AdminResponseDto | null>
 {
    return await Admin.findByIdAndUpdate(
      userId,
      { 
        refreshToken: hashedRefreshToken,
        updatedAt: new Date()
      },
      { new: true }
    );
  }
  
  async clearRefreshToken(userId: string): Promise<AdminResponseDto | null>
{
    return await Admin.findByIdAndUpdate(
      userId,
      { 
        $unset: { refreshToken: 1 },
        updatedAt: new Date()
      }
    );
  }
}

