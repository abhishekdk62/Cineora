import React from "react";
import { Movie } from "./MoviesList";
import MovieListItem from "./MovieListItem";
import { MovieResponseDto } from "@/app/others/dtos";

interface MoviesListViewProps {
  movies: MovieResponseDto[];
  onEdit: (movie: MovieResponseDto) => void;
  onDelete: (movie: MovieResponseDto) => void;
  onToggleStatus: (movie: MovieResponseDto) => void;
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
