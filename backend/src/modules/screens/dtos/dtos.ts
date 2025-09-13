import { Types } from "mongoose";

export interface CreateScreenDto {
  name: string;
  totalSeats: number;
  theater:{
    _id:string
  }
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: {
      rows: {
        rowLabel: string;
        offset: number;
        seats: {
          col: number;
          id: string;
          type: string;
          price: number;
        }[];
      }[];
      // ADD THIS: Aisle configuration
      aisles?: {
        vertical?: {
          id: string;
          position: number;
          width: number;
        }[];
        horizontal?: {
          id: string;
          afterRow: number;
          width: number;
        }[];
      };
    };
  };
  screenType?: string;
  features?: string[];
  theaterId: string;
}


export interface UpdateScreenDto {
  name?: string;
  totalSeats?: number;
  layout?: {
    rows?: number;
    seatsPerRow?: number;
    advancedLayout?: {
      rows?: {
        rowLabel: string;
        offset: number;
        seats: {
          col: number;
          id: string;
          type: string;
          price: number;
        }[];
      }[];
      // ADD THIS: Aisle configuration
      aisles?: {
        vertical?: {
          id: string;
          position: number;
          width: number;
        }[];
        horizontal?: {
          id: string;
          afterRow: number;
          width: number;
        }[];
      };
    };
  };
  screenType?: string;
  features?: string[];
  isActive?: boolean;
}

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

export interface PaginationDto {
  page: number;
  limit: number;
}

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
