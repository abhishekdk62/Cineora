import { IStaff } from "../model/staff.model";

export interface IStaffRepository {
  create(staffData: Partial<IStaff>): Promise<IStaff>;
  findById(id: string): Promise<IStaff | null>;
  findByEmail(email: string): Promise<IStaff | null>;
  findAll(filters?: any): Promise<IStaff[]>;
  findAllPaginated(page: number, limit: number, filters?: any): Promise<{
    staffs: IStaff[];
    totalCount: number;
    totalPages: number;
  }>;
  updateById(id: string, updateData: Partial<IStaff>): Promise<IStaff | null>;
  deleteById(id: string): Promise<boolean>;
}
