import { IOwner } from "../interfaces/owner.model.interface";
import { IOwnerRepository } from "../interfaces/owner.repository.interface";
import { Owner } from "../models/owner.model";

export class OwnerRepository implements IOwnerRepository {
  async findByEmail(ownerEmail: string): Promise<IOwner | null> {
    try {
      return await Owner.findOne({ email: ownerEmail });
    } catch (error) {
      throw new Error(`Error finding owner by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByKycRequestId(kycRequestId: string): Promise<IOwner | null> {
    try {
      return await Owner.findOne({ kycRequestId });
    } catch (error) {
      throw new Error(`Error finding owner by KYC request ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(ownerId: string): Promise<IOwner | null> {
    try {
      return await Owner.findById(ownerId);
    } catch (error) {
      throw new Error(`Error finding owner by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ owners: IOwner[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;

      const [owners, total] = await Promise.all([
        Owner.find({}).sort({ createdAt: -1 }).skip(skipCount).limit(limit).lean() as Promise<IOwner[]>,
        Owner.countDocuments({}),
      ]);

      return { owners, total };
    } catch (error) {
      throw new Error(`Error finding all owners: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<{ owners: IOwner[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;
      const query = this._buildStatusQuery(status);

      const [owners, total] = await Promise.all([
        Owner.find(query).sort({ createdAt: -1 }).skip(skipCount).limit(limit).lean() as Promise<IOwner[]>,
        Owner.countDocuments(query),
      ]);

      return { owners, total };
    } catch (error) {
      throw new Error(`Error finding owners by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByPhone(phoneNumber: string): Promise<IOwner | null> {
    try {
      return await Owner.findOne({ phone: phoneNumber });
    } catch (error) {
      throw new Error(`Error finding owner by phone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByPan(panNumber: string): Promise<IOwner | null> {
    try {
      return await Owner.findOne({ pan: panNumber });
    } catch (error) {
      throw new Error(`Error finding owner by PAN: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByAadhaar(aadhaarNumber: string): Promise<IOwner | null> {
    try {
      return await Owner.findOne({ aadhaar: aadhaarNumber });
    } catch (error) {
      throw new Error(`Error finding owner by Aadhaar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchOwners(searchTerm: string, page: number = 1, limit: number = 10): Promise<{ owners: IOwner[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;
      const searchQuery = this._buildSearchQuery(searchTerm);

      const [owners, total] = await Promise.all([
        Owner.find(searchQuery).sort({ createdAt: -1 }).skip(skipCount).limit(limit).lean() as Promise<IOwner[]>,
        Owner.countDocuments(searchQuery),
      ]);

      return { owners, total };
    } catch (error) {
      throw new Error(`Error searching owners: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOwnerStats(ownerId: string): Promise<IOwner | null> {
    try {
      return await Owner.findById(ownerId)
        .populate("theatres")
        .select("ownerName email phone theatres isActive isVerified createdAt");
    } catch (error) {
      throw new Error(`Error getting owner stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(data: Partial<IOwner>): Promise<IOwner> {
    try {
      const owner = new Owner({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedOwner = await owner.save();
      if (!savedOwner) {
        throw new Error("Failed to create owner");
      }
      return savedOwner;
    } catch (error) {
      throw new Error(`Error creating owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(ownerId: string, updateData: Partial<IOwner>): Promise<IOwner | null> {
    try {
      const { _id, createdAt, password, kycRequestId, ...safeUpdateData } = updateData;

      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          ...safeUpdateData,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error updating owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateRefreshToken(ownerId: string, hashedRefreshToken: string): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          refreshToken: hashedRefreshToken,
          updatedAt: new Date(),
        },
        { new: true }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error updating refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async clearRefreshToken(ownerId: string): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId, 
        {
          $unset: { refreshToken: 1 },
          updatedAt: new Date(),
        },
        { new: true }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error clearing refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLastLogin(ownerId: string): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
        { new: true }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error updating last login: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePassword(ownerId: string, hashedPassword: string): Promise<boolean> {
    try {
      const result = await Owner.updateOne(
        { _id: ownerId },
        {
          password: hashedPassword,
          updatedAt: new Date(),
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      throw new Error(`Error updating password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateProfile(ownerId: string, profileData: Partial<IOwner>): Promise<IOwner | null> {
    try {
      const allowedUpdates = [
        "ownerName",
        "phone",
        "email",
        "accountHolder",
        "bankName",
        "accountNumber",
        "ifsc",
        "ownerPhotoUrl",
      ];

      const filteredData = Object.keys(profileData)
        .filter((key) => allowedUpdates.includes(key))
        .reduce((obj: Record<string, unknown>, key) => {
          obj[key] = profileData[key as keyof Partial<IOwner>];
          return obj;
        }, {});

      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          ...filteredData,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error updating owner profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleStatus(ownerId: string): Promise<IOwner | null> {
    try {
      const owner = await Owner.findById(ownerId);
      if (!owner) {
        throw new Error("Owner not found");
      }

      owner.isActive = !owner.isActive;
      owner.updatedAt = new Date();
      const savedOwner = await owner.save();
      return savedOwner;
    } catch (error) {
      throw new Error(`Error toggling owner status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(ownerId: string): Promise<IOwner | null> {
    try {
      const deletedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          isActive: false,
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true }
      );

      return deletedOwner;
    } catch (error) {
      throw new Error(`Error deleting owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async addTheatre(ownerId: string, theatreId: string): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          $addToSet: { theatres: theatreId },
          updatedAt: new Date(),
        },
        { new: true }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error adding theatre to owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeTheatre(ownerId: string, theatreId: string): Promise<IOwner | null> {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        ownerId,
        {
          $pull: { theatres: theatreId },
          updatedAt: new Date(),
        },
        { new: true }
      );

      return updatedOwner;
    } catch (error) {
      throw new Error(`Error removing theatre from owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkUpdateStatus(ownerIds: string[], isActive: boolean): Promise<{ modifiedCount: number }> {
    try {
      return await Owner.updateMany(
        { _id: { $in: ownerIds } },
        {
          isActive,
          updatedAt: new Date(),
        }
      );
    } catch (error) {
      throw new Error(`Error bulk updating owner status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private _buildStatusQuery(status: string): Record<string, unknown> {
    switch (status) {
      case "active":
        return { isActive: true };
      case "inactive":
      case "blocked":
        return { isActive: false };
      case "verified":
        return { isVerified: true };
      case "unverified":
        return { isVerified: false };
      default:
        return {};
    }
  }

  private _buildSearchQuery(searchTerm: string): Record<string, unknown> {
    return {
      $or: [
        { ownerName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ],
    };
  }
}
