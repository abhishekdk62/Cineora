import { OwnerRequest } from "../models/ownerRequest.model";

export class OwnerRequestRepository {
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
    
    const [requests, total] = await Promise.all([
      OwnerRequest.find({ status })
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OwnerRequest.countDocuments({ status })
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
    return await OwnerRequest.create(data);
  }

  async updateStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string) {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
    };

    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    return await OwnerRequest.findByIdAndUpdate(id, updateData, { new: true });
  }
}
