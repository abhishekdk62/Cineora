import { IStaffRepository } from "../interfaces/staff.repository.interface";
import { Staff, IStaff } from "../model/staff.model";

export class StaffRepository implements IStaffRepository {
  
  async create(staffData: Partial<IStaff>): Promise<IStaff> {
    return await Staff.create(staffData);
  }

  async findById(id: string): Promise<IStaff | null> {
    return await Staff.findById(id)
      .populate("ownerId")
      .populate("theaterId");
  }

  async findByEmail(email: string): Promise<IStaff | null> {
    return await Staff.findOne({ email });
  }

  async findAll(filters?: any): Promise<IStaff[]> {
    const query = Staff.find(filters || {});
    return await query.populate("ownerId").populate("theaterId");
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters?: Record<string, unknown>
  ): Promise<import("../../../types/pagination.types").ExtendedPaginatedResult<IStaff>> {
    const skip = (page - 1) * limit;
    const query = Staff.find(filters || {});

    const [staffs, total] = await Promise.all([
      query.skip(skip).limit(limit).populate("ownerId").populate("theaterId"),
      Staff.countDocuments(filters || {}),
    ]);

    return {
      data: staffs,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string
  ): Promise<IStaff | null> {
    return await Staff.findByIdAndUpdate(
      id,
      { refreshToken: hashedRefreshToken },
      { new: true }
    );
  }

  async clearRefreshToken(id: string): Promise<IStaff | null> {
    return await Staff.findByIdAndUpdate(
      id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  async updateById(id: string, updateData: Partial<IStaff>): Promise<IStaff | null> {
    return await Staff.findByIdAndUpdate(id, updateData, { new: true })
      .populate("ownerId")
      .populate("theaterId");
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Staff.findByIdAndDelete(id);
    return !!result;
  }
}
