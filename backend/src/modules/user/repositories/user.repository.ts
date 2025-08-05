import { User, IUser } from '../models/user.model';
import { IUserRepository } from '../interfaces/user.interface';

export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password').exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).exec();
  }

  async verifyEmail(email: string): Promise<boolean> {
    const result = await User.updateOne(
      { email },
      { isVerified: true }
    );
    return result.modifiedCount > 0;
  }

  async updateProfile(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    ).select('-password').exec();
  }

  async updateLastActive(id: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { lastActive: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async deactivateUser(id: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { isActive: false }
    );
    return result.modifiedCount > 0;
  }

  async findNearbyUsers(coordinates: [number, number], maxDistance: number): Promise<IUser[]> {
    return User.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance // in meters
        }
      },
      isActive: true,
      isVerified: true
    }).select('-password').limit(50).exec();
  }

  async findActiveUsers(limit: number = 20): Promise<IUser[]> {
    return User.find({
      isActive: true,
      isVerified: true
    })
    .sort({ lastActive: -1 })
    .limit(limit)
    .select('-password')
    .exec();
  }

  async addXpPoints(id: string, points: number): Promise<boolean> {
    const result = await User.updateOne(
      { _id: id },
      { 
        $inc: { xpPoints: points },
        lastActive: new Date()
      }
    );
    return result.modifiedCount > 0;
  }
}
