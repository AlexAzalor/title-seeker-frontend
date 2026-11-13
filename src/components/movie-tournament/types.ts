import type { MoviePreviewOut, MovieTournamentIn } from "@/orval_api/model";

export type Settings = Required<MovieTournamentIn>;
export type Movie = MoviePreviewOut;
export type FilterOption = {
  key: string;
  name: string;
  description?: string;
  movie_count?: number;
};
export type PopularOption = { key: string; name: string };
export type MovieDetails = {
  description: string;
  genres: string[];
  specifications: string[];
};

export const initialSettings: Settings = {
  size: 16,
  include_genres: [],
  exclude_genres: [],
  genre_threshold: 100,
  include_specifications: [],
  exclude_specifications: [],
  specification_threshold: 100,
  collection_type: null,
  exclude_movies: [],
  exclude_shared_universes: [],
};
