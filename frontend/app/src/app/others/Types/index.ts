import { ObjectId } from "mongodb";

export type Movie = {
  _id: ObjectId | string;
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: Date;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
  createdBy: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Theater {
  _id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  phone: string;
  facilities: string[];
  screens: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}


export type ShowTime = {
  movieId: string;
  theaterId: string;
  time: string; // ISO string or relevant time format
};

export type Suggestion =
  | { type: "movie"; data: Movie }
  | { type: "theater"; data: Theater };
