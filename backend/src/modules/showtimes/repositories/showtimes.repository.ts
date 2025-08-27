import { IMovieShowtime } from "../interfaces/showtimes.model.interfaces";
import MovieShowtime from "../models/showtimes.model";
import mongoose, { Types } from "mongoose";
import { IShowtimeRepository } from "../interfaces/showtimes.repository.interface";
import { PaginatedShowtimeResult, ShowtimeFilters } from "../dtos/dto";
export class ShowtimeRepository implements IShowtimeRepository {
  async create(
    ownerId: string,
    showtimeData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null> {
    let data = { ownerId: ownerId, ...showtimeData };
    const showtime = new MovieShowtime(data);
    return showtime.save();
  }

  async findById(id: string): Promise<IMovieShowtime | null> {
    return MovieShowtime.findById(id)
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId");
  }

  async findByMovieAndDate(
    movieId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return MovieShowtime.find({
      movieId: new Types.ObjectId(movieId),
      showDate: { $gte: startOfDay, $lte: endOfDay },
      isActive: true,
    })
      .populate("theaterId")
      .populate("screenId")
      .sort({ showTime: 1 });
  }

  async findByTheaterAndDate(
    theaterId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return MovieShowtime.find({
      theaterId: new Types.ObjectId(theaterId),
      showDate: { $gte: startOfDay, $lte: endOfDay },
      isActive: true,
    })
      .populate("movieId")
      .populate("screenId")
      .sort({ showTime: 1 });
  }
  async findByOwnerId(ownerId: string) {
    return MovieShowtime.find({ ownerId })
      .populate("movieId")
      .populate("theaterId")
      .populate("screenId");
  }

  async updateById(
    id: string,
    updateData: Partial<IMovieShowtime>
  ): Promise<IMovieShowtime | null> {
    return MovieShowtime.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await MovieShowtime.findByIdAndDelete(id);
    return result !== null;
  }

  async blockSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<boolean> {
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
  }

  async releaseSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<boolean> {
    const result = await MovieShowtime.findByIdAndUpdate(showtimeId, {
      $pull: {
        blockedSeats: {
          seatId: { $in: seatIds },
          $or: [{ userId }, { sessionId }],
        },
      },
    });

    return result !== null;
  }
  async findByScreenPaginated(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult> {
    const query: any = { screenId: new mongoose.Types.ObjectId(screenId) };
    this.applyFilters(query, filters);

    const skip = (page - 1) * limit;
    const sortOptions = this.getSortOptions(filters);

    const [showtimes, total] = await Promise.all([
      MovieShowtime.find(query)
        .populate("movieId", "title duration language poster")
        .populate("theaterId", "name city state")
        .populate("screenId", "name totalSeats")
        .sort(sortOptions)
        .skip(skip)
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
  }

  async findAllPaginated(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<PaginatedShowtimeResult> {
    const query: any = {};
    this.applyFilters(query, filters);

    const skip = (page - 1) * limit;
    const sortOptions = this.getSortOptions(filters);

    const [showtimes, total] = await Promise.all([
      MovieShowtime.find(query)
        .populate("movieId", "title duration language poster")
        .populate("theaterId", "name city state")
        .populate("screenId", "name totalSeats")
        .sort(sortOptions)
        .skip(skip)
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
  }

  async updateStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<IMovieShowtime | null> {
    return await MovieShowtime.findByIdAndUpdate(
      showtimeId,
      { isActive },
      { new: true }
    ).lean();
  }

  private applyFilters(query: any, filters?: ShowtimeFilters): void {
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

  private getSortOptions(filters?: ShowtimeFilters): any {
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

  async bookSeats(showtimeId: string, seatIds: string[]): Promise<boolean> {
    const result = await MovieShowtime.findByIdAndUpdate(showtimeId, {
      $push: { bookedSeats: { $each: seatIds } },
      $pull: { blockedSeats: { seatId: { $in: seatIds } } },
      $inc: { availableSeats: -seatIds.length },
    });

    if (result) {
      const updatePromises = seatIds.map((seatId) => {
        const rowLabel = seatId[0]; // Extract row letter
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
  }

  async existsByScreenAndTime(
    screenId: string,
    showDate: Date,
    showTime: string
  ): Promise<boolean> {
    const existing = await MovieShowtime.findOne({
      screenId: new Types.ObjectId(screenId),
      showDate,
      showTime,
      isActive: true,
    });

    return existing !== null;
  }
  async checkTimeSlotOverlap(
    screenId: string,
    showDate: Date,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean> {
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
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: ShowtimeFilters = {}
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (filters.theaterId) {
      query.theaterId = new Types.ObjectId(filters.theaterId);
    }
    if (filters.movieId) {
      query.movieId = new Types.ObjectId(filters.movieId);
    }
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.showDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const [showtimes, total] = await Promise.all([
      MovieShowtime.find(query)
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .sort({ showDate: 1, showTime: 1 })
        .skip(skip)
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
  }
  async findByScreenAndDate(
    screenId: string,
    date: Date
  ): Promise<IMovieShowtime[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return MovieShowtime.find({
      screenId: new Types.ObjectId(screenId),
      showDate: { $gte: startOfDay, $lte: endOfDay },
      isActive: true,
    })
      .populate("movieId")
      .populate("theaterId")
      .sort({ showTime: 1 });
  }

  async findTheatersByMovieWithShowtimes(
    movieId: string,
    date: Date
  ): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);


    let data = await MovieShowtime.aggregate([
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

    return data;
  }
}
