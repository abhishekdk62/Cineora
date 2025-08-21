import { AdminResponseDto } from "../dtos/dtos";
import { IAdmin } from "../interfaces/admin.model.interface";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  
  findById(id: string): Promise<IAdmin | null>;
  
  updateRefreshToken(userId: string, hashedRefreshToken: string): Promise<AdminResponseDto | null>;
  
  clearRefreshToken(userId: string): Promise<AdminResponseDto | null>;
}
