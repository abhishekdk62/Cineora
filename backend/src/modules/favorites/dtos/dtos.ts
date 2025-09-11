export interface AddToFavoritesDto {
  userId: string;
  movieId: string;
}

export interface RemoveFromFavoritesDto {
  userId: string;
  movieId: string;
}

export interface GetUserFavoritesDto {
  userId: string;
  page?: number;
  limit?: number;
}

export interface ToggleFavoriteDto {
  userId: string;
  movieId: string;
}

export interface IsFavoriteDto {
  userId: string;
  movieId: string;
}

export interface GetFavoriteCountDto {
  movieId: string;
}

export interface GetTopFavoritedMoviesDto {
  limit?: number;
}

// Response DTOs
export interface FavoriteResponseDto {
  success: boolean;
  message?: string;
  data?: any;
}

export interface UserFavoritesResponseDto {
  success: boolean;
  data?: {
    favorites: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface ToggleFavoriteResponseDto {
  success: boolean;
  isFavorite: boolean;
  message?: string;
}

export interface FavoriteStatsDto {
  movieId: string;
  favoriteCount: number;
}
