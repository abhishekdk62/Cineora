
import { Document } from "mongoose";


export interface IMovie extends Document {
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: Date;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer?: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
