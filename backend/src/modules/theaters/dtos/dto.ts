export interface CreateTheaterDTO {
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
  screens?: number;
  isActive?: boolean;
  isRejected?: boolean;
  isVerified?: boolean;
}

export interface UpdateTheaterDTO {
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
  isRejected?: boolean;
  isVerified?: boolean;
}

export interface TheaterFilters {
  page?: string | number;
  limit?: string | number;
  status?: "active" | "inactive";
  isActive?: string | boolean;
  isVerified?: string | boolean;
  city?: string;
  state?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  latitude?: string | number;
  longitude?: string | number;
  facilities?: string[];
}

export interface TheaterPaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TheaterListResponseDTO {
  theaters: TheaterStatsDTO[];
  pagination: TheaterPaginationDTO;
}

export interface TheaterStatsDTO {
  totalFiltered: number;
  inactiveAll: number;
  activeAll: number;
  totalAll: number;
}
