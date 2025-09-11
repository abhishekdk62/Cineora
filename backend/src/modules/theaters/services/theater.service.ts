import { ServiceResponse } from "../../../interfaces/interface";
import { IEmailService } from "../../../services/email.service";
import {
  CreateTheaterDTO,
  UpdateTheaterDTO,
  TheaterFilters,
  TheaterListResponseDTO,
  TheaterPaginationDTO,
  TheaterStatsDTO
} from "../dtos/dto";
import { ITheater } from "../interfaces/theater.model.interface";
import { ITheaterRepository } from "../interfaces/theater.repository.interface";
import { ITheaterService } from "../interfaces/theater.service.interface";

export class TheaterService implements ITheaterService {
  constructor(
    private readonly theaterRepository: ITheaterRepository,
    private readonly emailService: IEmailService
  ) {}

  async createTheater(
    ownerId: string,
    theaterData: CreateTheaterDTO
  ): Promise<ServiceResponse<ITheater>> {
    try {
      if (!this._validateRequiredFields(theaterData)) {
        return {
          success: false,
          message: "Required fields are missing",
        };
      }

      const exists = await this.theaterRepository.theaterExistsByNameAndCity(
        theaterData.name,
        theaterData.city,
        theaterData.state
      );

      if (exists) {
        return {
          success: false,
          message: "Theater with this name already exists in this city",
        };
      }

      const theater = await this.theaterRepository.createTheater(ownerId, theaterData);

      return {
        success: true,
        message: "Theater created successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Error creating theater:", error);
      return this._handleServiceError(error, "Failed to create theater");
    }
  }

