import { IMovieShowtime } from "../interfaces/showtimes.model.interfaces";
import MovieShowtime from "../models/showtimes.model";
import mongoose, { Types } from "mongoose";
import { IShowtimeReadRepository, IShowtimeWriteRepository, IShowtimeRepository } from "../interfaces/showtimes.repository.interface";
import { CreateShowtimeDTO, UpdateShowtimeDTO, ShowtimeFilters, PaginatedShowtimeResult, SeatBookingDTO, SeatReleaseDTO } from "../dtos/dto";

export class ShowtimeRepository implements IShowtimeRepository {
  async createShowtime(
    ownerId: string,
    showtimeData: CreateShowtimeDTO
  ): Promise<IMovieShowtime> {
    try {
      const data = { ownerId, ...showtimeData };
      const showtime = new MovieShowtime(data);
      const savedShowtime = await showtime.save();
      if (!savedShowtime) {
        throw new Error("Failed to create showtime");
      }
      return savedShowtime;
    } catch (error) {
      console.error("Error creating showtime:", error);
      throw error;
    }
  }

  async getShowtimeById(showtimeId: string): Promise<IMovieShowtime | null> {
    try {
      return await MovieShowtime.findById(showtimeId)
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId");
    } catch (error) {
      console.error("Error finding showtime by id:", error);
      throw error;
    }
  }

  async getShowtimesByMovieAndDate(
    movieId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    try {
      const { startOfDay, endOfDay } = this._getDayBounds(date);

      return await MovieShowtime.find({
        movieId: new Types.ObjectId(movieId),
        showDate: { $gte: startOfDay, $lte: endOfDay },
        isActive: true,
      })
        .populate("theaterId")
        .populate("screenId")
        .sort({ showTime: 1 });
    } catch (error) {
      console.error("Error finding showtimes by movie and date:", error);
      throw error;
    }
  }

  async getShowtimesByTheaterAndDate(
    theaterId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    try {
      const { startOfDay, endOfDay } = this._getDayBounds(date);

      return await MovieShowtime.find({
        theaterId: new Types.ObjectId(theaterId),
        showDate: { $gte: startOfDay, $lte: endOfDay },
        isActive: true,
      })
        .populate("movieId")
        .populate("screenId")
        .sort({ showTime: 1 });
    } catch (error) {
      console.error("Error finding showtimes by theater and date:", error);
      throw error;
    }
  }

  async getShowtimesByOwnerIdPaginated(
    ownerId: string,
    skip: number,
    limit: number
  ): Promise<IMovieShowtime[]> {
    try {
      return await MovieShowtime.find({ ownerId })
        .skip(skip)
        .limit(limit)
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .sort({ createdAt: 1 });
    } catch (error) {
      console.error("Error finding showtimes by owner id paginated:", error);
      throw error;
    }
  }

  async getShowtimesByFilters(filters: {
    theaterId: string;
    screenId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<IMovieShowtime[]> {
    try {
      return await MovieShowtime.find({
        theaterId: filters.theaterId,
        screenId: filters.screenId,
        showDate: {
          $gte: filters.startDate,
          $lte: filters.endDate,
        },
        isActive: true,
      })
        .populate("movieId", "title poster language duration")
        .populate("theaterId", "name location")
        .populate("screenId", "name totalSeats layout")
        .sort({ showTime: 1 });
    } catch (error) {
      console.error("Error finding showtimes by filters:", error);
      throw error;
    }
  }

  async countShowtimesByOwnerId(ownerId: string): Promise<number> {
    try {
      return await MovieShowtime.countDocuments({ ownerId });
    } catch (error) {
      console.error("Error counting showtimes by owner id:", error);
      throw error;
    }
  }

  async getShowtimesByOwnerId(ownerId: string): Promise<IMovieShowtime[]> {
    try {
      return await MovieShowtime.find({ ownerId })
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId");
    } catch (error) {
      console.error("Error finding showtimes by owner id:", error);
      throw error;
    }
  }

  async updateShowtimeById(
    showtimeId: string,
    updateData: UpdateShowtimeDTO
  ): Promise<IMovieShowtime | null> {
    try {
      return await MovieShowtime.findByIdAndUpdate(showtimeId, updateData, { new: true });
    } catch (error) {
      console.error("Error updating showtime by id:", error);
      throw error;
    }
  }

  async deleteShowtimeById(showtimeId: string): Promise<boolean> {
    try {
      const result = await MovieShowtime.findByIdAndDelete(showtimeId);
      return result !== null;
    } catch (error) {
      console.error("Error deleting showtime by id:", error);
      throw error;
    }
  }

  async blockShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<boolean> {
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const seatBlocks = seatIds.map((seatId) => ({
        seatId,
        userId,
        sessionId,
        blockedAt: new Date(),
        expiresAt,
      }));

      const result = await MovieShowtime.findByIdAndUpdate(showtimeId, {
        $push: { blockedSeats: { $each: seatBlocks } },
      });

      return result !== null;
    } catch (error) {
      console.error("Error blocking showtime seats:", error);
      throw error;
    }
  }

  async releaseShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    reason: string
  ): Promise<boolean> {
    try {
      const result = await MovieShowtime.findByIdAndUpdate(
        showtimeId,
        {
          $pull: {
            bookedSeats: { $in: seatIds }
          },
          $inc: {
            availableSeats: seatIds.length
          }
        },
        { new: true }
      );

      for (const seatId of seatIds) {
        const rowLabel = seatId.charAt(0);
        await MovieShowtime.findOneAndUpdate(
          { 
            _id: showtimeId,
            'rowPricing.rowLabel': rowLabel 
          },
          {
            $pull: { 'rowPricing.$.bookedSeats': seatId },
            $inc: { 'rowPricing.$.availableSeats': 1 }
          }
        );
      }

      return result !== null;
    } catch (error) {
      console.error("Error releasing showtime seats:", error);
      throw error;
    }
  }

