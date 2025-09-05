import { Types } from "mongoose";

// Screen DTOs
export interface CreateScreenDto {
  theaterId?: Types.ObjectId;
  theater?: { _id: Types.ObjectId };
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: Array<{
        rowNumber: number;
        seats: Array<{
          seatNumber: string;
          type: string;
          price: number;
          isAvailable: boolean;
        }>;
      }>;
    };
    seatMap?: Record<string, any>;
  };
  screenType?: string;
  features?: string[];
  isActive?: boolean;
}

export interface UpdateScreenDto {
  name?: string;
  totalSeats?: number;
  layout?: {
    rows?: number;
    seatsPerRow?: number;
    advancedLayout?: {
      rows: Array<{
        rowNumber: number;
        seats: Array<{
          seatNumber: string;
          type: string;
          price: number;
          isAvailable: boolean;
        }>;
      }>;
    };
    seatMap?: Record<string, any>;
  };
  screenType?: string;
  features?: string[];
  isActive?: boolean;
  theaterId?: Types.ObjectId;
}

// Filter DTOs
export interface ScreenFilterDto {
  isActive?: boolean;
  screenType?: string;
  theaterId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdvancedScreenFilterDto {
  page: number;
  limit: number;
  isActive?: boolean;
  screenType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response DTOs
export interface PaginatedScreenResultDto {
  screens: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ScreenStatisticsDto {
  screens: any[];
  totalFiltered: number;
  totalAll: number;
  activeAll: number;
  inactiveAll: number;
}

export interface ScreenStatsDto {
  overview: {
    totalScreens: number;
    activeScreens: number;
    inactiveScreens: number;
    totalSeats: number;
    avgSeatsPerScreen: number;
  };
  seatDistribution: {
    byType: {
      Normal: number;
      Premium: number;
      VIP: number;
    };
    totalRevenuePotential: number;
  };
  screenTypes: Record<string, number>;
  popularFeatures: Record<string, number>;
  utilizationRate: number;
}

export interface ScreenExistsDto {
  exists: boolean;
}

export interface ScreenCountDto {
  count: number;
}

// Utility DTOs
export interface PaginationDto {
  page: number;
  limit: number;
}

// Legacy DTOs (if you still need them from your original dtos/dtos file)
export interface ScreenFilters {
  isActive?: boolean;
  screenType?: string;
  theaterId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdvancedScreenFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  screenType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedScreenResult {
  screens: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ScreenWithStatisticsResult {
  screens: any[];
  totalFiltered: number;
  totalAll: number;
  activeAll: number;
  inactiveAll: number;
}

export interface ScreenResponseDto {
  screen: any;
}

export interface ScreenStatsResponseDto {
  stats: ScreenStatsDto;
}

export interface ScreenCountResponseDto {
  count: number;
}

export interface ScreenExistsResponseDto {
  exists: boolean;
}
