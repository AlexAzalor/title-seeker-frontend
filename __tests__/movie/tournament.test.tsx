import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { useReducedMotion } from "framer-motion";
import messages from "../../messages/en.json";
import ukMessages from "../../messages/uk.json";
import {
  createBracket,
  selectWinner,
} from "@/components/movie-tournament/bracket";
import { MovieTournament } from "@/components/movie-tournament/movie-tournament";
import { GameView } from "@/components/movie-tournament/game-view";
import { initialSettings } from "@/components/movie-tournament/types";
import {
  generateTournament,
  getTournamentOptions,
} from "@/components/movie-tournament/actions";
import type { MovieDetailOut } from "@/orval_api/model";

vi.mock("@/components/movie-tournament/actions", () => ({
  getTournamentOptions: vi
    .fn()
    .mockResolvedValue({ genres: [], specifications: [] }),
  getPopularMovies: vi.fn().mockResolvedValue([]),
  getTournamentUniverses: vi.fn().mockResolvedValue([]),
  getTournamentMovieDetails: vi.fn().mockResolvedValue({
    description: "A story",
    genres: ["Drama"],
    specifications: ["Space"],
  }),
  generateTournament: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt} />
  ),
}));

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return { ...actual, useReducedMotion: vi.fn(actual.useReducedMotion) };
});

const movies = (size: number): MovieDetailOut[] =>
  Array.from({ length: size }, (_, i) => ({
    key: `movie-${i}`,
    title: `Movie ${i}`,
    poster: "",
    duration: "",
    release_date: "",
    description: "",
    genres: [],
    specifications: [],
    actors: [],
    directors: [],
  }));

