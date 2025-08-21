import mongoose, { Schema, Document, Types } from "mongoose";
import { IMovie } from "../interfaces/movies.model.interface";


const MovieSchema = new Schema<IMovie>(
  {
    tmdbId: { type: String, required: true,unique:true },
    title: { type: String, required: true },
    genre: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    rating: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    trailer: { type: String }, 
    cast: { type: [String], required: true },
    director: { type: String, required: true },
    language: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model<IMovie>("Movie", MovieSchema);