  async getTheaterById(theaterId: string): Promise<ServiceResponse<ITheater>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const theater = await this.theaterRepository.getTheaterById(theaterId);

      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      return {
        success: true,
        message: "Theater retrieved successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Error getting theater by ID:", error);
      return this._handleServiceError(error, "Failed to retrieve theater");
    }
  }

  async getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<{
    theaters: ITheater[];
    totalFiltered: number;
    inactiveAll: number;
    activeAll: number;
    totalAll: number;
  }>> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      const result = await this.theaterRepository.getTheatersByOwnerId(ownerId, filters);

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      console.error("Error getting theaters by owner ID:", error);
      return this._handleServiceError(error, "Failed to retrieve theaters");
    }
  }

  async getAllTheaters(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<{ theaters: ITheater[]; total: number }>> {
    try {
      const validatedPage = this._validatePagination(page, limit);
      
      const result = await this.theaterRepository.getAllTheaters(
        validatedPage.page, 
        validatedPage.limit, 
        filters
      );

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      console.error("Error getting all theaters:", error);
      return this._handleServiceError(error, "Failed to retrieve theaters");
    }
  }

  async updateTheater(
    theaterId: string,
    updateData: UpdateTheaterDTO
  ): Promise<ServiceResponse<ITheater>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      if (await this._shouldCheckDuplicateName(theaterId, updateData)) {
        const isDuplicate = await this._checkTheaterNameDuplicate(theaterId, updateData);
        if (isDuplicate) {
          return {
            success: false,
            message: "Theater with this name already exists in this city",
          };
        }
      }

      const theater = await this.theaterRepository.updateTheater(theaterId, updateData);

      if (!theater) {
        return {
          success: false,
          message: "Theater not found or update failed",
        };
      }

      return {
        success: true,
        message: "Theater updated successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Error updating theater:", error);
      return this._handleServiceError(error, "Failed to update theater");
    }
  }

  async toggleTheaterStatus(theaterId: string): Promise<ServiceResponse<ITheater>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const theater = await this.theaterRepository.toggleTheaterStatus(theaterId);

      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      return {
        success: true,
        message: `Theater ${theater.isActive ? "activated" : "deactivated"} successfully`,
        data: theater,
      };
    } catch (error: any) {
      console.error("Error toggling theater status:", error);
      return this._handleServiceError(error, "Failed to toggle theater status");
    }
  }

  async verifyTheater(theaterId: string): Promise<ServiceResponse<ITheater>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const existingTheater = await this.theaterRepository.getTheaterById(theaterId);
      if (!existingTheater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      const theater = await this.theaterRepository.verifyTheater(theaterId);
      if (!theater) {
        return {
          success: false,
          message: "Failed to verify theater",
        };
      }

      await this._sendTheaterVerificationEmail(existingTheater);

      return {
        success: true,
        message: "Theater verified successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Error verifying theater:", error);
      return this._handleServiceError(error, "Failed to verify theater");
    }
  }

  async rejectTheater(
    theaterId: string,
    rejectionReason?: string
  ): Promise<ServiceResponse<{ deleted: boolean }>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const existingTheater = await this.theaterRepository.getTheaterById(theaterId);
      if (!existingTheater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      const deleted = await this.theaterRepository.deleteTheater(theaterId);
      if (!deleted) {
        return {
          success: false,
          message: "Failed to reject theater",
        };
      }

      await this._sendTheaterRejectionEmail(existingTheater, rejectionReason);

      return {
        success: true,
        message: "Theater rejected successfully",
        data: { deleted: true },
      };
    } catch (error: any) {
      console.error("Error rejecting theater:", error);
      return this._handleServiceError(error, "Failed to reject theater");
    }
  }

  async deleteTheater(theaterId: string): Promise<ServiceResponse<void>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const deleted = await this.theaterRepository.deleteTheater(theaterId);

      if (!deleted) {
        return {
          success: false,
          message: "Theater not found or deletion failed",
        };
      }

      return {
        success: true,
        message: "Theater deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting theater:", error);
      return this._handleServiceError(error, "Failed to delete theater");
    }
  }

  async getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ServiceResponse<ITheater[]>> {
    try {
      const coordinatesValidation = this._validateCoordinates(longitude, latitude);
      if (!coordinatesValidation.isValid) {
        return {
          success: false,
          message: coordinatesValidation.message,
        };
      }

      if (maxDistance <= 0) {
        return {
          success: false,
          message: "Max distance must be greater than 0",
        };
      }

      const theaters = await this.theaterRepository.getNearbyTheaters(
        longitude,
        latitude,
        maxDistance
      );

      return {
        success: true,
        message: "Nearby theaters retrieved successfully",
        data: theaters,
      };
    } catch (error: any) {
      console.error("Error getting nearby theaters:", error);
      return this._handleServiceError(error, "Failed to retrieve nearby theaters");
    }
  }

  async getTheatersWithFilters(filters: TheaterFilters): Promise<{
    theaters: ITheater[];
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    try {
      const processedFilters = this._processTheaterFilters(filters);
      
      const result = await this.theaterRepository.getTheatersWithFilters(processedFilters);
      
      const currentPage = processedFilters.page as number;
      
      return {
        theaters: result.theaters,
        total: result.total,
        totalPages: result.totalPages,
        currentPage,
        hasNextPage: currentPage < result.totalPages,
        hasPrevPage: currentPage > 1,
      };
    } catch (error: any) {
      console.error("Error getting theaters with filters:", error);
      throw error;
    }
  }

  async getTheaterByOwnerAndName(
    ownerId: string,
    name: string
  ): Promise<ServiceResponse<ITheater>> {
    try {
      if (!ownerId || !name) {
        return {
          success: false,
          message: "Owner ID and name are required",
        };
      }

      const theater = await this.theaterRepository.getTheaterByOwnerIdAndName(
        ownerId,
        name
      );

      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      return {
        success: true,
        message: "Theater retrieved successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Error getting theater by owner and name:", error);
      return this._handleServiceError(error, "Failed to retrieve theater");
    }
  }

  private _validateRequiredFields(theaterData: CreateTheaterDTO): boolean {
    return !!(
      theaterData.name &&
      theaterData.address &&
      theaterData.city &&
      theaterData.state &&
      theaterData.pincode &&
      theaterData.phone &&
      theaterData.location
    );
  }

  private _validatePagination(page: number, limit: number): { page: number; limit: number } {
    const validatedPage = page < 1 ? 1 : page;
    const validatedLimit = limit < 1 || limit > 100 ? 10 : limit;
    return { page: validatedPage, limit: validatedLimit };
  }

  private _validateCoordinates(longitude: number, latitude: number): { isValid: boolean; message: string } {
    if (typeof longitude !== "number" || typeof latitude !== "number") {
      return { isValid: false, message: "Valid coordinates are required" };
    }

    if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
      return { isValid: false, message: "Invalid coordinate values" };
    }

    return { isValid: true, message: "" };
  }

  private async _shouldCheckDuplicateName(theaterId: string, updateData: UpdateTheaterDTO): Promise<boolean> {
    return !!(updateData.name || updateData.city || updateData.state);
  }

  private async _checkTheaterNameDuplicate(theaterId: string, updateData: UpdateTheaterDTO): Promise<boolean> {
    const currentTheater = await this.theaterRepository.getTheaterById(theaterId);
    if (!currentTheater) {
      return false;
    }

    return await this.theaterRepository.theaterExistsByNameAndCity(
      updateData.name || currentTheater.name,
      updateData.city || currentTheater.city,
      updateData.state || currentTheater.state,
      theaterId
    );
  }

  private async _sendTheaterVerificationEmail(theater: ITheater): Promise<void> {
    try {
      if (this._isTheaterOwnerEmailAvailable(theater)) {
        await this.emailService.sendTheaterVerifiedEmail(
          (theater.ownerId as any).email,
          theater.name
        );
      }
    } catch (emailError) {
      console.error("Failed to send theater verification email:", emailError);
    }
  }

  private async _sendTheaterRejectionEmail(theater: ITheater, rejectionReason?: string): Promise<void> {
    try {
      if (this._isTheaterOwnerEmailAvailable(theater)) {
        await this.emailService.sendTheaterRejectedEmail(
          (theater.ownerId as any).email,
          theater.name,
          rejectionReason || "Your theater application did not meet our requirements."
        );
      }
    } catch (emailError) {
      console.error("Failed to send theater rejection email:", emailError);
    }
  }

  private _isTheaterOwnerEmailAvailable(theater: ITheater): boolean {
    return !!(
      theater.ownerId &&
      typeof theater.ownerId === "object" &&
      "email" in theater.ownerId
    );
  }

  private _processTheaterFilters(filters: TheaterFilters): TheaterFilters {
    const {
      search = "",
      sortBy = "nearby",
      page = 1,
      limit = 6,
      latitude,
      longitude,
      facilities
    } = filters;

    return {
      search,
      sortBy,
      page,
      limit,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      facilities
    };
  }

  private _handleServiceError(error: any, defaultMessage: string): ServiceResponse<any> {
    if (error.message === "Theater with this name already exists in this city") {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }
}
