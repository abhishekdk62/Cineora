import { Types } from "mongoose";
import {
  IFavorite,
  MovieFavoriteData,
} from "../interfaces/favorite.model.interface";
import { IFavoriteRepository } from "../interfaces/favorite.repository.interface";
import { Favorite } from "../models/favorite.model";
export class FavoriteRepository implements IFavoriteRepository {
  async addToFavorites(favoriteData: MovieFavoriteData): Promise<IFavorite> {
    const favorite = new Favorite({
      userId: new Types.ObjectId(favoriteData.userId),
      movieId: new Types.ObjectId(favoriteData.movieId),
    });
    return favorite.save();
  }

  async removeFromFavorites(userId: string, movieId: string): Promise<boolean> {
    const result = await Favorite.deleteOne({
      userId: new Types.ObjectId(userId),
      movieId: new Types.ObjectId(movieId),
    });
    return result.deletedCount > 0;
  }

  async getUserFavorites(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    favorites: IFavorite[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId: new Types.ObjectId(userId) })
        .populate("movieId")
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Favorite.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return { favorites, total };
  }

  async isFavorite(userId: string, movieId: string): Promise<boolean> {
    const favorite = await Favorite.findOne({
      userId: new Types.ObjectId(userId),
      movieId: new Types.ObjectId(movieId),
    }).exec();
    return !!favorite;
  }

  async getFavoriteCount(movieId: string): Promise<number> {
    return Favorite.countDocuments({
      movieId: new Types.ObjectId(movieId),
    });
  }

  async removeAllUserFavorites(userId: string): Promise<number> {
    const result = await Favorite.deleteMany({
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount || 0;
  }


}
