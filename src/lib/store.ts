import { create } from "zustand";

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
    const { movies, hasLoaded } = get();

    if (!hasLoaded) return; // 🚫 Avoid writing before data is loaded

    // Remove duplicates and keep latest 10
    const filtered = movies.filter((m) => m.key !== movie.key);
    const updated = [movie, ...filtered].slice(0, 10);

    localStorage.setItem("last_watched", JSON.stringify(updated));
    set({ movies: updated });
  },

  loadFromStorage: () => {
    const data = localStorage.getItem("last_watched");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          set({ movies: parsed, hasLoaded: true });
        }
      } catch {
        set({ hasLoaded: true }); // Still set flag to true
      }
    } else {
      set({ hasLoaded: true });
    }
  },
}));
