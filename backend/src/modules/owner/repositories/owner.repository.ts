import { IOwnerRepository } from "../interfaces/owner.interface";
import { Owner } from "../models/owner.model";



export class OwnerRepository implements IOwnerRepository {
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
    
    // Enhanced to handle different status types
    let query: any = {};
    
    if (status === 'active') {
      query = { isActive: true };
    } else if (status === 'inactive' || status === 'blocked') {
      query = { isActive: false };
    } else if (status === 'verified') {
      query = { isVerified: true };
    } else if (status === 'unverified') {
      query = { isVerified: false };
    }
    
    const [owners, total] = await Promise.all([
      Owner.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Owner.countDocuments(query)
    ]);

    return { owners, total };
  }

  async create(data: any) {
    const owner = new Owner({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await owner.save();
  }

  async toggleStatus(id: string) {
    const owner = await Owner.findById(id);
    if (!owner) {
      throw new Error('Owner not found');
    }

    owner.isActive = !owner.isActive;
    owner.updatedAt = new Date();
    return await owner.save();
  }

  async updateLastLogin(id: string) {
    return await Owner.findByIdAndUpdate(
      id, 
      { 
        lastLogin: new Date(),
        updatedAt: new Date()
      }, 
      { new: true }
    );
  }

  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    const result = await Owner.updateOne(
      { _id: id },
      {
        password: hashedPassword,
        updatedAt: new Date(),
      }
    );
    return result.modifiedCount > 0;
  }

  async update(id: string, updateData: any): Promise<any> {
    const { _id, createdAt, password, kycRequestId, ...safeUpdateData } = updateData;
    
    return await Owner.findByIdAndUpdate(
      id,
      {
        ...safeUpdateData,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true 
      }
    );
  }

  async delete(id: string): Promise<any> {
    return await Owner.findByIdAndUpdate(
      id,
      {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );


  }


  async findByPhone(phone: string) {
    return await Owner.findOne({ phone });
  }

  async findByPan(pan: string) {
    return await Owner.findOne({ pan });
  }

  async findByAadhaar(aadhaar: string) {
    return await Owner.findOne({ aadhaar });
  }

  async updateProfile(id: string, profileData: any): Promise<any> {
    const allowedUpdates = [
      'ownerName', 'phone', 'accountHolder', 'bankName', 
      'accountNumber', 'ifsc', 'ownerPhotoUrl'
    ];
    
    const filteredData = Object.keys(profileData)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = profileData[key];
        return obj;
      }, {});

    return await Owner.findByIdAndUpdate(
      id,
      {
        ...filteredData,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true 
      }
    );
  }

  async addTheatre(ownerId: string, theatreId: string): Promise<any> {
    return await Owner.findByIdAndUpdate(
      ownerId,
      { 
        $addToSet: { theatres: theatreId },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async removeTheatre(ownerId: string, theatreId: string): Promise<any> {
    return await Owner.findByIdAndUpdate(
      ownerId,
      { 
        $pull: { theatres: theatreId },
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async searchOwners(searchTerm: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const searchQuery = {
      $or: [
        { ownerName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const [owners, total] = await Promise.all([
      Owner.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Owner.countDocuments(searchQuery)
    ]);

    return { owners, total };
  }

  async getOwnerStats(ownerId: string): Promise<any> {
    return await Owner.findById(ownerId)
      .populate('theatres')
      .select('ownerName email phone theatres isActive isVerified createdAt');
  }

  async bulkUpdateStatus(ownerIds: string[], isActive: boolean): Promise<any> {
    return await Owner.updateMany(
      { _id: { $in: ownerIds } },
      { 
        isActive,
        updatedAt: new Date()
      }
    );
  }
}
