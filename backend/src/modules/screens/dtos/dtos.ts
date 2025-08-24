import { IScreen } from "../interfaces/screens.model.interface";

export interface ScreenFilters {
  isActive?: boolean;
  screenType?: string;
  theaterId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdvancedScreenFilters {
  isActive?: boolean;
  screenType?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedScreenResult {
  screens: IScreen[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface ScreenWithStatisticsResult {
  screens: IScreen[];
  totalFiltered: number;
  activeAll: number;
  inactiveAll: number;
  totalAll: number;
}

export interface CreateScreenDto {
  theater: {
    _id: string; 
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
export interface ScreenResponseDto {
  id?: string;
  theaterId: any; 
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

export interface ScreenCountResponseDto {
  count: number;
}

export interface ScreenExistsResponseDto {
  exists: boolean;
}


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

export interface ScreenCountResponseDto {
  count: number;
}

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
