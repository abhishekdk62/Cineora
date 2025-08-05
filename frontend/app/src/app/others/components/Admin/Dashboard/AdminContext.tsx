import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

// Shared Movie interface
export interface Movie {
  _id: string;
  tmdbId: number;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Shared TMDB types
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path?: string;
  genre_ids: number[];
  vote_average: number;
  vote_count?: number;
  popularity?: number;
  original_language: string;
  adult?: boolean;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Context type
interface AdminContextType {
  movies: Movie[];
  setMovies: Dispatch<SetStateAction<Movie[]>>;
  tmdbMovies: TMDBMovie[];
  setTmdbMovies: Dispatch<SetStateAction<TMDBMovie[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tmdbMovies, setTmdbMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <AdminContext.Provider value={{ movies, setMovies, tmdbMovies, setTmdbMovies, loading, setLoading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
