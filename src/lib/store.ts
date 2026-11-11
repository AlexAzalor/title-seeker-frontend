import { create } from "zustand";
import type { SubgenreOut } from "@/orval_api/model";

type Movie = {
  key: string;
  poster: string;
};

type LastWatchedStore = {
  movies: Movie[];
  hasLoaded: boolean;
  addMovie: (movie: Movie) => void;
  loadFromStorage: () => void;
};

export const useLastWatchedStore = create<LastWatchedStore>((set, get) => ({
  movies: [],
  hasLoaded: false,

  addMovie: (movie) => {
    const { hasLoaded } = get();
    let { movies } = get();

    if (!hasLoaded) {
      try {
        const data = localStorage.getItem("last_watched");
        const parsed = data ? JSON.parse(data) : [];

        movies = Array.isArray(parsed) ? parsed : [];

        set({ movies, hasLoaded: true });
      } catch {
        movies = [];
        set({ movies, hasLoaded: true });
      }
    }

    const updated = [movie, ...movies.filter((m) => m.key !== movie.key)].slice(
      0,
      10,
    );

    localStorage.setItem("last_watched", JSON.stringify(updated));
    set({ movies: updated });
  },

  loadFromStorage: () => {
    try {
      const data = localStorage.getItem("last_watched");
      const parsed = data ? JSON.parse(data) : [];

      set({
        movies: Array.isArray(parsed) ? parsed : [],
        hasLoaded: true,
      });
    } catch (error) {
      console.error("Failed to load last_watched:", error);

      set({
        movies: [],
        hasLoaded: true,
      });
    }
  },
}));

type SubgenreStore = {
  subgenres: SubgenreOut[];
  setSubgenres: (subgenres: SubgenreOut[]) => void;
};

export const useSubgenreStore = create<SubgenreStore>((set) => ({
  subgenres: [],
  setSubgenres: (subgenres) => set({ subgenres }),
}));
