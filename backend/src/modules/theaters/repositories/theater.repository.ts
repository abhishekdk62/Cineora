import { PipelineOptions } from "stream";
import { TheaterFilters, CreateTheaterDTO, UpdateTheaterDTO } from "../dtos/dto";
import { ITheater } from "../interfaces/theater.model.interface";
import { ITheaterReadRepository, ITheaterWriteRepository, ITheaterRepository } from "../interfaces/theater.repository.interface";
import { Theater } from "../models/theater.model";
import { FilterQuery } from "mongoose";
import { TheaterInfoDto } from "../../chatroom/dtos/dto";

export class TheaterRepository implements ITheaterRepository {
  async create(
    ownerId: string,
    theaterData: CreateTheaterDTO
  ): Promise<ITheater> {
    try {
      const theater = new Theater({ ...theaterData, ownerId });
      const savedTheater = await theater.save();
      if (!savedTheater) {
        throw new Error("Failed to create theater");
      }
      return savedTheater;
    } catch (error) {
      console.error("Error creating theater:", error);
      throw error;
    }
  }

  async findById(theaterId: string): Promise<ITheater | null> {
    try {
      return await Theater.findById(theaterId).populate("ownerId", "ownerName email");
    } catch (error) {
      console.error("Error finding theater by id:", error);
      throw error;
    }
  }

  async getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<{
    theaters: ITheater[];
    totalFiltered: number;
    inactiveAll: number;
    activeAll: number;
    totalAll: number;
  }> {
    try {
      const query: FilterQuery = { ownerId };

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
      const skipCount = (page - 1) * limit;

      const sortField = filters?.sortBy || "createdAt";
      const sortOrder = filters?.sortOrder === "desc" ? -1 : 1;
      const sortOptions: FilterQuery = { [sortField]: sortOrder };

      const theaters = await Theater.find(query)
        .sort(sortOptions)
        .skip(skipCount)
        .limit(limit)
        .populate("ownerId", "ownerName email");

      const totalFiltered = await Theater.countDocuments(query);
      const [totalAll, activeAll, inactiveAll] = await Promise.all([
        Theater.countDocuments({ ownerId }),
        Theater.countDocuments({ ownerId, isActive: true }),
        Theater.countDocuments({ ownerId, isActive: false }),
      ]);

      return { theaters, totalFiltered, activeAll, inactiveAll, totalAll };
    } catch (error) {
      console.error("Error finding theaters by owner id:", error);
      throw error;
    }
  }

  async incrementTheaterScreenCount(theaterId: string): Promise<void> {
    try {
      const result = await Theater.findByIdAndUpdate(
        theaterId,
        { $inc: { screens: 1 } },
        { new: true }
      );
      if (!result) {
        throw new Error("Theater not found");
      }
    } catch (error) {
      console.error("Error incrementing screen count:", error);
      throw error;
    }
  }

  async decrementTheaterScreenCount(theaterId: string): Promise<void> {
    try {
      const result = await Theater.findByIdAndUpdate(
        theaterId,
        { $inc: { screens: -1 } },
        { new: true }
      );
      if (!result) {
        throw new Error("Theater not found");
      }
    } catch (error) {
      console.error("Error decrementing screen count:", error);
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<{ theaters: ITheater[]; total: number }> {
    try {
      const query: FilterQuery = {};
      this._applyFiltersToQuery(query, filters);

      const skipCount = (page - 1) * limit;
      const sortOptions = this._getSortOptions(filters);

      const theaters = await Theater.find(query)
        .sort(sortOptions)
        .skip(skipCount)
        .limit(limit)
        .populate("ownerId", "ownerName email phone");

      const total = await Theater.countDocuments(query);

      return { theaters, total };
    } catch (error) {
      console.error("Error getting all theaters:", error);
      throw error;
    }
  }

  async getTheatersByFilters(
    filters: TheaterFilters,
    page: number,
    limit: number
  ): Promise<{ theaters: ITheater[]; total: number }> {
    return this.findAll(page, limit, filters);
  }

  async update(
    theaterId: string,
    updateData: UpdateTheaterDTO
  ): Promise<ITheater | null> {
    try {
      return await Theater.findByIdAndUpdate(
        theaterId,
        { $set: updateData },
        { new: true }
      ).populate("ownerId", "ownerName email");
    } catch (error) {
      console.error("Error updating theater:", error);
      throw error;
    }
  }

  async toggleStatus(theaterId: string): Promise<ITheater | null> {
    try {
      const theater = await Theater.findById(theaterId);
      if (!theater) return null;

      theater.isActive = !theater.isActive;
      return await theater.save();
    } catch (error) {
      console.error("Error toggling theater status:", error);
      throw error;
    }
  }

  async verifyTheater(theaterId: string): Promise<ITheater | null> {
    try {
      const theater = await Theater.findById(theaterId);
      if (!theater) return null;

      theater.isVerified = true;
      return await theater.save();
    } catch (error) {
      console.error("Error verifying theater:", error);
      throw error;
    }
  }

  async rejectTheater(theaterId: string): Promise<ITheater | null> {
    try {
      const theater = await Theater.findById(theaterId);
      if (!theater) return null;

      theater.isRejected = true;
      return await theater.save();
    } catch (error) {
      console.error("Error rejecting theater:", error);
      throw error;
    }
  }

  async delete(theaterId: string): Promise<boolean> {
    try {
      const result = await Theater.findByIdAndDelete(theaterId);
      return !!result;
    } catch (error) {
      console.error("Error deleting theater:", error);
      throw error;
    }
  }

  async getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ITheater[]> {
    try {
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
    } catch (error) {
      console.error("Error finding nearby theaters:", error);
      throw error;
    }
  }

  async theaterExistsByNameAndCity(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const query: FilterQuery = {
        name: new RegExp(`^${name.trim()}$`, "i"),
        city: new RegExp(`^${city.trim()}$`, "i"),
        state: new RegExp(`^${state.trim()}$`, "i"),
      };

      if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const theater = await Theater.findOne(query);
      return !!theater;
    } catch (error) {
      console.error("Error checking theater existence:", error);
      throw error;
    }
  }

  async getTheaterByOwnerIdAndName(
    ownerId: string,
    name: string
  ): Promise<ITheater | null> {
    try {
      return await Theater.findOne({
        ownerId,
        name: new RegExp(`^${name}$`, "i"),
      }).populate("ownerId", "ownerName email");
    } catch (error) {
      console.error("Error finding theater by owner id and name:", error);
      throw error;
    }
  }

  async getTheatersWithFilters(filters: TheaterFilters): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
  }> {
    try {
      const pageNum = typeof filters.page === "string" ? parseInt(filters.page, 10) : filters.page || 1;
      const limitNum = typeof filters.limit === "string" ? parseInt(filters.limit, 10) : filters.limit || 10;
      const lat = typeof filters.latitude === "string" ? parseFloat(filters.latitude) : filters.latitude;
      const lon = typeof filters.longitude === "string" ? parseFloat(filters.longitude) : filters.longitude;

      if (filters.sortBy === "nearby" && lat != null && lon != null) {
        return await this._getTheatersByLocation(filters, pageNum, limitNum, lat, lon);
      }

      return await this._getTheatersWithRegularFilters(filters, pageNum, limitNum, lat, lon);
    } catch (error) {
      console.error("Error getting theaters with filters:", error);
      throw error;
    }
  }

