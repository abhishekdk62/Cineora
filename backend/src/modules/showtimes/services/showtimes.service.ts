import mongoose, { Types } from "mongoose";
import { IShowtimeRepository } from "../interfaces/showtimes.repository.interface";
import { IShowtimeService } from "../interfaces/showtimes.service.interface";
import {
  CreateShowtimeDTO,
  UpdateShowtimeDTO,
  ShowtimeFilters,
  PaginatedShowtimeResult,
  SeatReleaseDTO,
  SeatHoldDTO,
} from "../dtos/dto";
import { ServiceResponse } from "../../../interfaces/interface";
import { IMovieShowtime } from "../interfaces/showtimes.model.interfaces";
import { SocketService } from "../../../services/socket.service";

export class ShowtimeService implements IShowtimeService {
  constructor(
    private readonly showtimeRepository: IShowtimeRepository,
    private readonly socketService: SocketService
  ) {}

  async createBulkShowtimes(
    showtimeList: CreateShowtimeDTO[],
    ownerId: string
  ): Promise<
    ServiceResponse<{
      created: number;
      skipped: number;
      showtimes: IMovieShowtime[];
      errors?: string[];
    }>
  > {
    try {
      if (!showtimeList || showtimeList.length === 0) {
        return {
          success: false,
          message: "Showtime list is required",
        };
      }

      const validationResult = this._validateBulkShowtimeTimeGaps(showtimeList);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
          data: { created: 0, skipped: 0, showtimes: [], errors: [] },
        };
      }

