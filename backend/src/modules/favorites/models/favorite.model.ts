import { Schema, model, Document } from "mongoose";
import { IFavorite } from "../interfaces/favorite.model.interface";

const movieFavoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

movieFavoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });
movieFavoriteSchema.index({ userId: 1, addedAt: -1 }); 
movieFavoriteSchema.index({ movieId: 1 }); 

export const Favorite = model<IFavorite>("Favorite", movieFavoriteSchema);
