import {
  ITheater,
  ITheaterRepository,
  ServiceResponse,
} from "../interfaces/theater.interface";

export class TheaterService {
  constructor(private theaterRepo: ITheaterRepository) {}

  async createTheater(ownerId: string, theaterData: ITheater): Promise<ServiceResponse> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

      if (!theaterData.name || !theaterData.address || !theaterData.city || !theaterData.state) {
        return {
          success: false,
          message: "Name, address, city, and state are required",
        };
      }

      if (
        !theaterData.location?.coordinates ||
        theaterData.location.coordinates.length < 2
      ) {
        return {
          success: false,
          message: "Valid location coordinates are required",
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
      if (error.message === "Theater with this name already exists in this city") {
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

  async getTheaterById(theaterId: string): Promise<ServiceResponse> {
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
    filters?: any
  ): Promise<ServiceResponse> {
    try {
      if (!ownerId) {
        return {
          success: false,
          message: "Owner ID is required",
        };
      }

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
    filters?: any
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
    updateData: Partial<ITheater>
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
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
      if (error.message === "Theater with this name already exists in this city") {
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

  async toggleTheaterStatus(theaterId: string): Promise<ServiceResponse> {
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
        message: `Theater ${theater.isActive ? "activated" : "deactivated"} successfully`,
        data: theater,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async verifyTheater(theaterId: string): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const theater = await this.theaterRepo.verifyTheater(theaterId);

      if (!theater) {
        return {
          success: false,
          message: "Theater not found",
        };
      }

      return {
        success: true,
        message: "Theater verified successfully",
        data: theater,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async deleteTheater(theaterId: string): Promise<ServiceResponse> {
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
  ): Promise<ServiceResponse> {
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

  async checkTheaterExists(
    name: string,
    city: string,
    state: string,
    excludeId?: string
  ): Promise<ServiceResponse> {
    try {
      if (!name || !city || !state) {
        return {
          success: false,
          message: "Name, city, and state are required",
        };
      }

      const exists = await this.theaterRepo.existsByNameAndCity(
        name,
        city,
        state,
        excludeId
      );

      return {
        success: true,
        message: "Check completed successfully",
        data: { exists },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getTheaterByOwnerAndName(
    ownerId: string,
    name: string
  ): Promise<ServiceResponse> {
    try {
      if (!ownerId || !name) {
        return {
          success: false,
          message: "Owner ID and name are required",
        };
      }

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
