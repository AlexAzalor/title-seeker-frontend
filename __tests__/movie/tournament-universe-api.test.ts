import { expect, it, vi } from "vitest";
import {
  generateTournament,
  getTournamentUniverses,
} from "@/components/movie-tournament/actions";
import { initialSettings } from "@/components/movie-tournament/types";
import { backendURL } from "@/lib/constants";

const api = vi.hoisted(() => ({
  filters: vi.fn(),
  generate: vi.fn(),
}));

vi.mock("@/orval_api/movies/movies", () => ({
  getMovies: () => ({
    aPIGetMovieFilters: api.filters,
    aPIGenerateMovieTournament: api.generate,
  }),
}));

it("loads localized universe keys and sends exclusions to the tournament endpoint", async () => {
  api.filters.mockResolvedValue({
    data: { shared_universes: [{ key: "universe", name: "Всесвіт" }] },
  });
  api.generate.mockResolvedValue({ data: { movies: [], total: 0 } });
  expect(await getTournamentUniverses("uk")).toEqual([
    { key: "universe", name: "Всесвіт" },
  ]);
  expect(api.filters).toHaveBeenCalledWith({ lang: "uk" }, backendURL);
  const settings = {
    ...initialSettings,
    exclude_shared_universes: ["universe"],
  };
  await generateTournament(settings, "uk");
  expect(api.generate).toHaveBeenCalledWith(
    settings,
    { lang: "uk" },
    backendURL,
  );
});
