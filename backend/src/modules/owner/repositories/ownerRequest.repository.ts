import { IOwnerRequestRepository } from "../interfaces/owner.interface";
import { Owner } from "../models/owner.model";
import { OwnerRequest } from "../models/ownerRequest.model";



export class OwnerRequestRepository implements IOwnerRequestRepository {
  async findByEmail(email: string) {
    return await OwnerRequest.findOne({ email });
  }

  async findByPhone(phone: string) {
    return await OwnerRequest.findOne({ phone });
  }




  async findByAadhaar(aadhaar: string) {
    return await OwnerRequest.findOne({ aadhaar });
  }

  async findByPan(pan: string) {
    return await OwnerRequest.findOne({ pan });
  }

  async findExistingNonRejected(data: { 
    phone: string; 
    email: string; 
    aadhaar: string; 
    pan: string 
  }) {
    return await OwnerRequest.findOne({
      status: { $ne: "rejected" },
      $or: [
        { phone: data.phone },
        { email: data.email },
        { aadhaar: data.aadhaar },
        { pan: data.pan }
      ]
    });
  }

  async findById(id: string) {
    return await OwnerRequest.findById(id);
  }

  async findByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    let statusQuery: any = {};
    
    if (status === 'all') {
      statusQuery = {};
    } else if (status.includes(',')) {
      const statuses = status.split(',').map(s => s.trim());
      statusQuery = { status: { $in: statuses } };
    } else {
      statusQuery = { status };
    }
    
    const [requests, total] = await Promise.all([
      OwnerRequest.find(statusQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments(statusQuery)
    ]);

    return { requests, total };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [requests, total] = await Promise.all([
      OwnerRequest.find({})
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments({})
    ]);

    return { requests, total };
  }

  async create(data: any) {
    const ownerRequest = new OwnerRequest({
      ...data,
      submittedAt: data.submittedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return await ownerRequest.save();
  }

  async updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string) {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };

    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
    }

    return await OwnerRequest.findByIdAndUpdate(id, updateData, { new: true });
  }

  async update(id: string, updateData: any): Promise<any> {
    const { _id, submittedAt, createdAt, ...safeUpdateData } = updateData;
    
    return await OwnerRequest.findByIdAndUpdate(
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
    return await OwnerRequest.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

  }

  async searchRequests(searchTerm: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const searchQuery = {
      $or: [
        { ownerName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
        { aadhaar: { $regex: searchTerm, $options: 'i' } },
        { pan: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    const [requests, total] = await Promise.all([
      OwnerRequest.find(searchQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments(searchQuery)
    ]);

    return { requests, total };
  }

  async getRequestsByDateRange(startDate: Date, endDate: Date, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const dateQuery = {
      submittedAt: {
        $gte: startDate,
        $lte: endDate
      }
    };

    const [requests, total] = await Promise.all([
      OwnerRequest.find(dateQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments(dateQuery)
    ]);

    return { requests, total };
  }

  async bulkUpdateStatus(requestIds: string[], status: string, reviewedBy?: string): Promise<any> {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date()
    };

    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
    }

    return await OwnerRequest.updateMany(
      { _id: { $in: requestIds } },
      updateData
    );
  }


  async getRequestStats() {
    const stats = await OwnerRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRequests = await OwnerRequest.countDocuments({});

    return {
      totalRequests,
      statusBreakdown: stats.reduce((acc: any, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  }

  async findDuplicateRequests(field: 'email' | 'phone' | 'aadhaar' | 'pan', value: string) {
    return await OwnerRequest.find({ [field]: value })
      .sort({ submittedAt: -1 });
  }

  async getPendingRequestsOlderThan(days: number) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await OwnerRequest.find({
      status: 'pending',
      submittedAt: { $lt: cutoffDate }
    }).sort({ submittedAt: 1 });
  }

  async getRequestsByReviewer(reviewerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      OwnerRequest.find({ reviewedBy: reviewerId })
        .sort({ reviewedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments({ reviewedBy: reviewerId })
    ]);

    return { requests, total };
  }

  async updateEmailVerification(id: string, isVerified: boolean) {
    return await OwnerRequest.findByIdAndUpdate(
      id,
      {
        emailVerified: isVerified,
        emailVerifiedAt: isVerified ? new Date() : null,
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async addNotes(id: string, notes: string, addedBy: string) {
    return await OwnerRequest.findByIdAndUpdate(
      id,
      {
        $push: {
          notes: {
            content: notes,
            addedBy,
            addedAt: new Date()
          }
        },
        updatedAt: new Date()
      },
      { new: true }
    );
  }
}
