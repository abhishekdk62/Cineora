import { IOwnerRequest } from "../interfaces/owner.model.interface";
import { IOwnerRequestRepository } from "../interfaces/owner.repository.interface";
import { OwnerRequest } from "../models/ownerRequest.model";

export class OwnerRequestRepository implements IOwnerRequestRepository {
  async findByEmail(email: string): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findOne({ email });
    } catch (error) {
      throw new Error(`Error finding owner request by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByPhone(phone: string): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findOne({ phone });
    } catch (error) {
      throw new Error(`Error finding owner request by phone: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByAadhaar(aadhaar: string): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findOne({ aadhaar });
    } catch (error) {
      throw new Error(`Error finding owner request by Aadhaar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByPan(pan: string): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findOne({ pan });
    } catch (error) {
      throw new Error(`Error finding owner request by PAN: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findExistingNonRejected(data: {
    phone: string;
    email: string;
    aadhaar: string;
    pan: string;
  }): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findOne({
        status: { $ne: "rejected" },
        $or: [
          { phone: data.phone },
          { email: data.email },
          { aadhaar: data.aadhaar },
          { pan: data.pan },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding existing non-rejected request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: string): Promise<IOwnerRequest | null> {
    try {
      return await OwnerRequest.findById(id);
    } catch (error) {
      throw new Error(`Error finding owner request by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;

      let statusQuery: Record<string, unknown> = {};

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
          .skip(skipCount)
          .limit(limit)
          .lean() as Promise<IOwnerRequest[]>,
        OwnerRequest.countDocuments(statusQuery),
      ]);

      return { requests, total };
    } catch (error) {
      throw new Error(`Error finding owner requests by status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;

      const [requests, total] = await Promise.all([
        OwnerRequest.find({})
          .sort({ submittedAt: -1 })
          .skip(skipCount)
          .limit(limit)
          .lean() as Promise<IOwnerRequest[]>,
        OwnerRequest.countDocuments({}),
      ]);

      return { requests, total };
    } catch (error) {
      throw new Error(`Error finding all owner requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(data: Partial<IOwnerRequest>): Promise<IOwnerRequest> {
    try {
      const ownerRequest = new OwnerRequest({
        ...data,
        submittedAt: data.submittedAt || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedRequest = await ownerRequest.save();
      if (!savedRequest) {
        throw new Error("Failed to create owner request");
      }
      return savedRequest;
    } catch (error) {
      throw new Error(`Error creating owner request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateStatus(
    id: string,
    status: string,
    reviewedBy?: string,
    rejectionReason?: string
  ): Promise<IOwnerRequest | null> {
    try {
      const updateData: Record<string, unknown> = {
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

      const updatedRequest = await OwnerRequest.findByIdAndUpdate(id, updateData, { new: true });
      return updatedRequest;
    } catch (error) {
      throw new Error(`Error updating request status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(
    id: string,
    updateData: Partial<IOwnerRequest>
  ): Promise<IOwnerRequest | null> {
    try {
      const { _id, submittedAt, createdAt, ...safeUpdateData } = updateData as any;

      const updatedRequest = await OwnerRequest.findByIdAndUpdate(
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

      return updatedRequest;
    } catch (error) {
      throw new Error(`Error updating owner request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: string): Promise<IOwnerRequest | null> {
    try {
      const deletedRequest = await OwnerRequest.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true }
      );

      return deletedRequest;
    } catch (error) {
      throw new Error(`Error deleting owner request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchRequests(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;

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
          .skip(skipCount)
          .limit(limit)
          .lean() as Promise<IOwnerRequest[]>,
        OwnerRequest.countDocuments(searchQuery),
      ]);

      return { requests, total };
    } catch (error) {
      throw new Error(`Error searching owner requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRequestsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: IOwnerRequest[]; total: number }> {
    try {
      const skipCount = (page - 1) * limit;

      const dateQuery = {
        submittedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };

      const [requests, total] = await Promise.all([
        OwnerRequest.find(dateQuery)
          .sort({ submittedAt: -1 })
          .skip(skipCount)
          .limit(limit)
          .lean() as Promise<IOwnerRequest[]>,
        OwnerRequest.countDocuments(dateQuery),
      ]);

      return { requests, total };
    } catch (error) {
      throw new Error(`Error getting requests by date range: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
