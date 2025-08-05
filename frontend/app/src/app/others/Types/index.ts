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

export type Theater = {
  _id: ObjectId | string;
  ownerId: ObjectId | string;
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates: [number, number];
  phone: string;
  facilities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ShowTime = {
  movieId: string;
  theaterId: string;
  time: string; // ISO string or relevant time format
};

export type Suggestion =
  | { type: "movie"; data: Movie }
  | { type: "theater"; data: Theater };
