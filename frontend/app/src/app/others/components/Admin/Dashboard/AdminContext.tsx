import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { MovieResponseDto } from "@/app/others/dtos";
import { TMDBMovie, TMDBGenre } from "./Movies/types/tmdb";

export type { TMDBMovie, TMDBGenre };

interface AdminContextType {
  movies: MovieResponseDto[];
  setMovies: Dispatch<SetStateAction<MovieResponseDto[]>>;
  tmdbMovies: TMDBMovie[];
  setTmdbMovies: Dispatch<SetStateAction<TMDBMovie[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<MovieResponseDto[]>([]);
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
