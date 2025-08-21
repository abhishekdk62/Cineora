import { IOwnerRequest } from "../interfaces/owner.model.interface";
import { IOwnerRequestRepository } from "../interfaces/owner.repository.interface";
import {  Owner } from "../models/owner.model";
import {  OwnerRequest } from "../models/ownerRequest.model";

export class OwnerRequestRepository implements IOwnerRequestRepository {
  async findByEmail(email: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findOne({ email });
  }

  async findByPhone(phone: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findOne({ phone });
  }

  async findByAadhaar(aadhaar: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findOne({ aadhaar });
  }

  async findByPan(pan: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findOne({ pan });
  }

  async findExistingNonRejected(data: {
    phone: string;
    email: string;
    aadhaar: string;
    pan: string;
  }): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findOne({
      status: { $ne: "rejected" },
      $or: [
        { phone: data.phone },
        { email: data.email },
        { aadhaar: data.aadhaar },
        { pan: data.pan },
      ],
    });
  }

  async findById(id: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findById(id);
  }

  async findByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    const skip = (page - 1) * limit;

    let statusQuery: any = {};

    if (status === "all") {
      statusQuery = {};
    } else if (status.includes(",")) {
      const statuses = status.split(",").map((s) => s.trim());
      statusQuery = { status: { $in: statuses } };
    } else {
      statusQuery = { status };
    }

    const [requests, total] = await Promise.all([
      OwnerRequest.find(statusQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IOwnerRequest[]>,,
      OwnerRequest.countDocuments(statusQuery),
    ]);

    return { requests, total };
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      OwnerRequest.find({})
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IOwnerRequest[]>,,
      OwnerRequest.countDocuments({}),
    ]);

    return { requests, total };
  }

  async create(data: Partial<IOwnerRequest>): Promise<IOwnerRequest> {
    const ownerRequest = new OwnerRequest({
      ...data,
      submittedAt: data.submittedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await ownerRequest.save();
  }

  async updateStatus(
    id: string,
    status: string,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<IOwnerRequest | null> {
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    };

    if (reviewedBy) {
      updateData.reviewedBy = reviewedBy;
    }

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    if (status === "approved") {
      updateData.approvedAt = new Date();
    } else if (status === "rejected") {
      updateData.rejectedAt = new Date();
    }

    return await OwnerRequest.findByIdAndUpdate(id, updateData, { new: true });
  }

  async update(
    id: string,
    updateData: Partial<IOwnerRequest>
  ): Promise<IOwnerRequest | null> {
    const { _id, submittedAt, createdAt, ...safeUpdateData } =
      updateData as any;

    return await OwnerRequest.findByIdAndUpdate(
      id,
      {
        ...safeUpdateData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(id: string): Promise<IOwnerRequest | null> {
    return await OwnerRequest.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );
  }

  async searchRequests(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { ownerName: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
        { aadhaar: { $regex: searchTerm, $options: "i" } },
        { pan: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const [requests, total] = await Promise.all([
      OwnerRequest.find(searchQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IOwnerRequest[]>,,
      OwnerRequest.countDocuments(searchQuery),
    ]);

    return { requests, total };
  }

  async getRequestsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    const skip = (page - 1) * limit;

    const dateQuery = {
      submittedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const [requests, total] = await Promise.all([
      OwnerRequest.find(dateQuery)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as Promise<IOwnerRequest[]>,,
      OwnerRequest.countDocuments(dateQuery),
    ]);

    return { requests, total };
  }
}
