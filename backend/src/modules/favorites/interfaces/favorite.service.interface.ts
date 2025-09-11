export interface IFavoriteService {
  addToFavorites(userId: string, movieId: string): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }>;
  removeFromFavorites(userId: string, movieId: string): Promise<{
    success: boolean;
    message?: string;
  }>;
  getUserFavorites(userId: string, page?: number, limit?: number): Promise<{
    success: boolean;
    data?: {
      favorites: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }>;
  toggleFavorite(userId: string, movieId: string): Promise<{
    success: boolean;
    isFavorite: boolean;
    message?: string;
  }>;
  isFavorite(userId: string, movieId: string): Promise<boolean>;
  getFavoriteCount(movieId: string): Promise<number>;

}
