import { ITheater, ITheaterRepository } from "../interfaces/theater.interface";
import { Theater } from "../models/theater.model";

export class TheaterRepository implements ITheaterRepository {
  async create(
    ownerId: string,
    theaterData: Partial<ITheater>
  ): Promise<ITheater | null> {
      const theater = new Theater({ ...theaterData, ownerId });
    return await theater.save();
  }

  async findById(theaterId: string): Promise<ITheater | null> {
    return await Theater.findById(theaterId).populate(
      "ownerId",
      "ownerName email"
    );
  }

  async findByOwnerId(
    ownerId: string,
    filters?: {
      status: string;
      isActive?: string;
      isVerified?: string;
      city?: string;
      state?: string;
      search?: string;
      page?: string | number;
      limit?: string | number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{
    theaters: ITheater[];
    totalFiltered: number;
    inactiveAll: number;
    activeAll: number;
    totalAll: number;
  }> {
    const query: any = { ownerId };

    if (filters?.status === "active") {
      query.isActive = true;
    } else if (filters?.status === "inactive") {
      query.isActive = false;
    }

    if (filters?.isVerified !== undefined) {
      query.isVerified = filters.isVerified === "true";
    }
    if (filters?.city) {
      query.city = new RegExp(filters.city, "i");
    }
    if (filters?.state) {
      query.state = new RegExp(filters.state, "i");
    }
    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { address: new RegExp(filters.search, "i") },
        { city: new RegExp(filters.search, "i") },
      ];
    }

    const page = parseInt(filters?.page as string) || 1;
    const limit = parseInt(filters?.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sortField = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder === "desc" ? -1 : 1;
    const sortOptions: any = { [sortField]: sortOrder };

    const theaters = await Theater.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "ownerName email");

    const totalFiltered = await Theater.countDocuments(query);
    const [totalAll, activeAll, inactiveAll] = await Promise.all([
      Theater.countDocuments({ ownerId }),
      Theater.countDocuments({ ownerId, isActive: true }),
      Theater.countDocuments({ ownerId, isActive: false }),
    ]);

    return { theaters, totalFiltered,activeAll,inactiveAll,totalAll };
  }
async incrementScreenCount(theaterId: any): Promise<void> {
  try {
    
    await Theater.findByIdAndUpdate(
      theaterId,
      { $inc: { screens: 1 } }, // Increment by 1
      { new: true }
    );
  } catch (error) {
    console.error("Error incrementing screen count:", error);
    throw error;
  }
}

async decrementScreenCount(theaterId: any): Promise<void> {
  try {
    await Theater.findByIdAndUpdate(
      theaterId,
      { $inc: { screens: -1 } }, // Decrement by 1
      { new: true }
    );
  } catch (error) {
    console.error("Error decrementing screen count:", error);
    throw error;
  }
}

  private applyFilters(query: any, filters?: any): void {
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive === "true";
    }
    if (filters?.isVerified !== undefined) {
      query.isVerified = filters.isVerified === "true";
    }
    if (filters?.city) {
      query.city = new RegExp(filters.city, "i");
    }
    if (filters?.state) {
      query.state = new RegExp(filters.state, "i");
    }
    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { address: new RegExp(filters.search, "i") },
        { city: new RegExp(filters.search, "i") },
      ];
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ theaters: ITheater[]; total: number }> {
    const query: any = {};

    this.applyFilters(query, filters);

    const skip = (page - 1) * limit;
    const sortOptions = this.getSortOptions(filters);

    const theaters = await Theater.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "ownerName email phone");

    const total = await Theater.countDocuments(query);

    return { theaters, total };
  }

  async findByFilters(
    filters: any,
    page: number,
    limit: number
  ): Promise<{ theaters: ITheater[]; total: number }> {
    return this.findAll(page, limit, filters);
  }

  async update(
    theaterId: string,
    updateData: Partial<ITheater>
  ): Promise<ITheater | null> {
   
    return await Theater.findByIdAndUpdate(
      theaterId,
      { $set: updateData },
      { new: true }
    ).populate("ownerId", "ownerName email");
  }

  async toggleStatus(theaterId: string): Promise<ITheater | null> {
    const theater = await Theater.findById(theaterId);
    if (!theater) return null;

    theater.isActive = !theater.isActive;
    return await theater.save();
  }

  async verifyTheater(theaterId: string): Promise<ITheater | null> {
    const theater = await Theater.findById(theaterId);
    if (!theater) return null;

    theater.isVerified = true;
    return await theater.save();
  }
  async rejectTheater(theaterId: string): Promise<ITheater | null> {
    const theater = await Theater.findById(theaterId);
    if (!theater) return null;

    theater.isRejected = true;
    return await theater.save();
  }

  async delete(theaterId: string): Promise<boolean> {
    const result = await Theater.findByIdAndDelete(theaterId);
    return !!result;
  }

  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ITheater[]> {
    return await Theater.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
      isActive: true,
      isVerified: true,
    }).populate("ownerId", "ownerName email");
  }

  async existsByNameAndCity(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<boolean> {
    const query: any = {
      name: new RegExp(`^${name.trim()}$`, "i"),
      city: new RegExp(`^${city.trim()}$`, "i"),
      state: new RegExp(`^${state.trim()}$`, "i"),
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const theater = await Theater.findOne(query);
    return !!theater;
  }

  async findByOwnerIdAndName(
    ownerId: string,
    name: string
  ): Promise<ITheater | null> {
    return await Theater.findOne({
      ownerId,
      name: new RegExp(`^${name}$`, "i"),
    }).populate("ownerId", "ownerName email");
  }

  private getSortOptions(filters?: any): any {
    if (filters?.sortBy) {
      const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
      return { [filters.sortBy]: sortOrder };
    }
    return { createdAt: -1 };
  }
}
