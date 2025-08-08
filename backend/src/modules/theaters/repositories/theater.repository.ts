import { ITheater, ITheaterRepository } from "../interfaces/theater.interface";
import { Theater } from "../models/theater.model";

export class TheaterRepository implements ITheaterRepository {
  async create(
    ownerId: string,
    theaterData: Partial<ITheater>
  ): Promise<ITheater | null> {
    if (!ownerId) {
      throw new Error("Owner ID is required");
    }

    // Proactive duplicate check
    const exists = await this.existsByNameAndCity(
      theaterData.name!,
      theaterData.city!,
      theaterData.state!
    );

    if (exists) {
      throw new Error("Theater with this name already exists in this city");
    }

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
    isActive?: string;
    isVerified?: string;
    city?: string;
    state?: string;
    search?: string;
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<{ theaters: ITheater[]; total: number }> {
  const query: any = { ownerId };

  if (filters?.isActive !== undefined) {
    query.isActive = filters.isActive === 'true';
  }
  if (filters?.isVerified !== undefined) {
    query.isVerified = filters.isVerified === 'true';
  }
  if (filters?.city) {
    query.city = new RegExp(filters.city, 'i');
  }
  if (filters?.state) {
    query.state = new RegExp(filters.state, 'i');
  }
  if (filters?.search) {
    query.$or = [
      { name: new RegExp(filters.search, 'i') },
      { address: new RegExp(filters.search, 'i') },
      { city: new RegExp(filters.search, 'i') },
    ];
  }

  const page = parseInt(filters?.page as string) || 1;
  const limit = parseInt(filters?.limit as string) || 10;
  const skip = (page - 1) * limit;

  const sortField = filters?.sortBy || 'createdAt';
  const sortOrder = filters?.sortOrder === 'desc' ? -1 : 1;
  const sortOptions: any = { [sortField]: sortOrder };

  const theaters = await Theater.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('ownerId', 'ownerName email');

  const total = await Theater.countDocuments(query);

  return { theaters, total };
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
    if (updateData.name || updateData.city || updateData.state) {
      const currentTheater = await Theater.findById(theaterId);
      if (!currentTheater) {
        throw new Error("Theater not found");
      }

      const exists = await this.existsByNameAndCity(
        updateData.name || currentTheater.name,
        updateData.city || currentTheater.city,
        updateData.state || currentTheater.state,
        theaterId
      );

      if (exists) {
        throw new Error("Theater with this name already exists in this city");
      }
    }

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
