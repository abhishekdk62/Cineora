import { ServiceResponse } from "../../../interfaces/interface";
import { IEmailService } from "../../../services/email.service";
import {
  CreateTheaterDto,
  PaginatedTheatersDto,
  TheaterFilters,
  TheaterResponseDto,
  TheatersByOwnerDto,
  UpdateTheaterDto,
} from "../dtos/dto";
import {

} from "../interfaces/theater.model.interface";
import { ITheaterRepository } from "../interfaces/theater.repository.interface";
import { ITheaterService } from "../interfaces/theater.service.interface";

export class TheaterService implements ITheaterService {
  constructor(
    private readonly theaterRepo: ITheaterRepository,
    private readonly emailService: IEmailService
  ) {}

  async createTheater(
    ownerId: string,
    theaterData: CreateTheaterDto
  ): Promise<ServiceResponse> {
    try {
      const exists = await this.theaterRepo.existsByNameAndCity(
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

      const theater = await this.theaterRepo.create(ownerId, theaterData);

      if (!theater) {
        return {
          success: false,
          message: "Failed to create theater",
        };
      }

      return {
        success: true,
        message: "Theater created successfully",
        data: theater,
      };
    } catch (error: any) {
      if (
        error.message === "Theater with this name already exists in this city"
      ) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getTheaterById(theaterId: string): Promise<ServiceResponse<TheaterResponseDto>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater id is required",
        };
      }

      const theater = await this.theaterRepo.findById(theaterId);

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
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getTheatersByOwnerId(
    ownerId: string,
    filters?: TheaterFilters
  ): Promise<ServiceResponse<TheatersByOwnerDto>> {
    try {
      const result = await this.theaterRepo.findByOwnerId(ownerId, filters);

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getAllTheaters(
    page: number,
    limit: number,
    filters?: TheaterFilters
  ): Promise<ServiceResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      const result = await this.theaterRepo.findAll(page, limit, filters);

      return {
        success: true,
        message: "Theaters retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async updateTheater(
    theaterId: string,
    updateData: UpdateTheaterDto
  ): Promise<ServiceResponse<TheaterResponseDto>> {
    try {
      if (updateData.name || updateData.city || updateData.state) {
        const currentTheater = await this.theaterRepo.findById(theaterId);
        if (!currentTheater) {
          return {
            success: false,
            message: "Theater not found",
          };
        }

        const exists = await this.theaterRepo.existsByNameAndCity(
          updateData.name || currentTheater.name,
          updateData.city || currentTheater.city,
          updateData.state || currentTheater.state,
          theaterId
        );

        if (exists) {
          return {
            success: false,
            message: "Theater with this name already exists in this city",
          };
        }
      }

      const theater = await this.theaterRepo.update(theaterId, updateData);

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
      if (
        error.message === "Theater with this name already exists in this city"
      ) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async toggleTheaterStatus(theaterId: string): Promise<ServiceResponse<TheaterResponseDto>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const theater = await this.theaterRepo.toggleStatus(theaterId);

      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      return {
        success: true,
        message: `Theater ${
          theater.isActive ? "activated" : "deactivated"
        } successfully`,
        data: theater,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async verifyTheater(theaterId: string): Promise<ServiceResponse<TheaterResponseDto>> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const existingTheater = await this.theaterRepo.findById(theaterId);
      if (!existingTheater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      const theater = await this.theaterRepo.verifyTheater(theaterId);
      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      if (
        existingTheater.ownerId &&
        typeof existingTheater.ownerId === "object" &&
        "email" in existingTheater.ownerId
      ) {
        try {
          await this.emailService.sendTheaterVerifiedEmail(
            (existingTheater.ownerId as any).email,
            existingTheater.name
          );
        } catch (emailError) {
          console.error(
            " Failed to send theater verification email:",
            emailError
          );
        }
      }

      return {
        success: true,
        message: "Theater verified successfully",
        data: theater,
      };
    } catch (error: any) {
      console.error("Verify theater error:", error);
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
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

      const existingTheater = await this.theaterRepo.findById(theaterId);
      if (!existingTheater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      const theater = await this.theaterRepo.delete(theaterId);
      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      if (
        existingTheater.ownerId &&
        typeof existingTheater.ownerId === "object" &&
        "email" in existingTheater.ownerId
      ) {
        try {
          await this.emailService.sendTheaterRejectedEmail(
            (existingTheater.ownerId as any).email,
            existingTheater.name,
            rejectionReason ||
              "Your theater application did not meet our requirements."
          );
        } catch (emailError) {
          console.error(
            "❌ Failed to send theater rejection email:",
            emailError
          );
        }
      }

      return {
        success: true,
        message: "Theater rejected successfully",
        data: {deleted: true,
},
      };
    } catch (error: any) {
      console.error("Reject theater error:", error);
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
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

      const deleted = await this.theaterRepo.delete(theaterId);

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
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getNearbyTheaters(
    longitude: number,
    latitude: number,
    maxDistance: number
  ): Promise<ServiceResponse<TheaterResponseDto[]>> {
    try {
      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return {
          success: false,
          message: "Valid coordinates are required",
        };
      }

      if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        return {
          success: false,
          message: "Invalid coordinate values",
        };
      }

      if (maxDistance <= 0) {
        return {
          success: false,
          message: "Max distance must be greater than 0",
        };
      }

      const theaters = await this.theaterRepo.findNearby(
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
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }


  async getTheatersWithFilters(filters: TheaterFilters):Promise<PaginatedTheatersDto>
 {
    const {
      search = "",
      sortBy = "nearby",
      page = 1,
      limit = 6,
      latitude,
      longitude,
    } = filters;

    const result = await this.theaterRepo.findWithFilters({
      search,
      sortBy,
      page,
      limit,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
    });

    return {
      theaters: result.theaters,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: page as number,
      hasNextPage: page as number < result.totalPages,
      hasPrevPage: page as number > 1,
    };
  }

  async getTheaterByOwnerAndName(
    ownerId: string,
    name: string
  ): Promise<ServiceResponse<TheaterResponseDto>> {
    try {
      const theater = await this.theaterRepo.findByOwnerIdAndName(
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
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
}
