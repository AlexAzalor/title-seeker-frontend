"use server";

import axios from "axios";
import { backendURL } from "@/lib/constants";
import { getFilters } from "@/orval_api/filters/filters";
import { getGenres } from "@/orval_api/genres/genres";
import { getMovies } from "@/orval_api/movies/movies";
import { SearchType, type Language } from "@/orval_api/model";
import type { MovieDetails, PopularOption, Settings } from "./types";

export async function getTournamentOptions(lang: Language) {
  const [genres, specifications] = await Promise.all([
    getGenres().aPIGetGenres({ lang }, backendURL),
    getFilters().aPIGetSpecifications({ lang }, backendURL),
  ]);
  if (!specifications.data) throw new Error("Specifications are unavailable");
  return {
    genres: genres.data.items,
    specifications: specifications.data.items,
  };
}

export async function getTournamentUniverses(lang: Language) {
  const { data } = await getMovies().aPIGetMovieFilters({ lang }, backendURL);
  return data.shared_universes;
}

export async function getPopularMovies(): Promise<PopularOption[]> {
  const names = [
    "The Lord of the Rings: The Fellowship of the Ring",
    "The Matrix",
  ];
  const results = await Promise.all(
    names.map((query) =>
      getMovies().aPISearch(
        { query, lang: "en", title_type: SearchType.movies },
        backendURL,
      ),
    ),
  );
  return results.flatMap(({ data }, index) => {
    const movie = data.results.find(
      (item) => item.name.toLowerCase() === names[index].toLowerCase(),
    );
    return movie ? [{ key: movie.key, name: names[index] }] : [];
  });
}

export async function generateTournament(settings: Settings, lang: Language) {
  try {
    const { data } = await getMovies().aPIGenerateMovieTournament(
      settings,
      { lang },
      backendURL,
    );
    return { kind: "success" as const, data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const detail: unknown = error.response.data?.detail;
      if (
        typeof detail === "object" &&
        detail !== null &&
        "available_movies" in detail &&
        typeof detail.available_movies === "number"
      ) {
        return {
          kind: "insufficient" as const,
          total: detail.available_movies,
        };
      }
    }
    console.error("Tournament pool generation failed", error);
    return { kind: "error" as const };
  }
}

export async function getTournamentMovieDetails(
  key: string,
  lang: Language,
): Promise<MovieDetails> {
  const { data } = await getMovies().aPIGetMovie(key, { lang }, backendURL);
  return {
    description: data.description,
    genres: data.genres.map((item) => item.name),
    specifications: data.specifications.map((item) => item.name),
  };
}
