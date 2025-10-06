import { IUser } from "../interfaces/user.model.interface";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { User } from "../models/user.model";

export class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("-password").exec();
  }

  async findByEmail(userEmail: string): Promise<IUser | null> {
    return User.findOne({ email: userEmail }).exec();
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).exec();
  }

  async findUserByIdWithPassword(userId: string): Promise<IUser | null> {
    return User.findById(userId).select("+password").exec();
  }

  async verifyUserEmail(userEmail: string): Promise<boolean> {
    const result = await User.updateOne(
      { email: userEmail },
      { isVerified: true }
    );
    return result.modifiedCount > 0;
  }

  async update(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    )
      .select("-password")
      .exec();
  }

  async updateUserLastActive(userId: string): Promise<boolean> {
    const result = await User.updateOne(
      { _id: userId },
      { lastActive: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async updatePassword(
    userId: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await User.updateOne(
      { _id: userId },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      }
    );
    return result.modifiedCount > 0;
  }

  async deactivateUser(userId: string): Promise<boolean> {
    const result = await User.updateOne({ _id: userId }, { isActive: false });
    return result.modifiedCount > 0;
  }

  async toggleStatus(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isActive = !user.isActive;
    return await user.save();
  }

  async addUserXpPoints(userId: string, points: number): Promise<boolean> {
    const result = await User.updateOne(
      { _id: userId },
      {
        $inc: { xpPoints: points },
        lastActive: new Date(),
      }
    );
    return result.modifiedCount > 0;
  }

  async findNearbyUsers(
    coordinates: [number, number],
    maxDistance: number
  ): Promise<IUser[]> {
    return User.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: maxDistance,
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

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const skipCount = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({})
        .select("-password")
        .sort({ joinedAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
    ]);

    return { users, total };
  }

  async findByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const skipCount = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({
        isActive: status === "active",
      })
        .select("-password")
        .sort({ joinedAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .lean(),
      User.countDocuments({
        isActive: status === "active",
      }),
    ]);

    return { users, total };
  }

  async findUsersByVerification(
    isVerified: boolean,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const skipCount = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ isVerified })
        .select("-password")
        .sort({ joinedAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .lean(),
      User.countDocuments({ isVerified }),
    ]);

    return { users, total };
  }

  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    return User.findOne({ googleId }).exec();
  }

  async findUserByGoogleIdOrEmail(
    googleId: string,
    email: string
  ): Promise<IUser | null> {
    return User.findOne({
      $or: [
        { googleId: googleId },
        { email: { $regex: `^${email}$`, $options: "i" } },
      ],
    }).exec();
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        refreshToken: hashedRefreshToken,
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async clearRefreshToken(userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
      updatedAt: new Date(),
    });
  }

  async createGoogleUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User({
      ...userData,
      authProvider: "google",
      isVerified: true,
      xpPoints: 100,
      joinedAt: new Date(),
      lastActive: new Date(),
      isActive: true,
    });
    return user.save();
  }

  async linkGoogleAccount(
    userId: string,
    googleId: string,
    googleData: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        googleId,
        name: googleData.firstName,
        avatar: googleData.avatar,
        lastActive: new Date(),
      },
      { new: true, runValidators: true }
    )
      .select("-password")
      .exec();
  }

  async updateUserFromGoogle(
    userId: string,
    googleData: Partial<IUser>
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        name: googleData.firstName,
        avatar: googleData.avatar,
        lastActive: new Date(),
        ...(googleData.isVerified && { isVerified: true }),
      },
      { new: true, runValidators: true }
    )
      .select("-password")
      .exec();
  }
}
