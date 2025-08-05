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

export interface TMDBMoviesListProps {
  onAddMovie: (movie: any) => void;
  
}
