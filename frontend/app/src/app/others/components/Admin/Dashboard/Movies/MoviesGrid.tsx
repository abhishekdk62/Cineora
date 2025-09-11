import React from "react";
import { Movie } from "./MoviesList";
import MovieCard from "./MovieCard";
import { MovieResponseDto } from "@/app/others/dtos";

interface MoviesGridProps {
  movies: MovieResponseDto[];
  onEdit: (movie: MovieResponseDto) => void;
  onDelete: (movie: MovieResponseDto) => void;
  onToggleStatus: (movie: MovieResponseDto) => void;
}

const MoviesGrid: React.FC<MoviesGridProps> = ({
  movies,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default MoviesGrid;
