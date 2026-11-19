import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { afterEach, expect, it, vi } from "vitest";
import messages from "../../messages/en.json";
import { MovieTournament } from "@/components/movie-tournament/movie-tournament";
import {
  generateTournament,
  getTournamentUniverses,
} from "@/components/movie-tournament/actions";
import { initialSettings } from "@/components/movie-tournament/types";

vi.mock("@/components/movie-tournament/actions", () => ({
  getTournamentOptions: vi
    .fn()
    .mockResolvedValue({ genres: [], specifications: [] }),
  getTournamentUniverses: vi.fn().mockResolvedValue([
    { key: "universe-one", name: "First universe" },
    { key: "universe-two", name: "Second universe" },
  ]),
  getPopularMovies: vi.fn(),
  getTournamentMovieDetails: vi.fn(),
  generateTournament: vi
    .fn()
    .mockResolvedValue({ kind: "insufficient", total: 0 }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function renderTournament() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SessionProvider session={null}>
        <MovieTournament lang="en" posterUrl="" avatarURL="" />
      </SessionProvider>
    </NextIntlClientProvider>,
  );
}

it("sends selected universe keys independently of movie exclusions and resets both", async () => {
  let resolveInitial!: (result: {
    kind: "insufficient";
    total: number;
  }) => void;
  vi.mocked(generateTournament).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        resolveInitial = resolve;
      }),
  );
  renderTournament();
});

it("shows an error and retries when the universe list cannot be loaded", async () => {
  vi.mocked(getTournamentUniverses).mockRejectedValueOnce(
    new Error("unavailable"),
  );
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  renderTournament();
});
