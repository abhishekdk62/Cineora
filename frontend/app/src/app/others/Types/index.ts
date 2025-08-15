import { Movie } from "../components/Admin/Dashboard/Movies/MoviesList";

export interface ITheater {
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
  time: string;
};

export type Suggestion =
  | { type: "movie"; data: Movie }
  | { type: "theater"; data: ITheater };
