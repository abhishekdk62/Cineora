import { Types } from "mongoose";
import { ITheaterRepository } from "../../theaters/interfaces/theater.repository.interface";

import {
  CreateScreenDto,
  UpdateScreenDto,
  ScreenFilterDto,
  AdvancedScreenFilterDto,
  ScreenStatsDto,
  ScreenExistsDto,
  ScreenCountDto,
  PaginatedScreenResultDto,
} from "../dtos/dtos";
import { ServiceResponse } from "../../../interfaces/interface";
import { IScreenRepository } from "../interfaces/screens.repository.interface";
import { IScreenService } from "../interfaces/screens.services.interface";
import { IScreen } from "../interfaces/screens.model.interface";

export class ScreenService implements IScreenService {
  constructor(
    private readonly screenRepository: IScreenRepository,
    private readonly theaterRepository: ITheaterRepository
  ) {}

  async createScreen(
    screenData: CreateScreenDto
  ): Promise<ServiceResponse<IScreen>> {
    try {
      this._validateCreateScreenData(screenData);
//@ts-ignore
      const theaterIdString =        screenData.theater!._id.toString() || screenData?.theaterId;

      const theater = await this.theaterRepository.getTheaterById(
        theaterIdString
      );
      if (!theater?.isVerified) {
        return {
          success: false,
          message: "Theater needs to be verified first",
        };
      }

      const screenExists =
        await this.screenRepository.checkScreenExistsByNameAndTheater(
          screenData.name,
          theaterIdString
        );

      if (screenExists) {
        return {
          success: false,
          message: "Screen with this name already exists in this theater",
        };
      }

      const processedData: CreateScreenDto = {
        //@ts-ignore
        theaterId: new Types.ObjectId(screenData.theater!._id)||new Types.ObjectId(screenData?.theaterId),
        name: screenData.name.trim(),
        totalSeats: screenData.totalSeats,
        layout: {
          ...screenData.layout,
          advancedLayout: {
            ...screenData.layout.advancedLayout,
            aisles: screenData.layout.advancedLayout.aisles || {
              vertical: [],
              horizontal: [],
            },
          },
        },
        screenType: screenData.screenType || "Standard",
        features:
          screenData.features?.filter(
            (feature) =>
              feature && typeof feature === "string" && feature.trim() !== ""
          ) || [],
        isActive: true,
      };

      const screen = await this.screenRepository.createScreen(processedData);

      await this.theaterRepository.incrementTheaterScreenCount(theaterIdString);

      return {
        success: true,
        message: "Screen created successfully",
        data: screen,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to create screen");
    }
  }

  async getScreenById(screenId: string): Promise<ServiceResponse<IScreen>> {
    try {
      this._validateScreenId(screenId);

      const screen = await this.screenRepository.getScreenById(screenId);

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
    } catch (error) {
      return this._handleServiceError(error, "Failed to get screen");
    }
  }

  async getScreensByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse<IScreen[]>> {
    try {
      this._validateTheaterId(theaterId);

      const screens = await this.screenRepository.getScreensByTheaterId(
        theaterId
      );

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: screens,
      };
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to get screens by theater ID"
      );
    }
  }

  async getActiveScreensByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse<IScreen[]>> {
    try {
      this._validateTheaterId(theaterId);

      const screens = await this.screenRepository.getActiveScreensByTheaterId(
        theaterId
      );

      return {
        success: true,
        message: "Active screens retrieved successfully",
        data: screens,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to get active screens");
    }
  }

  async getScreenWithTheaterData(
    screenId: string
  ): Promise<ServiceResponse<IScreen>> {
    try {
      this._validateScreenId(screenId);

      const screen =
        await this.screenRepository.getScreenByIdWithTheaterDetails(screenId);

      if (!screen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }

      if (this._isTheaterInactive(screen)) {
        return {
          success: false,
          message: "Please enable the theater first",
        };
      }

      return {
        success: true,
        message: "Screen retrieved successfully",
        data: screen,
      };
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to get screen with theater data"
      );
    }
  }

  async getAllScreensPaginated(
    page: number,
    limit: number,
    filters?: ScreenFilterDto
  ): Promise<ServiceResponse<PaginatedScreenResultDto>> {
    try {
      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      const result = await this.screenRepository.getAllScreensPaginated(
        page,
        limit,
        filters
      );

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: result,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to get paginated screens");
    }
  }

  async getScreensByTheaterIdWithAdvancedFilters(
    theaterId: string,
    filters: AdvancedScreenFilterDto
  ): Promise<ServiceResponse<any>> {
    try {
      this._validateTheaterId(theaterId);

      const result =
        await this.screenRepository.getScreensByTheaterIdWithAdvancedFilters(
          theaterId,
          filters
        );

      return {
        success: true,
        message: "Screens retrieved successfully",
        data: result,
      };
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to get screens with advanced filters"
      );
    }
  }

  async getScreenStatisticsByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse<ScreenStatsDto>> {
    try {
      this._validateTheaterId(theaterId);

      const screens = await this.screenRepository.getScreensByTheaterId(
        theaterId
      );
      const stats = this._calculateScreenStatistics(screens);

      return {
        success: true,
        message: "Screen statistics retrieved successfully",
        data: stats,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to get screen statistics");
    }
  }

  async updateScreen(
    screenId: string,
    updateData: UpdateScreenDto
  ): Promise<ServiceResponse<IScreen>> {
    try {
      this._validateScreenId(screenId);
      this._validateUpdateScreenData(updateData);

      const currentScreen = await this.screenRepository.getScreenById(screenId);
      if (!currentScreen) {
        return {
          success: false,
          message: "Screen not found",
        };
      }

      if (updateData.name) {
        const theaterIdString = this._extractTheaterIdString(
          currentScreen.theaterId
        );
        const nameExists =
          await this.screenRepository.checkScreenExistsByNameAndTheater(
            updateData.name,
            theaterIdString,
            screenId
          );

        if (nameExists) {
          return {
            success: false,
            message: "Screen with this name already exists in this theater",
          };
        }
      }

      const updatedScreen = await this.screenRepository.updateScreen(
        screenId,
        updateData
      );

      return {
        success: true,
        message: "Screen updated successfully",
        data: updatedScreen,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to update screen");
    }
  }

  async toggleScreenStatus(
    screenId: string
  ): Promise<ServiceResponse<IScreen>> {
    try {
      this._validateScreenId(screenId);

      const screen = await this.screenRepository.toggleScreenStatus(screenId);

      return {
        success: true,
        message: `Screen ${
          screen.isActive ? "activated" : "deactivated"
        } successfully`,
        data: screen,
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to toggle screen status");
    }
  }

  async deleteScreen(screenId: string): Promise<ServiceResponse<void>> {
    try {
      this._validateScreenId(screenId);

      const deletedScreen = await this.screenRepository.deleteScreen(screenId);

      const theaterIdString = this._extractTheaterIdString(
        deletedScreen.theaterId
      );
      await this.theaterRepository.decrementTheaterScreenCount(theaterIdString);

      return {
        success: true,
        message: "Screen deleted successfully",
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to delete screen");
    }
  }

  async deleteScreensByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse<{ deletedCount: number }>> {
    try {
      this._validateTheaterId(theaterId);

      const deletedCount = await this.screenRepository.deleteScreensByTheaterId(
        theaterId
      );

      if (deletedCount === 0) {
        return {
          success: false,
          message: "No screens found for this theater",
        };
      }

      return {
        success: true,
        message: `${deletedCount} screens deleted successfully`,
        data: { deletedCount },
      };
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to delete screens by theater ID"
      );
    }
  }

  async checkScreenExists(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<ServiceResponse<ScreenExistsDto>> {
    try {
      if (!name || !theaterId) {
        return {
          success: false,
          message: "Name and theater ID are required",
        };
      }

      const exists =
        await this.screenRepository.checkScreenExistsByNameAndTheater(
          name,
          theaterId,
          excludedId
        );

      return {
        success: true,
        message: "Check completed successfully",
        data: { exists },
      };
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to check screen existence"
      );
    }
  }

  async getScreenByTheaterAndName(
    theaterId: string,
    name: string
  ): Promise<ServiceResponse<IScreen>> {
    try {
      if (!theaterId || !name) {
        return {
          success: false,
          message: "Theater ID and name are required",
        };
      }

      const screen = await this.screenRepository.getScreenByTheaterIdAndName(
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
    } catch (error) {
      return this._handleServiceError(
        error,
        "Failed to get screen by theater and name"
      );
    }
  }

  async getScreenCountByTheaterId(
    theaterId: string
  ): Promise<ServiceResponse<ScreenCountDto>> {
    try {
      this._validateTheaterId(theaterId);

      const count = await this.screenRepository.countScreensByTheaterId(
        theaterId
      );

      return {
        success: true,
        message: "Screen count retrieved successfully",
        data: { count },
      };
    } catch (error) {
      return this._handleServiceError(error, "Failed to get screen count");
    }
  }

  private _validateScreenId(screenId: string): void {
    if (!screenId) {
      throw new Error("Screen ID is required");
    }
  }

  private _validateTheaterId(theaterId: string): void {
    if (!theaterId) {
      throw new Error("Theater ID is required");
    }
  }

  private _validateCreateScreenData(screenData: CreateScreenDto): void {
    if (!screenData.name || screenData.name.trim().length === 0) {
      throw new Error("Screen name is required");
    }
    if (screenData.totalSeats <= 0) {
      throw new Error("Total seats must be greater than 0");
    }
    if (
      !screenData.layout?.advancedLayout?.rows ||
      screenData.layout.advancedLayout.rows.length === 0
    ) {
      throw new Error("Advanced layout with rows is required");
    }

    // ADD THIS: Validate aisle configuration
    if (screenData.layout?.advancedLayout?.aisles) {
      const aisles = screenData.layout.advancedLayout.aisles;
      const maxSeatsPerRow = screenData.layout.seatsPerRow;
      const maxRows = screenData.layout.rows;

      // Validate vertical aisles
      if (aisles.vertical) {
        aisles.vertical.forEach((aisle, index) => {
          if (!aisle.id || typeof aisle.id !== "string") {
            throw new Error(`Vertical aisle ${index + 1}: ID is required`);
          }
          if (aisle.position < 1 || aisle.position > maxSeatsPerRow) {
            throw new Error(
              `Vertical aisle ${
                index + 1
              }: Position must be between 1 and ${maxSeatsPerRow}`
            );
          }
          if (aisle.width < 1 || aisle.width > 2) {
            throw new Error(
              `Vertical aisle ${index + 1}: Width must be 1 or 2 units`
            );
          }
        });
      }

      // Validate horizontal aisles
      if (aisles.horizontal) {
        aisles.horizontal.forEach((aisle, index) => {
          if (!aisle.id || typeof aisle.id !== "string") {
            throw new Error(`Horizontal aisle ${index + 1}: ID is required`);
          }
          if (aisle.afterRow < 0 || aisle.afterRow >= maxRows) {
            throw new Error(
              `Horizontal aisle ${index + 1}: After row must be between 0 and ${
                maxRows - 1
              }`
            );
          }
          if (aisle.width < 1 || aisle.width > 2) {
            throw new Error(
              `Horizontal aisle ${index + 1}: Width must be 1 or 2 units`
            );
          }
        });
      }
    }

    // ADD THIS: Validate seats structure
    screenData.layout.advancedLayout.rows.forEach((row, rowIndex) => {
      if (!row.rowLabel) {
        throw new Error(`Row ${rowIndex + 1}: Row label is required`);
      }
      if (row.offset < 0) {
        throw new Error(`Row ${rowIndex + 1}: Offset cannot be negative`);
      }
      if (!row.seats || row.seats.length === 0) {
        throw new Error(`Row ${rowIndex + 1}: At least one seat is required`);
      }

      row.seats.forEach((seat, seatIndex) => {
        if (!seat.id || typeof seat.id !== "string") {
          throw new Error(
            `Row ${rowIndex + 1}, Seat ${seatIndex + 1}: Seat ID is required`
          );
        }
        if (!seat.type || typeof seat.type !== "string") {
          throw new Error(
            `Row ${rowIndex + 1}, Seat ${seatIndex + 1}: Seat type is required`
          );
        }
        if (typeof seat.price !== "number" || seat.price < 0) {
          throw new Error(
            `Row ${rowIndex + 1}, Seat ${
              seatIndex + 1
            }: Valid seat price is required`
          );
        }
        if (typeof seat.col !== "number" || seat.col < 1) {
          throw new Error(
            `Row ${rowIndex + 1}, Seat ${
              seatIndex + 1
            }: Valid column number is required`
          );
        }
      });
    });
  }

  private _validateUpdateScreenData(updateData: UpdateScreenDto): void {
    if (updateData.totalSeats && updateData.totalSeats <= 0) {
      throw new Error("Total seats must be greater than 0");
    }

    if (updateData.layout && !updateData.layout.advancedLayout?.rows) {
      throw new Error("Advanced layout with rows is required");
    }

    // ADD THIS: Validate aisle configuration
    if (updateData.layout?.advancedLayout?.aisles) {
      const aisles = updateData.layout.advancedLayout.aisles;
      const maxSeatsPerRow = updateData.layout.seatsPerRow || 50; // fallback
      const maxRows = updateData.layout.rows || 20; // fallback

      // Validate vertical aisles
      if (aisles.vertical) {
        aisles.vertical.forEach((aisle, index) => {
          if (!aisle.id || typeof aisle.id !== "string") {
            throw new Error(`Vertical aisle ${index + 1}: ID is required`);
          }
          if (aisle.position < 1 || aisle.position > maxSeatsPerRow) {
            throw new Error(
              `Vertical aisle ${
                index + 1
              }: Position must be between 1 and ${maxSeatsPerRow}`
            );
          }
          if (aisle.width < 1 || aisle.width > 2) {
            throw new Error(
              `Vertical aisle ${index + 1}: Width must be 1 or 2 units`
            );
          }
        });
      }

      if (aisles.horizontal) {
        aisles.horizontal.forEach((aisle, index) => {
          if (!aisle.id || typeof aisle.id !== "string") {
            throw new Error(`Horizontal aisle ${index + 1}: ID is required`);
          }
          if (aisle.afterRow < 0 || aisle.afterRow >= maxRows) {
            throw new Error(
              `Horizontal aisle ${index + 1}: After row must be between 0 and ${
                maxRows - 1
              }`
            );
          }
          if (aisle.width < 1 || aisle.width > 2) {
            throw new Error(
              `Horizontal aisle ${index + 1}: Width must be 1 or 2 units`
            );
          }
        });
      }
    }
  }

  private _isTheaterInactive(screen: IScreen): boolean {
    return (
      typeof screen.theaterId === "object" &&
      "isActive" in screen.theaterId &&
      !screen.theaterId.isActive
    );
  }

  private _extractTheaterIdString(theaterId: any): string {
    if (typeof theaterId === "string") return theaterId;
    if (typeof theaterId === "object" && theaterId._id)
      return theaterId._id.toString();
    return theaterId.toString();
  }

  private _calculateScreenStatistics(screens: IScreen[]): ScreenStatsDto {
    const totalScreens = screens.length;
    const activeScreens = screens.filter((screen) => screen.isActive).length;
    const inactiveScreens = totalScreens - activeScreens;
    const totalSeats = screens.reduce(
      (sum, screen) => sum + screen.totalSeats,
      0
    );

    const seatTypeDistribution = { Normal: 0, Premium: 0, VIP: 0 };
    let totalRevenuePotential = 0;

    screens.forEach((screen) => {
      if (screen.layout?.advancedLayout?.rows) {
        screen.layout.advancedLayout.rows.forEach((row: any) => {
          row.seats.forEach((seat: any) => {
            if (
              seatTypeDistribution[
                seat.type as keyof typeof seatTypeDistribution
              ] !== undefined
            ) {
              seatTypeDistribution[
                seat.type as keyof typeof seatTypeDistribution
              ]++;
            }
            totalRevenuePotential += seat.price || 0;
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
      if (screen.features?.length) {
        screen.features.forEach((feature) => {
          featuresDistribution[feature] =
            (featuresDistribution[feature] || 0) + 1;
        });
      }
    });

    const popularFeatures = Object.entries(featuresDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    return {
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
      popularFeatures,
      utilizationRate:
        totalScreens > 0 ? Math.round((activeScreens / totalScreens) * 100) : 0,
    };
  }

  private _handleServiceError(
    error: unknown,
    defaultMessage: string
  ): ServiceResponse<never> {
    const message = error instanceof Error ? error.message : defaultMessage;
    return {
      success: false,
      message,
    };
  }
}
