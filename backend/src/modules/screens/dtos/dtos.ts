import { IScreen } from "../interfaces/screens.model.interface";

// Basic Screen Filters (used in findAll method)
export interface ScreenFilters {
  isActive?: boolean;
  screenType?: string;
  theaterId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Advanced Screen Filters (used in findByTheaterIdWithFilters method)
export interface AdvancedScreenFilters {
  isActive?: boolean;
  screenType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Paginated Screen Response (for findAll method)
export interface PaginatedScreenResult {
  screens: IScreen[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// Screen Statistics Response (for findByTheaterIdWithFilters method)
export interface ScreenWithStatisticsResult {
  screens: IScreen[];
  totalFiltered: number;
  activeAll: number;
  inactiveAll: number;
  totalAll: number;
}

// Create Screen DTO
export interface CreateScreenDto {
  theater: {
    _id: string; // Will be converted to ObjectId in service
  };
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: any;
    seatMap?: any;
  };
  screenType?: string;
  features?: string[];
}

// Update Screen DTO


// Screen Query DTOs
export interface ScreenByTheaterQueryDto {
  theaterId: string;
  name: string;
}

export interface ScreenExistsQueryDto {
  name: string;
  theaterId: string;
  excludedId?: string;
}

export interface GetAllScreensQueryDto {
  page?: number;
  limit?: number;
  filters?: ScreenFilters;
}
// Screen Response DTO
export interface ScreenResponseDto {
  id?: string;
  theaterId: any; // populated theater
  name: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: any;
    seatMap?: any;
  };
  screenType?: string;
  features?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScreenStatsResponseDto {
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

// Screen Count Response DTO
export interface ScreenCountResponseDto {
  count: number;
}

// Screen Exists Response DTO
export interface ScreenExistsResponseDto {
  exists: boolean;
}


// Update Screen DTO
export interface UpdateScreenDto {
  name?: string;
  totalSeats?: number;
  layout?: {
    rows: number;
    seatsPerRow: number;
    advancedLayout: any;
    seatMap: any;
  };
  screenType?: string;
  features?: string[];
  isActive?: boolean;
}

// Screen Statistics Response DTO
export interface ScreenStatsResponseDto {
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

// Screen Count Response DTO
export interface ScreenCountResponseDto {
  count: number;
}

// Screen Exists Response DTO
export interface ScreenExistsResponseDto {
  exists: boolean;
}

export interface ScreenCountResponseDto {
  count: number;
}

export interface ScreenStatsResponseDto {
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
export interface ScreenExistsResponseDto {
  exists: boolean;
}
