import mongoose, { Types } from "mongoose";

import { IShowtimeRepository } from "../interfaces/showtimes.repository.interface";
import { IShowtimeService } from "../interfaces/showtimes.service.interface";
import {
  BulkCreateResponseDto,
  CreateShowtimeDto,
  ShowtimeFilters,
  ShowtimeResponseDto,
  UpdateShowtimeDto,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";
import { IMovieShowtime } from "../interfaces/showtimes.model.interfaces";

export class ShowtimeService implements IShowtimeService {
  constructor(private readonly showtimeRepo: IShowtimeRepository) {}
async createBulkShowtimes(
  showtimeList: CreateShowtimeDto[],
  ownerId: string
): Promise<ServiceResponse> {
  const groupedByScreenDate: { [key: string]: CreateShowtimeDto[] } = {};

  for (const st of showtimeList) {
    const key = `${st.screenId}-${st.showDate}`;
    if (!groupedByScreenDate[key]) groupedByScreenDate[key] = [];
    groupedByScreenDate[key].push(st);
  }

  for (const [key, showtimes] of Object.entries(groupedByScreenDate)) {
    showtimes.sort((a, b) => a.showTime.localeCompare(b.showTime));

    for (let i = 0; i < showtimes.length - 1; i++) {
      const current = showtimes[i];
      const next = showtimes[i + 1];

      const gap = this.getTimeGapInMinutes(current.endTime, next.showTime);
      if (gap < 30) {
        return {
          success: false,
          message: `Insufficient gap between showtimes: ${current.showTime}-${current.endTime} and ${next.showTime}-${next.endTime} (30-min minimum required)`,
          data: { created: 0, skipped: 0, showtimes: [], errors: [] },
        };
      }
    }
  }

  let created = 0;
  let skipped = 0;
  let createdDocs: IMovieShowtime[] = [];
  const errors: string[] = [];

  for (const st of showtimeList) {
    const result = await this.createShowtime(st, ownerId);
    if (result.success) {
      created++;
      createdDocs.push(result.data);
    } else {
      skipped++;
      errors.push(result.message);
    }
  }

  return {
    success: created > 0,
    message: `Successfully created ${created} showtimes. ${
      skipped > 0 ? `Skipped ${skipped} due to conflicts.` : ""
    }`,
    data: {
      created,
      skipped,
      showtimes: createdDocs,
      errors: skipped > 0 ? errors : undefined,
    },
  };
}

async createShowtime(
  showtimeData: CreateShowtimeDto,
  ownerId: string
): Promise<ServiceResponse> {
  try {
    const bufferMinutes = 30;
    const bufferedStartTime = this.subtractMinutes(
      showtimeData.showTime,
      bufferMinutes
    );
    const bufferedEndTime = this.addMinutes(
      showtimeData.endTime,
      bufferMinutes
    );

    const hasOverlap = await this.showtimeRepo.checkTimeSlotOverlap(
      showtimeData.screenId.toString(),
      new Date(showtimeData.showDate),
      bufferedStartTime,
      bufferedEndTime
    );

    if (hasOverlap) {
      return {
        success: false,
        message: `Time slot ${showtimeData.showTime}-${showtimeData.endTime} conflicts with existing showtime (30-min buffer required)`,
      };
    }

    const showtime: IMovieShowtime | null = await this.showtimeRepo.create(ownerId, {
      movieId: new Types.ObjectId(showtimeData.movieId),
      theaterId: new Types.ObjectId(showtimeData.theaterId),
      screenId: new Types.ObjectId(showtimeData.screenId),
      showDate: showtimeData.showDate,
      showTime: showtimeData.showTime,
      endTime: showtimeData.endTime,
      format: showtimeData.format,
      language: showtimeData.language,
      rowPricing: showtimeData.rowPricing,
      totalSeats: showtimeData.totalSeats,
      availableSeats: showtimeData.totalSeats,
      bookedSeats: [],
      blockedSeats: [],
      isActive: true,
      ageRestriction: showtimeData.ageRestriction,
    });

    if (!showtime) {
      return {
        success: false,
        message: "Failed to create showtime",
      };
    }

    return {
      success: true,
      message: "Showtime created successfully",
      data: showtime,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}


  async updateShowtime(
    id: string,
    updateData: UpdateShowtimeDto,
    ownerId?: string
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const allowedFields = [
        "showDate",
        "showTime",
        "endTime",
        "format",
        "rowPricing",
        "totalSeats",
        "availableSeats",
        "bookedSeats",
        "blockedSeats",
        "isActive",
        "ageRestriction",
      ];
      const updates: any = {};
      allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) updates[field] = updateData[field];
      });

      if (updates.showDate || updates.showTime || updates.endTime) {
        const currentShowtime = await this.showtimeRepo.findById(id);
        if (!currentShowtime) {
          return {
            success: false,
            message: "Showtime not found",
          };
        }

        const finalShowDate = updates.showDate || currentShowtime.showDate;
        const finalShowTime = updates.showTime || currentShowtime.showTime;
        const finalEndTime = updates.endTime || currentShowtime.endTime;

        let finalScreenId = updates.screenId || currentShowtime.screenId;

        if (
          typeof finalScreenId === "object" &&
          finalScreenId !== null &&
          finalScreenId._id
        ) {
          finalScreenId =
            typeof finalScreenId._id === "string"
              ? finalScreenId._id
              : finalScreenId._id.toString();
        }

        const bufferMinutes = 30;
        const bufferedStartTime = this.subtractMinutes(
          finalShowTime,
          bufferMinutes
        );
        const bufferedEndTime = this.addMinutes(finalEndTime, bufferMinutes);

        const hasOverlap = await this.showtimeRepo.checkTimeSlotOverlap(
          finalScreenId,
          new Date(finalShowDate),
          bufferedStartTime,
          bufferedEndTime,
          id
        );

        if (hasOverlap) {
          return {
            success: false,
            message: `Time slot ${finalShowTime}-${finalEndTime} conflicts with existing showtime (30-min buffer required)`,
          };
        }
      }

      const query: any = { _id: id };
      if (ownerId) query.ownerId = ownerId;

      const updatedShowtime = await this.showtimeRepo.updateById(
        query,
        updates
      );

      if (!updatedShowtime) {
        return {
          success: false,
          message: "Showtime not found or update failed",
        };
      }

      return {
        success: true,
        message: "Showtime updated successfully",
        data: updatedShowtime,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getShowtimeById(id: string): Promise<ServiceResponse> {
    try {
      
      if (!mongoose.isValidObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const showtime = await this.showtimeRepo.findById(id);

      if (!showtime) {
        return {
          success: false,
          message: "Showtime not found",
        };
      }

      return {
        success: true,
        message: "Showtime retrieved successfully",
        data: showtime,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async getShowtimesByScreenAdmin(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      const result = await this.showtimeRepo.findByScreenPaginated(
        screenId,
        page,
        limit,
        filters
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getAllShowtimesAdmin(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      const result = await this.showtimeRepo.findAllPaginated(
        page,
        limit,
        filters
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async updateShowtimeStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<ServiceResponse> {
    try {
      const result = await this.showtimeRepo.updateStatus(showtimeId, isActive);

      if (!result) {
        return {
          success: false,
          message: "Showtime not found or update failed",
        };
      }

      return {
        success: true,
        message: `Showtime ${
          isActive ? "activated" : "deactivated"
        } successfully`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getShowtimesByScreen(
    screenId: string,
    date: Date
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(screenId)) {
        return {
          success: false,
          message: "Invalid screen ID",
        };
      }

      const showtimes = await this.showtimeRepo.findByScreenAndDate(
        screenId,
        date
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getShowtimesByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(movieId)) {
        return {
          success: false,
          message: "Invalid movie ID",
        };
      }

      const showtimes = await this.showtimeRepo.findByMovieAndDate(
        movieId,
        date
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getShowtimesByTheater(
    theaterId: string,
    date: Date
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(theaterId)) {
        return {
          success: false,
          message: "Invalid theater ID",
        };
      }

      const showtimes = await this.showtimeRepo.findByTheaterAndDate(
        theaterId,
        date
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async getShowtimesByOwnerId(ownerId: string): Promise<ServiceResponse> {
    try {
      const showtimes = await this.showtimeRepo.findByOwnerId(ownerId);

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async blockSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(showtimeId)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      if (!seatIds || seatIds.length === 0) {
        return {
          success: false,
          message: "Seat IDs are required",
        };
      }

      const result = await this.showtimeRepo.blockSeats(
        showtimeId,
        seatIds,
        userId,
        sessionId
      );

      if (!result) {
        return {
          success: false,
          message: "Failed to block seats",
        };
      }

      return {
        success: true,
        message: "Seats blocked successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async releaseSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(showtimeId)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const result = await this.showtimeRepo.releaseSeats(
        showtimeId,
        seatIds,
        userId,
        sessionId
      );

      if (!result) {
        return {
          success: false,
          message: "Failed to release seats",
        };
      }

      return {
        success: true,
        message: "Seats released successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async bookSeats(
    showtimeId: string,
    seatIds: string[]
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(showtimeId)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      if (!seatIds || seatIds.length === 0) {
        return {
          success: false,
          message: "Seat IDs are required",
        };
      }

      const result = await this.showtimeRepo.bookSeats(showtimeId, seatIds);

      if (!result) {
        return {
          success: false,
          message: "Failed to book seats",
        };
      }

      return {
        success: true,
        message: "Seats booked successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async deleteShowtime(id: string): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const deleted = await this.showtimeRepo.deleteById(id);

      if (!deleted) {
        return {
          success: false,
          message: "Showtime not found",
        };
      }

      return {
        success: true,
        message: "Showtime deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getAllShowtimes(
    page: number = 1,
    limit: number = 10,
    filters: ShowtimeFilters = {}
  ): Promise<ServiceResponse> {
    try {
      const showtimes = await this.showtimeRepo.findAll(page, limit, filters);

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async getTheatersByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(movieId)) {
        return {
          success: false,
          message: "Invalid movie ID",
        };
      }

      const theaters = await this.showtimeRepo.findTheatersByMovieWithShowtimes(
        movieId,
        date
      );

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: theaters,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async changeShowtimeStatus(
    id: string,
    isActive: boolean
  ): Promise<ServiceResponse> {
    try {
      if (!mongoose.isValidObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      isActive = !isActive;

      const updatedShowtime = await this.showtimeRepo.updateById(id, {
        isActive,
      });

      if (!updatedShowtime) {
        return {
          success: false,
          message: "Showtime not found",
        };
      }

      return {
        success: true,
        message: `Showtime ${
          isActive ? "activated" : "deactivated"
        } successfully`,
        data: updatedShowtime,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  private addMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins, 0, 0);
    date.setMinutes(date.getMinutes() + minutes);

    const newHours = date.getHours();
    const newMins = date.getMinutes();

    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  }

  private subtractMinutes(time: string, minutes: number): string {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins, 0, 0);
    date.setMinutes(date.getMinutes() - minutes);

    const newHours = Math.max(0, date.getHours());
    const newMins = Math.max(0, date.getMinutes());

    return `${newHours.toString().padStart(2, "0")}:${newMins
      .toString()
      .padStart(2, "0")}`;
  }

  private getTimeGapInMinutes(endTime: string, startTime: string): number {
    const [endH, endM] = endTime.split(":").map(Number);
    const [startH, startM] = startTime.split(":").map(Number);
    return startH * 60 + startM - (endH * 60 + endM);
  }
}
