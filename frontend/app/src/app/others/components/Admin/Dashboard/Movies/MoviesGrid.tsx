import React from "react";
import { Movie } from "./MoviesList";
import MovieCard from "./MovieCard";

interface MoviesGridProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
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
