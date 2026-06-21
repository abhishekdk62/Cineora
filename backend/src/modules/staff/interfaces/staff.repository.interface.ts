import { ExtendedPaginatedResult } from "../../../types/pagination.types";
import { IStaff } from "../model/staff.model";

export interface IStaffRepository {
  create(staffData: Partial<IStaff>): Promise<IStaff>;
  findById(id: string): Promise<IStaff | null>;
  findByEmail(email: string): Promise<IStaff | null>;
  findAll(filters?: Record<string, unknown>): Promise<IStaff[]>;
  findAllPaginated(
    page: number,
    limit: number,
    filters?: Record<string, unknown>
  ): Promise<ExtendedPaginatedResult<IStaff>>;
  updateById(id: string, updateData: Partial<IStaff>): Promise<IStaff | null>;
  updateRefreshToken(id: string, hashedRefreshToken: string): Promise<IStaff | null>;
  clearRefreshToken(id: string): Promise<IStaff | null>;
  deleteById(id: string): Promise<boolean>;
}
