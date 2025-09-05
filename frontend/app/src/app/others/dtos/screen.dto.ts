import { ApiResponse, PaginationQuery } from './common.dto';

export interface SeatDto {
  col: number;
  id: string;
  type: string;
  price: number;
}

export interface RowDto {
  rowLabel: string;
  offset: number;
  seats: SeatDto[];
}

export interface AdvancedLayoutDto {
  rows: RowDto[];
}

export interface ScreenLayoutDto {
  rows: number;
  seatsPerRow: number;
  advancedLayout: AdvancedLayoutDto;
  seatMap?: any;
}

export interface ScreenFilters extends PaginationQuery {
  search?: string;
  theaterId?: string;
  isActive?: boolean;
  screenType?: string;
  minSeats?: number;
  maxSeats?: number;
  city?: string;
  state?: string;
  ownerName?: string;
}

export interface CreateScreenRequestDto {
  theaterId: string;
  name: string;
  totalSeats: number;
  layout: ScreenLayoutDto;
  screenType?: string;
  features?: string[];
}

export interface UpdateScreenRequestDto {
  name?: string;
  totalSeats?: number;
  layout?: ScreenLayoutDto;
  screenType?: string;
  features?: string[];
  isActive?: boolean;
}

export interface ToggleScreenRequestDto {
  isActive: boolean;
}

export interface ScreenStatsResponseDto {
  totalScreens: number;
  activeScreens: number;
  inactiveScreens: number;
  totalSeats: number;
  averageSeatsPerScreen: number;
}

export interface ScreenResponseDto {
  _id: string;
  theaterId: string;
  name: string;
  totalSeats: number;
  layout: ScreenLayoutDto;
  screenType?: string;
  features?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetAllScreensAdminResponseDto extends ApiResponse<ScreenResponseDto[]> {}
export interface GetScreenResponseDto extends ApiResponse<ScreenResponseDto> {}
export interface CreateScreenResponseDto extends ApiResponse<ScreenResponseDto> {}
export interface UpdateScreenResponseDto extends ApiResponse<ScreenResponseDto> {}
export interface ToggleScreenResponseDto extends ApiResponse<ScreenResponseDto> {}
export interface DeleteScreenResponseDto extends ApiResponse<null> {}
export interface GetScreensByTheaterIdResponseDto extends ApiResponse<ScreenResponseDto[]> {}
export interface GetScreensStatsOwnerResponseDto extends ApiResponse<ScreenStatsResponseDto> {}
export interface GetScreensResponseDto extends ApiResponse<ScreenResponseDto[]> {}
