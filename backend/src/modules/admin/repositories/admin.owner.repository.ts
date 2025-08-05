import { Owner } from "../../owner/models/owner.model";
import { IAdminOwnerRepository } from "../interfaces/admin.owner.interface";

export class AdminOwnerRepository implements IAdminOwnerRepository {
  async findByEmail(email: string) {
    return await Owner.findOne({ email });
  }

  async findByKycRequestId(requestId: string) {
    return await Owner.findOne({ kycRequestId: requestId });
  }

  async findById(id: string) {
    return await Owner.findById(id);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [owners, total] = await Promise.all([
      Owner.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Owner.countDocuments({})
    ]);

    return { owners, total };
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [owners, total] = await Promise.all([
      Owner.find({ 
        isActive: status === 'active'
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Owner.countDocuments({ 
        isActive: status === 'active'
      })
    ]);

    return { owners, total };
  }

  async create(data: any) {
    return await Owner.create(data);
  }

  async toggleStatus(id: string) {
    const owner = await Owner.findById(id);
    if (!owner) {
      throw new Error('Owner not found');
    }

    owner.isActive = !owner.isActive;
    return await owner.save();
  }

  async updateLastLogin(id: string) {
    return await Owner.findByIdAndUpdate(
      id, 
      { lastLogin: new Date() }, 
      { new: true }
    );
  }
}
