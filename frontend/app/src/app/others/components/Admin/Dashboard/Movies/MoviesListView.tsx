import React from "react";
import { Movie } from "./MoviesList";
import MovieListItem from "./MovieListItem";

interface MoviesListViewProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleStatus: (movie: Movie) => void;
}

const MoviesListView: React.FC<MoviesListViewProps> = ({
  movies,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="space-y-4">
      {movies.map((movie) => (
        <MovieListItem
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

export default MoviesListView;
