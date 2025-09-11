import { IFavoriteRepository } from "../interfaces/favorite.repository.interface";
import { IFavoriteService } from "../interfaces/favorite.service.interface";


export class FavoriteService implements IFavoriteService {
  constructor(private readonly _favoriteRepo: IFavoriteRepository) {}

  async addToFavorites(userId: string, movieId: string): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    try {
      const alreadyFavorite = await this._favoriteRepo.isFavorite(userId, movieId);
      
      if (alreadyFavorite) {
        return {
          success: false,
          message: "Movie is already in favorites",
        };
      }

      const favorite = await this._favoriteRepo.addToFavorites({ userId, movieId });
      
      return {
        success: true,
        message: "Movie added to favorites successfully",
        data: favorite,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to add movie to favorites",
      };
    }
  }

  async removeFromFavorites(userId: string, movieId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const removed = await this._favoriteRepo.removeFromFavorites(userId, movieId);
      
      if (!removed) {
        return {
          success: false,
          message: "Movie not found in favorites",
        };
      }

      return {
        success: true,
        message: "Movie removed from favorites successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to remove movie from favorites",
      };
    }
  }

  async getUserFavorites(userId: string, page: number = 1, limit: number = 20): Promise<{
    success: boolean;
    data?: {
      favorites: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message?: string;
  }> {
    try {
      const { favorites, total } = await this._favoriteRepo.getUserFavorites(userId, page, limit);
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          favorites,
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to get user favorites",
      };
    }
  }

  async toggleFavorite(userId: string, movieId: string): Promise<{
    success: boolean;
    isFavorite: boolean;
    message?: string;
  }> {
    try {
      const isFavorite = await this._favoriteRepo.isFavorite(userId, movieId);
      
      if (isFavorite) {
        await this._favoriteRepo.removeFromFavorites(userId, movieId);
        return {
          success: true,
          isFavorite: false,
          message: "Movie removed from favorites",
        };
      } else {
        await this._favoriteRepo.addToFavorites({ userId, movieId });
        return {
          success: true,
          isFavorite: true,
          message: "Movie added to favorites",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        isFavorite: false,
        message: error.message || "Failed to toggle favorite",
      };
    }
  }

  async isFavorite(userId: string, movieId: string): Promise<boolean> {
    return this._favoriteRepo.isFavorite(userId, movieId);
  }

  async getFavoriteCount(movieId: string): Promise<number> {
    return this._favoriteRepo.getFavoriteCount(movieId);
  }


}
