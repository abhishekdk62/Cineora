import { ApiResponse } from './common.dto';

export interface StaffTheaterRefDto {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  screens?: number;
  facilities?: string[];
  isVerified?: boolean;
  location?: {
    coordinates: [number, number];
  };
  ownerId?: {
    ownerName: string;
    phone: string;
  } | string;
}

export interface StaffResponseDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  ownerId?: string;
  theaterId?: StaffTheaterRefDto | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffResponseDto extends ApiResponse<{ staff: StaffResponseDto }> {}

export interface GetStaffDetailsResponseDto {
  staff: StaffResponseDto;
}
