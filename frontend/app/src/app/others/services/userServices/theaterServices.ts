// /app/services/theaterService.ts

import apiClient from "../../Utils/apiClient";

export interface GetTheatersFilters {
  search?: string;
  sortBy?: "nearby" | "rating-high" | "rating-low" | "a-z" | "z-a";
  page?: number;
  limit?: number;
  facilities?: string[];
  latitude?: number;
  longitude?: number;
}

export interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  location: {
    coordinates: [number, number];
  };
  rating: number;
  facilities: string[];
  distance?: string;
}

export interface TheaterResponse {
  theaters: Theater[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getTheatersWithFilters = async (
  filters: GetTheatersFilters = {}
): Promise<TheaterResponse> => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.latitude !== undefined)
    params.append("latitude", filters.latitude.toString());
  if (filters.longitude !== undefined)
    params.append("longitude", filters.longitude.toString());
  if (filters.facilities !== undefined)
    params.append("facilities", filters.facilities?.toString());

  const res = await apiClient.get(
    `/common/theaters/filter?${params.toString()}`
  );
  return res.data;
};