      const { created, skipped, createdDocs, errors } =
        await this._processBulkShowtimeCreation(showtimeList, ownerId);

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
    } catch (error: unknown) {
      console.error("Error creating bulk showtimes:", error);
      return this._handleServiceError(error, "Failed to create bulk showtimes");
    }
  }
  async holdSeatsForGroup(
    showtimeId: string,
    holdData: SeatHoldDTO

  ): Promise<ServiceResponse<{ heldSeats: string[]; failedSeats: string[] }>> {
    try {
      if (!showtimeId || !holdData.seatNumbers?.length) {
        return {
          success: false,
          message: "Showtime ID and seat numbers are required",
        };
      }

      const holdDurationMs = (holdData.holdDurationMinutes || 15) * 60 * 1000;
      const expiresAt = new Date(Date.now() + holdDurationMs);

      const holdResult = await this.showtimeRepository.holdSeats(
        showtimeId,
        holdData.seatNumbers,
        holdData.userId,
        holdData.sessionId,
        holdData.inviteGroupId,
        expiresAt
      );

      if (!holdResult.success) {
        return {
          success: false,
          message: "Failed to hold seats",
        };
      }

      if (holdResult.heldSeats.length > 0) {
        this.socketService.emitSeatHold(
          showtimeId,
          holdResult.heldSeats,
          holdData.inviteGroupId
        );
      }

      this._scheduleAutoRelease(showtimeId, holdData.inviteGroupId, expiresAt);
console.log('hold seats',holdResult.heldSeats);
console.log('failedSeats seats',holdResult.failedSeats);

      return {
        success: true,
        message: `Successfully held ${holdResult.heldSeats.length} seats`,
        data: {
          heldSeats: holdResult.heldSeats,
          failedSeats: holdResult.failedSeats,
        },
      };
    } catch (error: unknown) {
      console.error("Error holding seats:", error);
      return {
        success: false,
        message: "Failed to hold seats",
      };
    }
  }

  async releaseHeldSeats(
    showtimeId: string,
    releaseData: SeatReleaseDTO
  ): Promise<ServiceResponse<{ releasedSeats: string[] }>> {
    try {
      if (!showtimeId) {
        return {
          success: false,
          message: "Showtime ID is required",
        };
      }

      const releaseResult = await this.showtimeRepository.releaseHeldSeats(
        showtimeId,
        {
          seatNumbers: releaseData.seatNumbers,
          inviteGroupId: releaseData.inviteGroupId,
          userId: releaseData.userId,
        }
      );

      if (!releaseResult.success) {
        return {
          success: false,
          message: "Failed to release held seats",
        };
      }

      if (releaseResult.releasedSeats.length > 0) {
        this.socketService.emitSeatRelease(
          showtimeId,
          releaseResult.releasedSeats
        );
      }

      return {
        success: true,
        message: `Successfully released ${releaseResult.releasedSeats.length} seats`,
        data: {
          releasedSeats: releaseResult.releasedSeats,
        },
      };
    } catch (error: unknown) {
      console.error("Error releasing held seats:", error);
      return {
        success: false,
        message: "Failed to release held seats",
      };
    }
  }

  async getHeldSeats(showtimeId: string): Promise<ServiceResponse<string[]>> {
    try {
      const heldSeats = await this.showtimeRepository.getHeldSeats(showtimeId);
      
      return {
        success: true,
        message: "Successfully retrieved held seats",
        data: heldSeats,
      };
    } catch (error: unknown) {
      console.error("Error getting held seats:", error);
      return {
        success: false,
        message: "Failed to get held seats",
      };
    }
  }

  private _scheduleAutoRelease(
    showtimeId: string,
    inviteGroupId: string,
    expiresAt: Date
  ): void {
    const timeoutMs = expiresAt.getTime() - Date.now();
    
    if (timeoutMs > 0) {
      setTimeout(async () => {
        try {
          await this.releaseHeldSeats(showtimeId, { inviteGroupId });
          console.log(`Auto-released seats for invite group: ${inviteGroupId}`);
        } catch (error) {
          console.error("Error in auto-release:", error);
        }
      }, timeoutMs);
    }
  }

  async createShowtime(
    showtimeData: CreateShowtimeDTO,
    ownerId: string
  ): Promise<ServiceResponse<IMovieShowtime>> {
    try {
      const validationResult = this._validateShowtimeData(showtimeData);
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const overlapCheckResult = await this._checkShowtimeOverlap(showtimeData);
      if (overlapCheckResult.hasOverlap) {
        return {
          success: false,
          message: overlapCheckResult.message,
        };
      }

      const showtimeCreateData = this._prepareShowtimeCreateData(showtimeData);
      const showtime = await this.showtimeRepository.createShowtime(
        ownerId,
        showtimeCreateData
      );

      return {
        success: true,
        message: "Showtime created successfully",
        data: showtime,
      };
    } catch (error: unknown) {
      console.error("Error creating showtime:", error);
      return this._handleServiceError(error, "Failed to create showtime");
    }
  }

  async updateShowtime(
    id: string,
    updateData: UpdateShowtimeDTO,
    ownerId?: string
  ): Promise<ServiceResponse<IMovieShowtime>> {
    try {
      if (!this._validateObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const processedUpdateData = this._processUpdateData(updateData);

      if (this._requiresTimeSlotValidation(updateData)) {
        const overlapValidation = await this._validateUpdateTimeSlotOverlap(
          id,
          updateData
        );
        if (!overlapValidation.isValid) {
          return {
            success: false,
            message: overlapValidation.message,
          };
        }
      }

      const updatedShowtime = await this.showtimeRepository.updateShowtimeById(
        id,
        processedUpdateData
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
    } catch (error: unknown) {
      console.error("Error updating showtime:", error);
      return this._handleServiceError(error, "Failed to update showtime");
    }
  }

  async getShowtimeById(id: string): Promise<ServiceResponse<IMovieShowtime>> {
    try {
      if (!this._validateObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const showtime = await this.showtimeRepository.getShowtimeById(id);

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
    } catch (error: unknown) {
      console.error("Error getting showtime by id:", error);
      return this._handleServiceError(error, "Failed to retrieve showtime");
    }
  }

  async getShowtimesByScreenAdmin(
    screenId: string,
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse<PaginatedShowtimeResult>> {
    try {
      if (!this._validateObjectId(screenId)) {
        return {
          success: false,
          message: "Invalid screen ID",
        };
      }

      const { page: validPage, limit: validLimit } = this._validatePagination(
        page,
        limit
      );

      const result =
        await this.showtimeRepository.getShowtimesByScreenPaginated(
          screenId,
          validPage,
          validLimit,
          filters
        );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: result,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by screen admin:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getAllShowtimesAdmin(
    page: number,
    limit: number,
    filters?: ShowtimeFilters
  ): Promise<ServiceResponse<PaginatedShowtimeResult>> {
    try {
      const { page: validPage, limit: validLimit } = this._validatePagination(
        page,
        limit
      );

      const result = await this.showtimeRepository.getAllShowtimesPaginated(
        validPage,
        validLimit,
        filters
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: result,
      };
    } catch (error: unknown) {
      console.error("Error getting all showtimes admin:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async updateShowtimeStatus(
    showtimeId: string,
    isActive: boolean
  ): Promise<ServiceResponse<IMovieShowtime>> {
    try {
      if (!this._validateObjectId(showtimeId)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const result = await this.showtimeRepository.updateShowtimeStatus(
        showtimeId,
        isActive
      );

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
    } catch (error: unknown) {
      console.error("Error updating showtime status:", error);
      return this._handleServiceError(
        error,
        "Failed to update showtime status"
      );
    }
  }

  async getShowtimesByScreen(
    screenId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>> {
    try {
      if (!this._validateObjectId(screenId)) {
        return {
          success: false,
          message: "Invalid screen ID",
        };
      }

      const showtimes =
        await this.showtimeRepository.getShowtimesByScreenAndDate(
          screenId,
          date
        );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by screen:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getShowtimesByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>> {
    try {
      if (!this._validateObjectId(movieId)) {
        return {
          success: false,
          message: "Invalid movie ID",
        };
      }

      const showtimes =
        await this.showtimeRepository.getShowtimesByMovieAndDate(movieId, date);

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by movie:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getShowtimesByTheater(
    theaterId: string,
    date: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>> {
    try {
      if (!this._validateObjectId(theaterId)) {
        return {
          success: false,
          message: "Invalid theater ID",
        };
      }

      const showtimes =
        await this.showtimeRepository.getShowtimesByTheaterAndDate(
          theaterId,
          date
        );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by theater:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getShowtimesByOwnerIdPaginated(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<ServiceResponse<{ items: IMovieShowtime[]; total: number }>> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      const { page: validPage, limit: validLimit } = this._validatePagination(
        page,
        limit
      );
      const skip = (validPage - 1) * validLimit;

      const [showtimes, total] = await Promise.all([
        this.showtimeRepository.getShowtimesByOwnerIdPaginated(
          ownerId,
          skip,
          validLimit
        ),
        this.showtimeRepository.countShowtimesByOwnerId(ownerId),
      ]);

      return {
        success: true,
        message: "Paginated showtimes retrieved successfully",
        data: { items: showtimes, total },
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by owner id paginated:", error);
      return this._handleServiceError(
        error,
        "Failed to retrieve paginated showtimes"
      );
    }
  }

  async getShowtimesByOwnerId(
    ownerId: string
  ): Promise<ServiceResponse<IMovieShowtime[]>> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      const showtimes = await this.showtimeRepository.getShowtimesByOwnerId(
        ownerId
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by owner id:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getShowtimesByFilters(
    theaterId: string,
    screenId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ServiceResponse<IMovieShowtime[]>> {
    try {
      const validationResult = this._validateFilterParameters(
        theaterId,
        screenId,
        startDate,
        endDate
      );
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const showtimes = await this.showtimeRepository.getShowtimesByFilters({
        theaterId,
        screenId,
        startDate,
        endDate,
      });

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting showtimes by filters:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async blockShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): Promise<ServiceResponse<void>> {
    try {
      const validationResult = this._validateSeatBlockingData(
        showtimeId,
        seatIds,
        userId,
        sessionId
      );
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const result = await this.showtimeRepository.blockShowtimeSeats(
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
    } catch (error: unknown) {
      console.error("Error blocking showtime seats:", error);
      return this._handleServiceError(error, "Failed to block seats");
    }
  }
  //!soccket to be implemented here
  async releaseShowtimeSeats(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    reason: string
  ): Promise<ServiceResponse<void>> {
    try {
      const validationResult = this._validateSeatReleaseData(
        showtimeId,
        seatIds,
        userId,
        reason
      );
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const result = await this.showtimeRepository.releaseShowtimeSeats(
        showtimeId,
        seatIds,
        userId,
        reason
      );

      if (!result) {
        return {
          success: false,
          message: "Failed to release seats",
        };
      }
      console.log('function started for socket seat cancel');
      
      this.socketService.emitSeatCancellation(showtimeId, seatIds);
      console.log('function ended for socket seat cancel');

      return {
        success: true,
        message: "Seats released successfully",
      };
    } catch (error: unknown) {
      console.error("Error releasing showtime seats:", error);
      return this._handleServiceError(error, "Failed to release seats");
    }
  }
  //!socket to be imple here
  async bookShowtimeSeats(
    showtimeId: string,
    seatIds: string[]
  ): Promise<ServiceResponse<void>> {
    try {
      const validationResult = this._validateSeatBookingData(
        showtimeId,
        seatIds
      );
      if (!validationResult.isValid) {
        return {
          success: false,
          message: validationResult.message,
        };
      }

      const result = await this.showtimeRepository.bookShowtimeSeats(
        showtimeId,
        seatIds
      );

      if (!result) {
        return {
          success: false,
          message: "Failed to book seats",
        };
      }

      this.socketService.emitSeatUpdate(showtimeId, seatIds);
      return {
        success: true,
        message: "Seats booked successfully",
      };
    } catch (error: unknown) {
      console.error("Error booking showtime seats:", error);
      return this._handleServiceError(error, "Failed to book seats");
    }
  }

  async deleteShowtime(id: string): Promise<ServiceResponse<void>> {
    try {
      if (!this._validateObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const deleted = await this.showtimeRepository.deleteShowtimeById(id);

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
    } catch (error: unknown) {
      console.error("Error deleting showtime:", error);
      return this._handleServiceError(error, "Failed to delete showtime");
    }
  }

  async getAllShowtimes(
    page: number = 1,
    limit: number = 10,
    filters: ShowtimeFilters = {}
  ): Promise<
    ServiceResponse<{
      showtimes: IMovieShowtime[];
      pagination: {
        current: number;
        pages: number;
        total: number;
        limit: number;
      };
    }>
  > {
    try {
      const { page: validPage, limit: validLimit } = this._validatePagination(
        page,
        limit
      );

      const showtimes = await this.showtimeRepository.getAllShowtimes(
        validPage,
        validLimit,
        filters
      );

      return {
        success: true,
        message: "Showtimes retrieved successfully",
        data: showtimes,
      };
    } catch (error: unknown) {
      console.error("Error getting all showtimes:", error);
      return this._handleServiceError(error, "Failed to retrieve showtimes");
    }
  }

  async getTheatersByMovie(
    movieId: string,
    date: Date
  ): Promise<ServiceResponse<any[]>> {
    try {
      if (!this._validateObjectId(movieId)) {
        return {
          success: false,
          message: "Invalid movie ID",
        };
      }

      const theaters =
        await this.showtimeRepository.getTheatersByMovieWithShowtimes(
          movieId,
          date
        );

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: theaters,
      };
    } catch (error: unknown) {
      console.error("Error getting theaters by movie:", error);
      return this._handleServiceError(error, "Failed to retrieve theaters");
    }
  }

  async toggleShowtimeStatus(
    id: string,
    currentStatus: boolean
  ): Promise<ServiceResponse<IMovieShowtime>> {
    try {
      if (!this._validateObjectId(id)) {
        return {
          success: false,
          message: "Invalid showtime ID",
        };
      }

      const newStatus = !currentStatus;
      const updatedShowtime = await this.showtimeRepository.updateShowtimeById(
        id,
        {
          isActive: newStatus,
        }
      );

      if (!updatedShowtime) {
        return {
          success: false,
          message: "Showtime not found",
        };
      }

      return {
        success: true,
        message: `Showtime ${
          newStatus ? "activated" : "deactivated"
        } successfully`,
        data: updatedShowtime,
      };
    } catch (error: unknown) {
      console.error("Error toggling showtime status:", error);
      return this._handleServiceError(
        error,
        "Failed to toggle showtime status"
      );
    }
  }

  private _validateObjectId(id: string): boolean {
    return mongoose.isValidObjectId(id);
  }

  private _validatePagination(
    page: number,
    limit: number
  ): { page: number; limit: number } {
    const validPage = page < 1 ? 1 : page;
    const validLimit = limit < 1 || limit > 100 ? 10 : limit;
    return { page: validPage, limit: validLimit };
  }

  private _validateShowtimeData(showtimeData: CreateShowtimeDTO): {
    isValid: boolean;
    message: string;
  } {
    if (
      !showtimeData.movieId ||
      !showtimeData.theaterId ||
      !showtimeData.screenId
    ) {
      return {
        isValid: false,
        message: "Movie ID, Theater ID, and Screen ID are required",
      };
    }

    if (
      !showtimeData.showDate ||
      !showtimeData.showTime ||
      !showtimeData.endTime
    ) {
      return {
        isValid: false,
        message: "Show date, show time, and end time are required",
      };
    }

    return { isValid: true, message: "" };
  }

  private _validateBulkShowtimeTimeGaps(showtimeList: CreateShowtimeDTO[]): {
    isValid: boolean;
    message: string;
  } {
    const groupedByScreenDate: { [key: string]: CreateShowtimeDTO[] } = {};

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

        const gap = this._calculateTimeGapInMinutes(
          current.endTime,
          next.showTime
        );
        if (gap < 30) {
          return {
            isValid: false,
            message: `Insufficient gap between showtimes: ${current.showTime}-${current.endTime} and ${next.showTime}-${next.endTime} (30-min minimum required)`,
          };
        }
      }
    }

    return { isValid: true, message: "" };
  }

  private async _processBulkShowtimeCreation(
    showtimeList: CreateShowtimeDTO[],
    ownerId: string
  ): Promise<{
    created: number;
    skipped: number;
    createdDocs: IMovieShowtime[];
    errors: string[];
  }> {
    let created = 0;
    let skipped = 0;
    let createdDocs: IMovieShowtime[] = [];
    const errors: string[] = [];

    for (const st of showtimeList) {
      const result = await this.createShowtime(st, ownerId);
      if (result.success && result.data) {
        created++;
        createdDocs.push(result.data);
      } else {
        skipped++;
        errors.push(result.message);
      }
    }

    return { created, skipped, createdDocs, errors };
  }

  private async _checkShowtimeOverlap(
    showtimeData: CreateShowtimeDTO
  ): Promise<{ hasOverlap: boolean; message: string }> {
    const bufferMinutes = 30;
    const bufferedStartTime = this._subtractMinutesFromTime(
      showtimeData.showTime,
      bufferMinutes
    );
    const bufferedEndTime = this._addMinutesToTime(
      showtimeData.endTime,
      bufferMinutes
    );

    const hasOverlap =
      await this.showtimeRepository.checkShowtimeTimeSlotOverlap(
        showtimeData.screenId.toString(),
        new Date(showtimeData.showDate),
        bufferedStartTime,
        bufferedEndTime
      );

    if (hasOverlap) {
      return {
        hasOverlap: true,
        message: `Time slot ${showtimeData.showTime}-${showtimeData.endTime} conflicts with existing showtime (30-min buffer required)`,
      };
    }

    return { hasOverlap: false, message: "" };
  }

  private _prepareShowtimeCreateData(
    showtimeData: CreateShowtimeDTO
  ): CreateShowtimeDTO {
    return {
      ...showtimeData,
      movieId: showtimeData.movieId,
      theaterId: showtimeData.theaterId,
      screenId: showtimeData.screenId,
      availableSeats: showtimeData.totalSeats,
      isActive: true,
    };
  }

  private _processUpdateData(updateData: UpdateShowtimeDTO): UpdateShowtimeDTO {
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

    return updates;
  }

  private _requiresTimeSlotValidation(updateData: UpdateShowtimeDTO): boolean {
    return !!(updateData.showDate || updateData.showTime || updateData.endTime);
  }

  private async _validateUpdateTimeSlotOverlap(
    showtimeId: string,
    updateData: UpdateShowtimeDTO
  ): Promise<{ isValid: boolean; message: string }> {
    const currentShowtime = await this.showtimeRepository.getShowtimeById(
      showtimeId
    );
    if (!currentShowtime) {
      return { isValid: false, message: "Showtime not found" };
    }

    const finalShowDate = updateData.showDate || currentShowtime.showDate;
    const finalShowTime = updateData.showTime || currentShowtime.showTime;
    const finalEndTime = updateData.endTime || currentShowtime.endTime;

    let finalScreenId = updateData.screenId || currentShowtime.screenId;

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
    const bufferedStartTime = this._subtractMinutesFromTime(
      finalShowTime,
      bufferMinutes
    );
    const bufferedEndTime = this._addMinutesToTime(finalEndTime, bufferMinutes);

    const hasOverlap =
      await this.showtimeRepository.checkShowtimeTimeSlotOverlap(
        finalScreenId.toString(),
        new Date(finalShowDate),
        bufferedStartTime,
        bufferedEndTime,
        showtimeId
      );

    if (hasOverlap) {
      return {
        isValid: false,
        message: `Time slot ${finalShowTime}-${finalEndTime} conflicts with existing showtime (30-min buffer required)`,
      };
    }

    return { isValid: true, message: "" };
  }

  private _validateFilterParameters(
    theaterId: string,
    screenId: string,
    startDate: Date,
    endDate: Date
  ): { isValid: boolean; message: string } {
    if (!this._validateObjectId(theaterId)) {
      return { isValid: false, message: "Invalid theater ID" };
    }
    if (!this._validateObjectId(screenId)) {
      return { isValid: false, message: "Invalid screen ID" };
    }
    if (!startDate || !endDate) {
      return {
        isValid: false,
        message: "Start date and end date are required",
      };
    }
    if (startDate > endDate) {
      return { isValid: false, message: "Start date must be before end date" };
    }

    return { isValid: true, message: "" };
  }

  private _validateSeatBlockingData(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    sessionId: string
  ): { isValid: boolean; message: string } {
    if (!this._validateObjectId(showtimeId)) {
      return { isValid: false, message: "Invalid showtime ID" };
    }
    if (!seatIds || seatIds.length === 0) {
      return { isValid: false, message: "Seat IDs are required" };
    }
    if (!userId) {
      return { isValid: false, message: "User ID is required" };
    }
    if (!sessionId) {
      return { isValid: false, message: "Session ID is required" };
    }

    return { isValid: true, message: "" };
  }

  private _validateSeatReleaseData(
    showtimeId: string,
    seatIds: string[],
    userId: string,
    reason: string
  ): { isValid: boolean; message: string } {
    if (!this._validateObjectId(showtimeId)) {
      return { isValid: false, message: "Invalid showtime ID" };
    }
    if (!seatIds || seatIds.length === 0) {
      return { isValid: false, message: "Seat IDs are required" };
    }
    if (!userId) {
      return { isValid: false, message: "User ID is required" };
    }
    if (!reason) {
      return { isValid: false, message: "Reason is required" };
    }

    return { isValid: true, message: "" };
  }

  private _validateSeatBookingData(
    showtimeId: string,
    seatIds: string[]
  ): { isValid: boolean; message: string } {
    if (!this._validateObjectId(showtimeId)) {
      return { isValid: false, message: "Invalid showtime ID" };
    }
    if (!seatIds || seatIds.length === 0) {
      return { isValid: false, message: "Seat IDs are required" };
    }

    return { isValid: true, message: "" };
  }

  private _addMinutesToTime(time: string, minutes: number): string {
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

  private _subtractMinutesFromTime(time: string, minutes: number): string {
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

  private _calculateTimeGapInMinutes(
    endTime: string,
    startTime: string
  ): number {
    const [endH, endM] = endTime.split(":").map(Number);
    const [startH, startM] = startTime.split(":").map(Number);
    return startH * 60 + startM - (endH * 60 + endM);
  }

  private _handleServiceError(
    error: unknown,
    defaultMessage: string
  ): ServiceResponse<any> {
    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }
}
