import { IUserRepository } from "../interfaces/user.interface";
import { User, IUser } from "../models/user.model";


export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select("-password").exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).exec();
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return User.findById(id).select("+password").exec();
  }

  // ✅ User profile methods
  async verifyEmail(email: string): Promise<boolean> {
    const result = await User.updateOne({ email }, { isVerified: true });
    return result.modifiedCount > 0;
  }

  async updateProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    )
      .select("-password")
      .exec();
  }

  async updateLastActive(id: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { lastActive: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      }
    );
    return result.modifiedCount > 0;
  }

  // ✅ User management methods
  async deactivateUser(id: string): Promise<boolean> {
    const result = await User.updateOne({ _id: id }, { isActive: false });
    return result.modifiedCount > 0;
  }

  async toggleStatus(id: string): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.isActive = !user.isActive;
    return await user.save();
  }

  async addXpPoints(id: string, points: number): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      {
        $inc: { xpPoints: points },
        lastActive: new Date(),
      }
    );
    return result.modifiedCount > 0;
  }

  // ✅ User discovery methods
  async findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]> {
    return User.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: maxDistance, // in meters
        },
      },
      isActive: true,
      isVerified: true,
    })
      .select("-password")
      .limit(50)
      .exec();
  }

  async findActiveUsers(limit: number = 20): Promise<IUser[]> {
    return User.find({
      isActive: true,
      isVerified: true,
    })
      .sort({ lastActive: -1 })
      .limit(limit)
      .select("-password")
      .exec();
  }

  // ✅ Admin-related methods (but operate on User schema)
  async findAll(page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
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

  async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
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

  async findByVerification(isVerified: boolean, page: number = 1, limit: number = 10): Promise<{ users: IUser[], total: number }> {
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
}
