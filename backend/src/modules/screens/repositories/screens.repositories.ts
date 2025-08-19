import { IScreen, IScreenRepository } from "../interfaces/screens.interface";
import { Screen } from "../models/screens.model";  

import { Types } from "mongoose";

export class ScreenRepository implements IScreenRepository {
  async create(screenData: Partial<IScreen>): Promise<IScreen | null> {
    
    
    const screen = new Screen(screenData);
    return screen.save();
  }
async deleteMany(theaterId: string): Promise<number> {
  const res = await Screen.deleteMany({ theaterId });
  return res.deletedCount || 0;
}

  async findById(screenId: string): Promise<IScreen | null> {
    return Screen.findById(screenId).populate("theaterId", "name city state");
  }

  async findByTheaterId(theaterId: string): Promise<IScreen[]> {
    return Screen.find({ theaterId: new Types.ObjectId(theaterId) }).populate(
      "theaterId",
      "name city state"
    );
  }

async findAll(
  page: number,
  limit: number,
  filters?: any
): Promise<{ 
  screens: IScreen[]; 
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}> {
  const query: any = {};
  this.applyFilters(query, filters);

  const skip = (page - 1) * limit;
  const sortOptions = this.getSortOptions(filters);

  const screens = await Screen.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate("theaterId", "name city state");

  const total = await Screen.countDocuments(query);

  const totalPages = Math.ceil(total / limit);

  return { 
    screens,
    total,
    currentPage: page,
    totalPages,
    pageSize: limit
  };
}

async findByIdGetTheaterDetails(screenId: string): Promise<IScreen> {
  return await Screen.findById(screenId).populate('theaterId','name isActive')
}
  async findByTheaterIdWithFilters(
    theaterId: string,
    filters?: {
      isActive?: boolean;
      screenType?: string;
      search?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<{
    screens: IScreen[];
    totalFiltered: number;
    activeAll: number;
    inactiveAll: number;
    totalAll: number;
  }> {
    const theaterObjId = new Types.ObjectId(theaterId);
    const query: any = { theaterId: theaterObjId };

    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    if (filters?.screenType)
      query.screenType = { $exists: true, $regex: new RegExp(filters.screenType, "i") };

    if (filters?.search)
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { screenType: { $exists: true, $regex: new RegExp(filters.search, "i") } },
      ];

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const sortField = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder === "desc" ? -1 : 1;
    const sortOptions: any = { [sortField]: sortOrder };

    const screens = await Screen.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("theaterId", "name city state");

    const totalFiltered = await Screen.countDocuments(query);

    const [totalAll, activeAll, inactiveAll] = await Promise.all([
      Screen.countDocuments({ theaterId: theaterObjId }),
      Screen.countDocuments({ theaterId: theaterObjId, isActive: true }),
      Screen.countDocuments({ theaterId: theaterObjId, isActive: false }),
    ]);

    return { screens, totalFiltered, activeAll, inactiveAll, totalAll };
  }

  async update(
    screenId: string,
    updateData: Partial<IScreen>
  ): Promise<IScreen | null> {
    if (updateData.theaterId && typeof updateData.theaterId === "string") {
      updateData.theaterId = new Types.ObjectId(updateData.theaterId) as any;
    }

    return Screen.findByIdAndUpdate(screenId, { $set: updateData }, { new: true, runValidators: true }).populate(
      "theaterId",
      "name city state"
    );
  }

  async toggleStatus(screenId: string): Promise<IScreen | null> {
    const screen = await Screen.findById(screenId);
    if (!screen) return null;
    screen.isActive = !screen.isActive;
    return screen.save();
  }

  async delete(screenId: string): Promise<IScreen> {
    const result = await Screen.findByIdAndDelete(screenId);
    return result;
  }

  async existsByNameAndTheater(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<boolean> {
    const query: any = {
      name: new RegExp(`^${name.trim()}$`, "i"),
      theaterId: new Types.ObjectId(theaterId),
    };
    if (excludedId) query._id = { $ne: excludedId };
    return !!(await Screen.findOne(query));
  }

  async findByTheaterIdAndName(
    theaterId: string,
    name: string
  ): Promise<IScreen | null> {
    return Screen.findOne({
      theaterId: new Types.ObjectId(theaterId),
      name: new RegExp(`^${name}$`, "i"),
    }).populate("theaterId", "name city state");
  }

  async countByTheaterId(theaterId: string): Promise<number> {
    return Screen.countDocuments({ theaterId: new Types.ObjectId(theaterId) });
  }

  async findActiveByTheaterId(theaterId: string): Promise<IScreen[]> {
    return Screen.find({ theaterId: new Types.ObjectId(theaterId), isActive: true }).populate(
      "theaterId",
      "name city state"
    );
  }

  /* ---------- Helpers ---------- */

  private applyFilters(query: any, filters?: any): void {
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;

    if (filters?.screenType)
      query.screenType = { $exists: true, $regex: new RegExp(filters.screenType, "i") };

    if (filters?.theaterId) query.theaterId = new Types.ObjectId(filters.theaterId);

    if (filters?.search)
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { screenType: { $exists: true, $regex: new RegExp(filters.search, "i") } },
      ];
  }

  private getSortOptions(filters?: any): any {
    if (filters?.sortBy) return { [filters.sortBy]: filters.sortOrder === "asc" ? 1 : -1 };
    return { createdAt: -1 };
  }
}
