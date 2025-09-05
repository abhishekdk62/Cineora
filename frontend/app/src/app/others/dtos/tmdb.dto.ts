export interface TMDBGenreDto {
  id: number;
  name: string;
}

export interface TMDBMovieDto {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

export interface TMDBMovieDetailsDto {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  genres: TMDBGenreDto[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
}

export interface TMDBPopularMoviesResponseDto {
  page: number;
  results: TMDBMovieDto[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenresResponseDto {
  genres: TMDBGenreDto[];
}

export interface TMDBSearchMoviesResponseDto {
  page: number;
  results: TMDBMovieDto[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetailsResponseDto extends TMDBMovieDetailsDto {}
