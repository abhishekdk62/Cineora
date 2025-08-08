import { ITheater, ITheaterRepository } from "../interfaces/theater.interface";
import { Theater } from "../models/theater.model";

export class TheaterRepository implements ITheaterRepository {
  async create(theaterData: Partial<ITheater>): Promise<ITheater | null> {
    try {
      if (!theaterData.ownerId) {
        throw new Error("Owner ID is required");
      }
      const theater = new Theater(theaterData);
      return await theater.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Theater with this name already exists in this city");
      }
      throw error;
    }
  }

  async findById(theaterId: string): Promise<ITheater | null> {
    const theater = await Theater.findById(theaterId).populate(
      "ownerId",
      "ownerName email"
    );
    return theater;
  }

  async findByOwnerId(
    ownerId: string,
    filters?: any
  ): Promise<{ theaters: ITheater[]; total: number }> {
    const query: any = { ownerId };
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive === "true";
    }
    if (filters?.isVerified !== undefined) {
      query.isVerified = filters.isVerified === "true";
    }
    if (filters?.city) {
      query.city = new RegExp(filters.city, "i");
    }
    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { address: new RegExp(filters.search, "i") },
        { city: new RegExp(filters.search, "i") },
      ];
    }

    const page = parseInt(filters?.page) || 1;
    const limit = parseInt(filters?.limit) || 10;
    const skip = (page - 1) * limit;

    let sortOptions: any = { createdAt: -1 };
    if (filters?.sortBy) {
      const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
      sortOptions = { [filters.sortBy]: sortOrder };
    }

    const theaters = await Theater.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "ownerName email");

    const total = await Theater.countDocuments(query);

    return { theaters, total };
  }

  async findAll(
    page: number,
    limit: number,
    filters?: any
  ): Promise<{ theaters: ITheater[]; total: number }> {
    const query: any = {};
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

    const skip = (page - 1) * limit;

    let sortOptions: any = { createdAt: -1 };
    if (filters?.sortBy) {
      const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
      sortOptions = { [filters.sortBy]: sortOrder };
    }

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
    try {
      return await Theater.findByIdAndUpdate(
        theaterId,
        { $set: updateData },
        { new: true }
      ).populate("ownerId", "ownerName email");
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Theater with this name already exists in this city");
      }
      throw error;
    }
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

  async delete(theaterId: string): Promise<boolean> {
    const result = await Theater.findByIdAndDelete(theaterId);
    return !!result;
  }

  async findNearby(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ITheater[]> {
    const theaters = await Theater.find({
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
    return theaters;
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
}
