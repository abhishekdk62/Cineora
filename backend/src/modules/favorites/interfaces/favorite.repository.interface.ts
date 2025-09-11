import { IFavorite, MovieFavoriteData } from "./favorite.model.interface";

export interface IFavoriteRepository {
  addToFavorites(favoriteData: MovieFavoriteData): Promise<IFavorite>;
  removeFromFavorites(userId: string, movieId: string): Promise<boolean>;
  getUserFavorites(userId: string, page?: number, limit?: number): Promise<{
    favorites: IFavorite[];
    total: number;
  }>;
  isFavorite(userId: string, movieId: string): Promise<boolean>;
  getFavoriteCount(movieId: string): Promise<number>;

  removeAllUserFavorites(userId: string): Promise<number>;

}
