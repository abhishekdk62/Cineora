import { ApiResponse, PaginationQuery } from "./common.dto";

export interface CreateTheaterRequestDto {
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
}

export interface UpdateTheaterRequestDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  phone?: string;
  facilities?: string[];
  screens?: number;
  isActive?: boolean;
}

export interface TheaterFilters extends PaginationQuery {
  search?: string;
  status?: string;
  sortBy?: string;
  latitude?: number;
  longitude?: number;
  facilities?: string;
  ownerId?: string;
  city?: string;
  state?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isRejected?: boolean;
}

export interface TheaterResponseDto {
  _id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isRejected: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
interface getTheatersByOwnerId {
  activeAll: TheaterResponseDto;

  inactiveAll: TheaterResponseDto;
  theaters: TheaterResponseDto;
  totalAll: TheaterResponseDto;
  totalFiltered: TheaterResponseDto;
}

export interface TheaterResponse extends ApiResponse<TheaterResponseDto[]> {}

export interface CreateTheaterResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface GetTheaterResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface GetTheatersResponseDto
  extends ApiResponse<TheaterResponseDto[]> {}
export interface UpdateTheaterResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface DeleteTheaterResponseDto extends ApiResponse<null> {}
export interface VerifyTheaterResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface RejectTheaterResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface ToggleTheaterStatusResponseDto
  extends ApiResponse<TheaterResponseDto> {}
export interface GetTheatersByOwnerIdResponseDto
  extends ApiResponse<TheaterResponseDto[]> {}
export interface GetTheatersByMovieResponseDto
  extends ApiResponse<TheaterResponseDto[]> {}
export interface GetTheatersByOwnerIdResponseDto2
  extends ApiResponse<getTheatersByOwnerId[]> {}
