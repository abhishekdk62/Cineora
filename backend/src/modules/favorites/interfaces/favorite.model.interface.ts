import { Document, Types } from "mongoose";

export interface IFavorite extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  movieId: Types.ObjectId;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieFavoriteData {
  userId: string;
  movieId: string;
}
