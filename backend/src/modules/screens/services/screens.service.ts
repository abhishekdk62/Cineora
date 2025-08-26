import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongoose";

import { ITheaterRepository } from "../../theaters/interfaces/theater.repository.interface";
import { IScreenService } from "../interfaces/screens.services.interface";
import { IScreenRepository } from "../interfaces/screens.repository.interface";
import { IScreen } from "../interfaces/screens.model.interface";
import {
  AdvancedScreenFilters,
  CreateScreenDto,
  PaginatedScreenResult,
  ScreenCountResponseDto,
  ScreenExistsResponseDto,
  ScreenFilters,
  ScreenResponseDto,
  ScreenStatsResponseDto,
  ScreenWithStatisticsResult,
  UpdateScreenDto,
} from "../dtos/dtos";
import { ServiceResponse } from "../../../interfaces/interface";

export class ScreenService implements IScreenService {
  constructor(
    private readonly screenRepo: IScreenRepository,
    private readonly theaterRepo: ITheaterRepository
  ) {}

  async createScreen(
    screenData: CreateScreenDto
  ): Promise<ServiceResponse> {
    try {
      if (!screenData.theater._id) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }
      if (screenData.totalSeats <= 0) {
        return {
          success: false,
          message: "Total seats must be greater than 0",
        };
      }

      const theaterIdString = screenData.theater._id.toString();
      const exists = await this.screenRepo.existsByNameAndTheater(
        screenData.name,
        theaterIdString
      );

      const existtheater = await this.theaterRepo.findById(theaterIdString);
      if (!existtheater.isVerified) {
        return {
          success: false,
          message: "Theater needs to be verified first",
        };
      }

      if (exists) {
        return {
          success: false,
          message: "Screen with this name already exists in this theater",
        };
      }

      let data = {
        theaterId: new Types.ObjectId(screenData.theater._id),
        name: screenData.name,
        totalSeats: screenData.totalSeats,
        layout: screenData.layout,
        isActive: true,
      };
      const screen = await this.screenRepo.create(data);
      if (!screen) {
        return {
          success: false,
          message: "Failed to create screen",
        };
      }

      const theater = await this.theaterRepo.incrementScreenCount(
        screenData.theater._id
      );

      return {
        success: true,
        message: "Screen created successfully",
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async deleteScreen(screenId: string): Promise<ServiceResponse> {
    try {
      if (!screenId) {
        return {
          success: false,
          message: "Screen ID is required",
        };
      }

      const deleted = await this.screenRepo.delete(screenId);

      if (!deleted) {
        return {
          success: false,
          message: "Screen not found or deletion failed",
        };
      }
      await this.theaterRepo.decrementScreenCount(deleted.theaterId);
      return {
        success: true,
        message: "Screen deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async deleteScreensByTheater(theaterId: string): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const deletedCount = await this.screenRepo.deleteMany(theaterId);

      if (deletedCount === 0) {
        return {
          success: false,
          message: "No screens found for this theater",
        };
      }

      return {
        success: true,
        message: `${deletedCount} screens deleted successfully`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getScreensTheaterData(
    screenId: string
  ): Promise<ServiceResponse> {
    try {
      if (!screenId) {
        return {
          success: false,
          message: "Screen ID is required",
        };
      }
      const screen = await this.screenRepo.findByIdGetTheaterDetails(screenId);
      if (!screen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }
      if (
        typeof screen.theaterId === "object" &&
        "isActive" in screen.theaterId
      ) {
        if (!screen.theaterId.isActive) {
          return {
            success: false,
            message: "Please enable the theater first",
          };
        }
      }

      return {
        success: true,
        message: "Screen retrieved successfully",
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getScreenById(
    screenId: string
  ): Promise<ServiceResponse> {
    try {
      if (!screenId) {
        return {
          success: false,
          message: "Screen ID is required",
        };
      }

      const screen = await this.screenRepo.findById(screenId);

      if (!screen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }

      return {
        success: true,
        message: "Screen retrieved successfully",
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getScreensByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const screens = await this.screenRepo.findByTheaterId(theaterId);

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: screens,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
  async getScreenStats(
    theaterId: string
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const screens = await this.screenRepo.findByTheaterId(theaterId);

      const totalScreens = screens.length;
      const activeScreens = screens.filter((screen) => screen.isActive).length;
      const inactiveScreens = totalScreens - activeScreens;

      const totalSeats = screens.reduce(
        (sum, screen) => sum + screen.totalSeats,
        0
      );

      const seatTypeDistribution = {
        Normal: 0,
        Premium: 0,
        VIP: 0,
      };

      let totalRevenuePotential = 0;

      screens.forEach((screen) => {
        if (screen.layout?.advancedLayout?.rows) {
          screen.layout.advancedLayout.rows.forEach((row) => {
            row.seats.forEach((seat) => {
              if (
                seatTypeDistribution[
                  seat.type as keyof typeof seatTypeDistribution
                ] !== undefined
              ) {
                seatTypeDistribution[
                  seat.type as keyof typeof seatTypeDistribution
                ]++;
              }
              totalRevenuePotential += seat.price;
            });
          });
        }
      });

      const avgSeatsPerScreen =
        totalScreens > 0 ? Math.round(totalSeats / totalScreens) : 0;

      const screenTypeDistribution: Record<string, number> = {};
      screens.forEach((screen) => {
        const type = screen.screenType || "Standard";
        screenTypeDistribution[type] = (screenTypeDistribution[type] || 0) + 1;
      });

      const featuresDistribution: Record<string, number> = {};
      screens.forEach((screen) => {
        if (screen.features && screen.features.length > 0) {
          screen.features.forEach((feature) => {
            featuresDistribution[feature] =
              (featuresDistribution[feature] || 0) + 1;
          });
        }
      });

      const stats = {
        overview: {
          totalScreens,
          activeScreens,
          inactiveScreens,
          totalSeats,
          avgSeatsPerScreen,
        },
        seatDistribution: {
          byType: seatTypeDistribution,
          totalRevenuePotential: Math.round(totalRevenuePotential),
        },
        screenTypes: screenTypeDistribution,
        popularFeatures: Object.entries(featuresDistribution)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
        utilizationRate:
          totalScreens > 0
            ? Math.round((activeScreens / totalScreens) * 100)
            : 0,
      };

      return {
        success: true,
        message: "Screen statistics retrieved successfully",
        data: stats,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getScreensByTheaterIdWithFilters(
    theaterId: string,
    filters?: AdvancedScreenFilters
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const result = await this.screenRepo.findByTheaterIdWithFilters(
        theaterId,
        filters
      );

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getAllScreens(
    page: number,
    limit: number,
    filters?: ScreenFilters
  ): Promise<ServiceResponse> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      const result = await this.screenRepo.findAll(page, limit, filters);

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async updateScreen(
    screenId: string,
    updateData: UpdateScreenDto
  ): Promise<ServiceResponse> {
    try {
      if (!screenId) {
        return {
          success: false,
          message: "Screen ID is required",
        };
      }

      if (updateData.totalSeats && updateData.totalSeats <= 0) {
        return {
          success: false,
          message: "Total seats must be greater than 0",
        };
      }

      if (updateData.layout) {
        if (
          !updateData.layout.advancedLayout ||
          !updateData.layout.advancedLayout.rows
        ) {
          return {
            success: false,
            message: "Advanced layout with rows is required",
          };
        }
      }

      if (updateData.name) {
        const currentScreen = await this.screenRepo.findById(screenId);
        if (!currentScreen) {
          return {
            success: false,
            message: "Screen not found",
          };
        }

        const theaterIdString = currentScreen.theaterId._id.toString();

        const exists = await this.screenRepo.existsByNameAndTheater(
          updateData.name,
          theaterIdString,
          screenId
        );

        if (exists) {
          return {
            success: false,
            message: "Screen with this name already exists in this theater",
          };
        }
      }

      const screen = await this.screenRepo.update(screenId, updateData);

      if (!screen) {
        return {
          success: false,
          message: "Screen not found or update failed",
        };
      }

      return {
        success: true,
        message: "Screen updated successfully",
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async toggleScreenStatus(
    screenId: string
  ): Promise<ServiceResponse> {
    try {
      if (!screenId) {
        return {
          success: false,
          message: "Screen ID is required",
        };
      }

      const screen = await this.screenRepo.toggleStatus(screenId);

      if (!screen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }

      return {
        success: true,
        message: `Screen ${
          screen.isActive ? "activated" : "deactivated"
        } successfully`,
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async checkScreenExists(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<ServiceResponse> {
    try {
      if (!name || !theaterId) {
        return {
          success: false,
          message: "Name and theater ID are required",
        };
      }

      const exists = await this.screenRepo.existsByNameAndTheater(
        name,
        theaterId,
        excludedId
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

  async getScreenByTheaterAndName(
    theaterId: string,
    name: string
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId || !name) {
        return {
          success: false,
          message: "Theater ID and name are required",
        };
      }

      const screen = await this.screenRepo.findByTheaterIdAndName(
        theaterId,
        name
      );

      if (!screen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }

      return {
        success: true,
        message: "Screen retrieved successfully",
        data: screen,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getActiveScreensByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const screens = await this.screenRepo.findActiveByTheaterId(theaterId);

      return {
        success: true,
        message: "Active screens retrieved successfully",
        data: screens,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }

  async getScreenCountByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse> {
    try {
      if (!theaterId) {
        return {
          success: false,
          message: "Theater ID is required",
        };
      }

      const count = await this.screenRepo.countByTheaterId(theaterId);

      return {
        success: true,
        message: "Screen count retrieved successfully",
        data: { count },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  }
}
