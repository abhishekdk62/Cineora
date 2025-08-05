import { User } from "../../user/models/user.model";

export class AdminUserRepository {
  async findById(id: string) {
    return await User.findById(id).select('-password');
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find({})
        .select('-password')
        .sort({ joinedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({})
    ]);

    return { users, total };
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find({ 
        isActive: status === 'active'
      })
        .select('-password')
        .sort({ joinedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({ 
        isActive: status === 'active'
      })
    ]);

    return { users, total };
  }

  async findByVerification(isVerified: boolean, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find({ isVerified })
        .select('-password')
        .sort({ joinedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({ isVerified })
    ]);

    return { users, total };
  }

  async toggleStatus(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = !user.isActive;
    return await user.save();
  }
}