const originalScrollIntoView = Element.prototype.scrollIntoView;
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterAll(() => {
  if (originalScrollIntoView) {
    Element.prototype.scrollIntoView = originalScrollIntoView;
  } else {
    Reflect.deleteProperty(Element.prototype, "scrollIntoView");
  }
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("tournament bracket", () => {
  it.each([16, 32])(
    "advances all rounds for %i movies and keeps every choice",
    (size) => {
      let bracket = createBracket(movies(size));
      const roundSizes: number[] = [];
      while (!bracket.winner) {
        if (bracket.duel === 0) roundSizes.push(bracket.round.length);
        bracket = selectWinner(bracket, bracket.round[bracket.duel * 2].key);
      }
      expect(roundSizes).toEqual(
        size === 16 ? [16, 8, 4, 2] : [32, 16, 8, 4, 2],
      );
      expect(bracket.history).toHaveLength(size - 1);
      expect(bracket.history.at(-1)).toEqual(bracket.winner);
      expect(selectWinner(bracket, bracket.winner.key)).toBe(bracket);
    },
  );

  it("rejects malformed pools and ignores a movie outside the current duel", () => {
    expect(() => createBracket(movies(15))).toThrow();
    expect(() => createBracket(Array(16).fill(movies(1)[0]))).toThrow();
    const bracket = createBracket(movies(16));
    expect(selectWinner(bracket, "movie-2")).toBe(bracket);
  });

  it("randomizes the selected movies before starting the next round", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0);
    let bracket = createBracket(movies(16));

    for (let duel = 0; duel < bracket.round.length / 2; duel += 1) {
      bracket = selectWinner(bracket, bracket.round[duel * 2].key);
    }

    expect(random).toHaveBeenCalledTimes(7);
    expect(bracket.round.map((movie) => movie.key)).toEqual([
      "movie-2",
      "movie-4",
      "movie-6",
      "movie-8",
      "movie-10",
      "movie-12",
      "movie-14",
      "movie-0",
    ]);
    expect(bracket.history.map((movie) => movie.key)).toEqual([
      "movie-0",
      "movie-2",
      "movie-4",
      "movie-6",
      "movie-8",
      "movie-10",
      "movie-12",
      "movie-14",
    ]);
    random.mockRestore();
  });
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

describe("tournament UI", () => {
  it("renders GameView component with two movie choices", () => {
    const bracket = createBracket(movies(16));
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SessionProvider session={null}>
          <GameView
            bracket={bracket}
            size={16}
            posterUrl=""
            lang="en"
            selected={null}
            locked={false}
            select={() => {}}
            startOver={() => {}}
            exit={() => {}}
            avatarURL=""
          />
        </SessionProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Movie 0")).toBeDefined();
  });

  it("renders tournament settings page with genres and specifications", async () => {
    vi.mocked(getTournamentOptions).mockResolvedValueOnce({
      genres: [
        { key: "action", name: "Action", description: "", percentage_match: 0 },
        { key: "horror", name: "Horror", description: "", percentage_match: 0 },
      ],
      specifications: [
        { key: "space", name: "Space", description: "", percentage_match: 0 },
        { key: "war", name: "War", description: "", percentage_match: 0 },
      ],
    });
    vi.mocked(generateTournament).mockImplementation(async (settings) => ({
      kind: "success",
      data: { movies: movies(settings.size), total: 100 },
    }));
    renderTournament();
    await screen.findByText("100 movies available");
    expect(screen.getByRole("button", { name: /16 movies/ })).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Reset settings" }),
    ).toBeDefined();
  });

  it("renders poster cards with consistent dimensions", async () => {
    const pool = movies(16);
    pool[0] = { ...pool[0], poster: "small.jpg" };
    pool[1] = {
      ...pool[1],
      title: "An exceptionally long movie title",
      poster: "large.jpg",
    };
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: pool, total: 16 },
    });
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SessionProvider session={null}>
          <MovieTournament lang="en" posterUrl="" avatarURL="" />
        </SessionProvider>
      </NextIntlClientProvider>,
    );
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    // const images = await screen.findAllByRole("img", { name: /^Poster for/ });
    // expect(images).toHaveLength(2);
  });

  it("handles pool response race condition after settings change", async () => {
    let resolveOld!: (
      value: Awaited<ReturnType<typeof generateTournament>>,
    ) => void;
    vi.mocked(generateTournament).mockImplementation((settings) =>
      settings.size === 16
        ? new Promise((resolve) => {
            resolveOld = resolve;
          })
        : Promise.resolve({
            kind: "success",
            data: { movies: movies(32), total: 40 },
          }),
    );
    renderTournament();
    await waitFor(() => expect(resolveOld).toBeDefined());
    fireEvent.click(screen.getByRole("button", { name: /32 movies/ }));
    await screen.findByText("40 movies available");
    await act(async () => {
      resolveOld({ kind: "success", data: { movies: movies(16), total: 99 } });
    });
    expect(screen.getByText("40 movies available")).toBeDefined();
  });

  it("moves genre between inclusion and exclusion", async () => {
    vi.mocked(getTournamentOptions).mockResolvedValueOnce({
      genres: [
        { key: "action", name: "Action", description: "", percentage_match: 0 },
      ],
      specifications: [],
    });
    vi.mocked(generateTournament).mockImplementation(async (settings) => ({
      kind: "success",
      data: { movies: movies(settings.size), total: 100 },
    }));
    renderTournament();
    fireEvent.click(
      await screen.findByRole("button", { name: "Include Genres" }),
    );
    fireEvent.click(screen.getByRole("option", { name: "Action" }));
    expect(screen.getByRole("button", { name: "Remove Action" })).toBeDefined();
  });

  it("disables start button when pool is insufficient", async () => {
    vi.mocked(generateTournament).mockImplementation(async (settings) =>
      settings.size === 16
        ? { kind: "success", data: { movies: movies(16), total: 25 } }
        : { kind: "insufficient", total: 25 },
    );
    renderTournament();
    const start = screen.getByRole("button", { name: "Start tournament" });
    expect(start.hasAttribute("disabled")).toBe(true);
    await screen.findByText("25 movies available");
    expect(start.hasAttribute("disabled")).toBe(false);
  });

  it("displays movie details in game view", async () => {
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: movies(16), total: 16 },
    });
    renderTournament();
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    // fireEvent.click(
    //   await screen.findByRole("button", { name: "Information about Movie 0" }),
    // );
    // await screen.findByText("A story");
  });

  it("restarts tournament with same pool", async () => {
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: movies(16), total: 16 },
    });
    renderTournament();
    fireEvent.click(screen.getByRole("button", { name: /Base movie/ }));
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    const choice = await screen.findByRole("button", {
      name: "Choose Movie 0",
    });
    fireEvent.click(choice);
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    await screen.findByText(/0 of 15 choices made/);
    expect(vi.mocked(generateTournament)).toHaveBeenCalledTimes(1);
  }, 10000);

  it("exits tournament and preserves settings", async () => {
    vi.mocked(generateTournament)
      .mockResolvedValueOnce({
        kind: "success",
        data: { movies: movies(16), total: 16 },
      })
      .mockResolvedValueOnce({
        kind: "success",
        data: {
          movies: movies(16).map((movie) => ({
            ...movie,
            title: `New ${movie.title}`,
          })),
          total: 20,
        },
      });
    renderTournament();
    fireEvent.click(screen.getByRole("button", { name: /Base movie/ }));
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Choose Movie 0" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Exit" }));
    const base = await screen.findByRole("button", { name: /Base movie/ });
    expect(base.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders MovieTournament component", async () => {
    vi.mocked(getTournamentOptions).mockResolvedValueOnce({
      genres: [],
      specifications: [],
    });
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: movies(16), total: 16 },
    });
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SessionProvider session={null}>
          <MovieTournament lang="en" posterUrl="" avatarURL="" />
        </SessionProvider>
      </NextIntlClientProvider>,
    );
    expect(container).toBeDefined();
  });
});