  async getShowtimesByScreenPaginated(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult> {
    try {
      const query: any = { screenId: new mongoose.Types.ObjectId(screenId) };
      this._applyFiltersToQuery(query, filters);

      const skipCount = (page - 1) * limit;
      const sortOptions = this._getSortOptions(filters);

      const [showtimes, total] = await Promise.all([
        MovieShowtime.find(query)
          .populate("movieId", "title duration language poster")
          .populate("theaterId", "name city state")
          .populate("screenId", "name totalSeats")
          .sort(sortOptions)
          .skip(skipCount)
          .limit(limit)
          .lean(),
        MovieShowtime.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        showtimes: showtimes as IMovieShowtime[],
        total,
        currentPage: page,
        totalPages,
        pageSize: limit,
      };
    } catch (error) {
      console.error("Error finding showtimes by screen paginated:", error);
      throw error;
    }
  }

  async getAllShowtimesPaginated(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult> {
    try {
      const query: any = {};
      this._applyFiltersToQuery(query, filters);

      const skipCount = (page - 1) * limit;
      const sortOptions = this._getSortOptions(filters);

      const [showtimes, total] = await Promise.all([
        MovieShowtime.find(query)
          .populate("movieId", "title duration language poster")
          .populate("theaterId", "name city state")
          .populate("screenId", "name totalSeats")
          .sort(sortOptions)
          .skip(skipCount)
          .limit(limit)
          .lean(),
        MovieShowtime.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        showtimes: showtimes as IMovieShowtime[],
        total,
        currentPage: page,
        totalPages,
        pageSize: limit,
      };
    } catch (error) {
      console.error("Error finding all showtimes paginated:", error);
      throw error;
    }
  }

  async updateShowtimeStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<IMovieShowtime | null> {
    try {
      return await MovieShowtime.findByIdAndUpdate(
        showtimeId,
        { isActive },
        { new: true }
      ).lean();
    } catch (error) {
      console.error("Error updating showtime status:", error);
      throw error;
    }
  }

  async bookShowtimeSeats(showtimeId: string, seatIds: string[]): Promise<boolean> {
    try {
      const result = await MovieShowtime.findByIdAndUpdate(showtimeId, {
        $push: { bookedSeats: { $each: seatIds } },
        $pull: { blockedSeats: { seatId: { $in: seatIds } } },
        $inc: { availableSeats: -seatIds.length },
      });

      if (result) {
        const updatePromises = seatIds.map((seatId) => {
          const rowLabel = seatId[0];
          return MovieShowtime.updateOne(
            { _id: showtimeId, "rowPricing.rowLabel": rowLabel },
            {
              $push: { "rowPricing.$.bookedSeats": seatId },
              $inc: { "rowPricing.$.availableSeats": -1 },
            }
          );
        });

        await Promise.all(updatePromises);
      }

      return result !== null;
    } catch (error) {
      console.error("Error booking showtime seats:", error);
      throw error;
    }
  }

  async showtimeExistsByScreenAndTime(
    screenId: string,
    showDate: Date,
    showTime: string
  ): Promise<boolean> {
    try {
      const existing = await MovieShowtime.findOne({
        screenId: new Types.ObjectId(screenId),
        showDate,
        showTime,
        isActive: true,
      });

      return existing !== null;
    } catch (error) {
      console.error("Error checking showtime exists by screen and time:", error);
      throw error;
    }
  }

  async checkShowtimeTimeSlotOverlap(
    screenId: string,
    showDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const query: any = {
        screenId: new Types.ObjectId(screenId),
        showDate,
        isActive: true,
        $or: [
          {
            showTime: { $lte: startTime },
            endTime: { $gt: startTime },
          },
          {
            showTime: { $lt: endTime },
            endTime: { $gte: endTime },
          },
          {
            showTime: { $gte: startTime },
            endTime: { $lte: endTime },
          },
          {
            showTime: { $lte: startTime },
            endTime: { $gte: endTime },
          },
        ],
      };

      if (excludeId) {
        query._id = { $ne: new Types.ObjectId(excludeId) };
      }

      const existing = await MovieShowtime.findOne(query);
      return existing !== null;
    } catch (error) {
      console.error("Error checking showtime time slot overlap:", error);
      throw error;
    }
  }

  async getAllShowtimes(
    page: number = 1,
    limit: number = 10,
    filters: ShowtimeFilters = {}
  ): Promise<{
    showtimes: IMovieShowtime[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      limit: number;
    };
  }> {
    try {
      const skipCount = (page - 1) * limit;
      const query: any = {};
      
      if (filters.theaterId) {
        query.theaterId = new Types.ObjectId(filters.theaterId);
      }
      if (filters.movieId) {
        query.movieId = new Types.ObjectId(filters.movieId);
      }
      if (filters.date) {
        const { startOfDay, endOfDay } = this._getDayBounds(new Date(filters.date));
        query.showDate = { $gte: startOfDay, $lte: endOfDay };
      }

      const [showtimes, total] = await Promise.all([
        MovieShowtime.find(query)
          .populate("movieId")
          .populate("theaterId")
          .populate("screenId")
          .sort({ showDate: 1, showTime: 1 })
          .skip(skipCount)
          .limit(limit),
        MovieShowtime.countDocuments(query),
      ]);

      return {
        showtimes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit,
        },
      };
    } catch (error) {
      console.error("Error getting all showtimes:", error);
      throw error;
    }
  }

  async getShowtimesByScreenAndDate(
    screenId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    try {
      const { startOfDay, endOfDay } = this._getDayBounds(date);

      return await MovieShowtime.find({
        screenId: new Types.ObjectId(screenId),
        showDate: { $gte: startOfDay, $lte: endOfDay },
        isActive: true,
      })
        .populate("movieId")
        .populate("theaterId")
        .sort({ showTime: 1 });
    } catch (error) {
      console.error("Error finding showtimes by screen and date:", error);
      throw error;
    }
  }

  async getTheatersByMovieWithShowtimes(
    movieId: string,
    date: Date
  ): Promise<any[]> {
    try {
      const { startOfDay, endOfDay } = this._getDayBounds(date);

      return await MovieShowtime.aggregate([
        {
          $match: {
            movieId: new Types.ObjectId(movieId),
            showDate: { $gte: startOfDay, $lte: endOfDay },
            isActive: true,
          },
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theater",
          },
        },
        {
          $lookup: {
            from: "screens",
            localField: "screenId",
            foreignField: "_id",
            as: "screen",
          },
        },
        {
          $unwind: "$theater",
        },
        {
          $unwind: "$screen",
        },
        {
          $group: {
            _id: "$theaterId",
            theaterName: { $first: "$theater.name" },
            theaterLocation: { $first: "$theater.location" },
            showtimes: {
              $push: {
                showtimeId: "$_id",
                showTime: "$showTime",
                endTime: "$endTime",
                format: "$format",
                language: "$language",
                screenName: "$screen.name",
                availableSeats: "$availableSeats",
                totalSeats: "$totalSeats",
                rowPricing: "$rowPricing",
              },
            },
          },
        },
        {
          $sort: { theaterName: 1 },
        },
      ]);
    } catch (error) {
      console.error("Error getting theaters by movie with showtimes:", error);
      throw error;
    }
  }

  private _getDayBounds(date: Date): { startOfDay: Date; endOfDay: Date } {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }

  private _applyFiltersToQuery(query: any, filters?: ShowtimeFilters): void {
    if (!filters) return;

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { format: searchRegex },
        { language: searchRegex },
        { showTime: searchRegex },
      ];
    }

    if (filters.showDate) {
      const startDate = new Date(filters.showDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.showDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.format) {
      query.format = filters.format;
    }

    if (filters.language) {
      query.language = filters.language;
    }

    if (filters.theaterId) {
      query.theaterId = new mongoose.Types.ObjectId(filters.theaterId);
    }

    if (filters.screenId) {
      query.screenId = new mongoose.Types.ObjectId(filters.screenId);
    }

    if (filters.movieId) {
      query.movieId = new mongoose.Types.ObjectId(filters.movieId);
    }
  }

  private _getSortOptions(filters?: ShowtimeFilters): any {
    const sortBy = filters?.sortBy || "showDate";
    const sortOrder = filters?.sortOrder === "desc" ? -1 : 1;

    switch (sortBy) {
      case "showTime":
        return { showTime: sortOrder };
      case "format":
        return { format: sortOrder };
      case "language":
        return { language: sortOrder };
      case "availableSeats":
        return { availableSeats: sortOrder };
      case "totalSeats":
        return { totalSeats: sortOrder };
      case "createdAt":
        return { createdAt: sortOrder };
      default:
        return { showDate: sortOrder, showTime: 1 };
    }
  }
}
