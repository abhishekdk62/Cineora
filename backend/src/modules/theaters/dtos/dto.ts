export interface CreateTheaterDto {
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
  facilities?: string[];
}

export interface UpdateTheaterDto {
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
}



export interface TheaterResponseDto {
  _id?: unknown;  
  id?: string;
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
  facilities?: string[];
  isActive?: boolean;
  isVerified?: boolean;
  ownerId?: string | object;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface PaginatedTheatersDto {
  theaters: TheaterResponseDto[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}



export interface TheatersByOwnerDto {
  theaters: TheaterResponseDto[];
  totalFiltered: number;
  activeAll: number;
  inactiveAll: number;
}


export interface TheaterFilters {
  status?: string;
  isActive?: boolean | string;
  isVerified?: boolean | string;
  city?: string;
  state?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  latitude?: number | string;
  longitude?: number | string;
  maxDistance?: number | string;
}