  private async _getTheatersByLocation(
    filters: TheaterFilters,
    pageNum: number,
    limitNum: number,
    lat: number,
    lon: number
  ): Promise<{ theaters: ITheater[]; total: number; totalPages: number }> {
    const pipeline: PipelineOptions[] = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lon, lat],
          },
          distanceField: "distance",
          maxDistance: 50000,
          spherical: true,
          distanceMultiplier: 0.001,
          query: {
            isActive: true,
            isVerified: true,
            ...(filters.facilities && filters.facilities.length > 0 ? { facilities: { $in: filters.facilities } } : {})
          },
        },
      },
    ];

    if (filters.search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: filters.search, $options: "i" } },
            { city: { $regex: filters.search, $options: "i" } },
            { state: { $regex: filters.search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({
      $addFields: {
        distance: {
          $concat: [
            { $toString: { $round: ["$distance", 1] } },
            " km",
          ],
        },
      },
    });

    const countPipeline = [...pipeline, { $count: "total" }];
    const skipCount = (pageNum - 1) * limitNum;
    pipeline.push({ $skip: skipCount });
    pipeline.push({ $limit: limitNum });

    const [theaters, totalCount] = await Promise.all([
      Theater.aggregate(pipeline),
      Theater.aggregate(countPipeline),
    ]);

    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    return { theaters, total, totalPages };
  }

  private async _getTheatersWithRegularFilters(
    filters: TheaterFilters,
    pageNum: number,
    limitNum: number,
    lat?: number,
    lon?: number
  ): Promise<{ theaters: ITheater[]; total: number; totalPages: number }> {
    const query: FilterQuery = {
      isActive: true,
      isVerified: true,
    };

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { city: { $regex: filters.search, $options: "i" } },
        { state: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.facilities && filters.facilities.length > 0) {
      query.facilities = { $in: filters.facilities };
    }

    let mongooseQuery = Theater.find(query);

    switch (filters.sortBy) {
      case "a-z":
        mongooseQuery = mongooseQuery.sort({ name: 1 });
        break;
      case "z-a":
        mongooseQuery = mongooseQuery.sort({ name: -1 });
        break;
      case "rating-high":
        mongooseQuery = mongooseQuery.sort({ rating: -1 });
        break;
      case "rating-low":
        mongooseQuery = mongooseQuery.sort({ rating: 1 });
        break;
      default:
        mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
        break;
    }

    const skipCount = (pageNum - 1) * limitNum;
    const [total, theaters] = await Promise.all([
      Theater.countDocuments(query),
      mongooseQuery.skip(skipCount).limit(limitNum).lean(),
    ]);

    const theatersWithDistance = theaters.map((theater: TheaterInfoDto) => {
      let distance = undefined;
      if (lat != null && lon != null && theater.location?.coordinates) {
        const [tLon, tLat] = theater.location.coordinates;
        const calculatedDistance = this._calculateDistanceFromLatLonInKm(lat, lon, tLat, tLon);
        distance = `${calculatedDistance.toFixed(1)} km`;
      }
      return {
        ...theater,
        distance,
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    return { theaters: theatersWithDistance, total, totalPages };
  }

  private _calculateDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this._degreeToRadian(lat2 - lat1);
    const dLon = this._degreeToRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this._degreeToRadian(lat1)) *
        Math.cos(this._degreeToRadian(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private _degreeToRadian(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private _applyFiltersToQuery(query: FilterQuery, filters?: TheaterFilters): void {
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

  private _getSortOptions(filters?: TheaterFilters): any {
    if (filters?.sortBy) {
      const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
      return { [filters.sortBy]: sortOrder };
    }
    return { createdAt: -1 };
  }
}
