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
import type { Movie } from "@/components/movie-tournament/types";
import { initialSettings } from "@/components/movie-tournament/types";
import {
  generateTournament,
  getTournamentOptions,
} from "@/components/movie-tournament/actions";

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

const movies = (size: number): Movie[] =>
  Array.from({ length: size }, (_, i) => ({
    key: `movie-${i}`,
    title: `Movie ${i}`,
    poster: "",
    duration: "",
    main_genre: "",
    release_date: "",
    rating: 0,
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
});

function renderTournament() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SessionProvider session={null}>
        <MovieTournament lang="en" posterUrl="" />
      </SessionProvider>
    </NextIntlClientProvider>,
  );
}

describe("tournament UI", () => {
  it("shows a hint after 10 seconds and restarts the delay for each duel and restart", () => {
    vi.useFakeTimers();
    let bracket = createBracket(movies(16));
    let locked = false;
    const renderGame = () => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <SessionProvider session={null}>
          <GameView
            bracket={bracket}
            size={16}
            posterUrl=""
            lang="en"
            selected={null}
            locked={locked}
            select={() => {}}
            startOver={() => {}}
            exit={() => {}}
          />
        </SessionProvider>
      </NextIntlClientProvider>
    );
    const { rerender, unmount } = render(renderGame());
    act(() => vi.advanceTimersByTime(9_999));
    expect(
      screen.queryByRole("button", { name: "Duel information" }),
    ).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    const hint = screen.getByRole("button", { name: "Duel information" });
    const hover = new MouseEvent("pointerover", { bubbles: true });
    Object.defineProperty(hover, "pointerType", { value: "mouse" });
    fireEvent(hint, hover);
    expect(screen.getByText("Need help choosing?")).toBeDefined();
    const leave = new MouseEvent("pointerout", { bubbles: true });
    Object.defineProperty(leave, "pointerType", { value: "mouse" });
    fireEvent(hint, leave);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("Need help choosing?")).toBeNull();
    const touch = new MouseEvent("pointerover", { bubbles: true });
    Object.defineProperty(touch, "pointerType", { value: "touch" });
    fireEvent(hint, touch);
    expect(screen.queryByText("Need help choosing?")).toBeNull();
    fireEvent.click(hint);
    expect(screen.getByText("Need help choosing?")).toBeDefined();

    locked = true;
    rerender(renderGame());
    expect(
      screen.queryByRole("button", { name: "Duel information" }),
    ).toBeNull();
    act(() => vi.advanceTimersByTime(10_000));
    bracket = selectWinner(bracket, "movie-0");
    locked = false;
    rerender(renderGame());
    act(() => vi.advanceTimersByTime(9_999));
    expect(
      screen.queryByRole("button", { name: "Duel information" }),
    ).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(
      screen.getByRole("button", { name: "Duel information" }),
    ).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    expect(
      screen.queryByRole("button", { name: "Duel information" }),
    ).toBeNull();
    act(() => vi.advanceTimersByTime(10_000));
    expect(
      screen.getByRole("button", { name: "Duel information" }),
    ).toBeDefined();
    unmount();
    act(() => vi.advanceTimersByTime(10_000));
  });

  it.each([
    ["en", messages, "Duel information", "Need help choosing?"],
    ["uk", ukMessages, "Інформація про двобій", "Не знаєш, що обрати?"],
  ] as const)(
    "shows localized choice guidance in %s",
    (locale, translations, label, title) => {
      vi.useFakeTimers();
      render(
        <NextIntlClientProvider locale={locale} messages={translations}>
          <SessionProvider session={null}>
            <GameView
              bracket={createBracket(movies(16))}
              size={16}
              posterUrl=""
              lang={locale}
              selected={null}
              locked={false}
              select={() => {}}
              startOver={() => {}}
              exit={() => {}}
            />
          </SessionProvider>
        </NextIntlClientProvider>,
      );
      act(() => vi.advanceTimersByTime(10_000));
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(screen.getByText(title)).toBeDefined();
      const list = screen.getByRole("list");
      const tips = within(list)
        .getAllByRole("listitem")
        .map((item) => item.textContent);
      expect(tips).toEqual([
        translations.MovieTournament.duelHintPoster,
        translations.MovieTournament.duelHintTitleFamiliar,
        translations.MovieTournament.duelHintDate,
      ]);
      expect(
        screen.getByText(translations.MovieTournament.duelHintDetails),
      ).toBeDefined();
    },
  );

  it("announces and highlights a new round, but not a new duel", () => {
    let bracket = createBracket(movies(16));
    const renderGame = () => (
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
          />
        </SessionProvider>
      </NextIntlClientProvider>
    );
    const { rerender } = render(renderGame());
    expect(screen.queryByText("Next round")).toBeNull();
    bracket = selectWinner(bracket, "movie-0");
    rerender(renderGame());
    expect(screen.queryByText("Next round")).toBeNull();
    while (bracket.roundNumber === 1) {
      bracket = selectWinner(bracket, bracket.round[bracket.duel * 2].key);
    }
    rerender(renderGame());
    expect(
      screen
        .getByText("Next round")
        .closest("[aria-hidden]")
        ?.getAttribute("aria-hidden"),
    ).toBe("true");
    expect(
      screen
        .getByRole("heading", { name: "Quarter-final" })
        .getAttribute("aria-live"),
    ).toBe("polite");
    bracket = selectWinner(bracket, bracket.round[0].key);
    rerender(renderGame());
    expect(screen.queryByText("Next round")).toBeNull();
  });

  it("announces a new round without the sweep when reduced motion is enabled", () => {
    let bracket = createBracket(movies(16));
    while (bracket.roundNumber === 1) {
      bracket = selectWinner(bracket, bracket.round[bracket.duel * 2].key);
    }
    vi.mocked(useReducedMotion).mockReturnValueOnce(true);
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
          />
        </SessionProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.queryByText("Next round")).toBeNull();
    expect(
      screen
        .getByRole("heading", { name: "Quarter-final" })
        .getAttribute("aria-live"),
    ).toBe("polite");
  });

  it("resets all settings and generates a new pool with the defaults", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: /32 movies/ }));
    fireEvent.click(screen.getByRole("button", { name: /Base movie/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: "The Matrix" }));

    for (const [selector, option] of [
      ["Include Genres", "Action"],
      ["Exclude Genres", "Horror"],
      ["Include Specifications", "Space"],
      ["Exclude Specifications", "War"],
    ]) {
      fireEvent.click(screen.getByRole("button", { name: selector }));
      fireEvent.click(screen.getByRole("option", { name: option }));
      fireEvent.click(screen.getByRole("button", { name: selector }));
    }
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Genres matching threshold" }),
      { key: "ArrowLeft" },
    );
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Specifications matching threshold" }),
      { key: "ArrowLeft" },
    );
    await waitFor(() => {
      expect(vi.mocked(generateTournament).mock.lastCall?.[0]).toMatchObject({
        size: 32,
        collection_type: "base",
        include_genres: ["action"],
        exclude_genres: ["horror"],
        include_specifications: ["space"],
        exclude_specifications: ["war"],
        genre_threshold: 80,
        specification_threshold: 80,
        exclude_movies: ["the-matrix"],
      });
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset settings" }));
    expect(
      screen
        .getByRole("button", { name: /16 movies/ })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: /Any movie/ })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen
        .getByRole("checkbox", { name: "The Matrix" })
        .getAttribute("aria-checked"),
    ).toBe("false");
    expect(screen.queryByRole("button", { name: "Remove Action" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Remove Horror" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Remove Space" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Remove War" })).toBeNull();
    expect(
      screen
        .getByRole("slider", { name: "Genres matching threshold" })
        .getAttribute("aria-valuenow"),
    ).toBe("100");
    expect(
      screen
        .getByRole("slider", { name: "Specifications matching threshold" })
        .getAttribute("aria-valuenow"),
    ).toBe("100");
    expect(
      screen
        .getByRole("button", { name: "Start tournament" })
        .hasAttribute("disabled"),
    ).toBe(true);
    await waitFor(() =>
      expect(vi.mocked(generateTournament).mock.lastCall?.[0]).toEqual(
        initialSettings,
      ),
    );
    await waitFor(() =>
      expect(
        screen
          .getByRole("button", { name: "Start tournament" })
          .hasAttribute("disabled"),
      ).toBe(false),
    );
  });

  it("uses equal-sized poster frames for different titles and poster dimensions", async () => {
    const pool = movies(16);
    pool[0] = { ...pool[0], poster: "small.jpg" };
    pool[1] = {
      ...pool[1],
      title:
        "An exceptionally long movie title that wraps across multiple lines",
      poster: "large.jpg",
    };
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: pool, total: 16 },
    });
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SessionProvider session={null}>
          <MovieTournament
            lang="en"
            posterUrl="https://static.titleseeker.com"
          />
        </SessionProvider>
      </NextIntlClientProvider>,
    );
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    await waitFor(() =>
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
        block: "start",
        behavior: "instant",
      }),
    );
    const images = await screen.findAllByRole("img", { name: /^Poster for/ });
    expect(images).toHaveLength(2);
    for (const image of images) {
      expect(image.getAttribute("width")).toBe("300");
      expect(image.getAttribute("height")).toBe("450");
      expect(image.className).toContain("object-cover");
      expect(image.className).toContain("h-full");
      expect(image.className).toContain("w-full");
      expect(image.parentElement?.className).toContain("aspect-[2/3]");
    }
    const cards = images.map((image) => image.closest("article"));
    expect(cards[0]?.className).toContain("max-w-[326px]");
    expect(cards[1]?.className).toContain("max-w-[326px]");
    expect(cards[0]?.querySelector("h2")?.parentElement?.className).toContain(
      "h-20",
    );
    expect(cards[1]?.querySelector("h2")?.parentElement?.className).toContain(
      "h-20",
    );
  });

  it("ignores an older pool response after settings change", async () => {
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
    expect(screen.queryByText("99 movies available")).toBeNull();
  });

  it("moves a genre between inclusion and exclusion and sends its key", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: "Include Genres" }));
    fireEvent.click(screen.getByRole("button", { name: "Exclude Genres" }));
    fireEvent.click(screen.getByRole("option", { name: "Action" }));
    await waitFor(() =>
      expect(
        vi.mocked(generateTournament).mock.lastCall?.[0].exclude_genres,
      ).toEqual(["action"]),
    );
    expect(
      vi.mocked(generateTournament).mock.lastCall?.[0].include_genres,
    ).toEqual([]);
    expect(
      screen.getAllByRole("button", { name: "Remove Action" }),
    ).toHaveLength(1);
  });

  it("invalidates old availability and disables start for an insufficient pool", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: /32 movies/ }));
    expect(start.hasAttribute("disabled")).toBe(true);
    await screen.findByText(
      "You need at least 32 movies. Adjust your filters to continue.",
    );
    expect(start.hasAttribute("disabled")).toBe(true);
  });

  it("shows movie details without making a selection", async () => {
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: movies(16), total: 16 },
    });
    renderTournament();
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Information about Movie 0" }),
    );
    await screen.findByText("A story");
    expect(screen.getByText("Drama", { exact: false })).toBeDefined();
    expect(screen.getByText("Space", { exact: false })).toBeDefined();
    expect(screen.getByText(/0 of 15 choices made/)).toBeDefined();
  });

  it("starts over with the same pool, even during a selection transition", async () => {
    vi.mocked(generateTournament).mockResolvedValue({
      kind: "success",
      data: { movies: movies(16), total: 16 },
    });
    renderTournament();
    fireEvent.click(screen.getByRole("button", { name: /Base movie/ }));
    await screen.findByText("16 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    for (let i = 0; i < 8; i++) {
      const choice = await screen.findByRole("button", {
        name: `Choose Movie ${i * 2}`,
      });
      await waitFor(() => expect(choice.hasAttribute("disabled")).toBe(false));
      fireEvent.click(choice);
      await screen.findByText(new RegExp(`${i + 1} of 15 choices made`));
    }
    const nextChoice = await screen.findByRole("button", {
      name: "Choose Movie 0",
    });
    expect(screen.getByText("Next round")).toBeDefined();
    expect(nextChoice.hasAttribute("disabled")).toBe(true);
    await waitFor(
      () => expect(nextChoice.hasAttribute("disabled")).toBe(false),
      { timeout: 2000 },
    );
    fireEvent.click(nextChoice);
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    await screen.findByText(/0 of 15 choices made/);
    await screen.findByRole("button", { name: "Choose Movie 1" });
    expect(vi.mocked(generateTournament)).toHaveBeenCalledTimes(1);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    expect(screen.getByText(/0 of 15 choices made/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Choose Movie 0" }));
    await screen.findByText(/1 of 15 choices made/);
  }, 10000);

  it("exits during a selection, discards the pool, and preserves settings", async () => {
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
    const start = screen.getByRole("button", { name: "Start tournament" });
    expect(start.hasAttribute("disabled")).toBe(true);
    await screen.findByText("20 movies available");
    fireEvent.click(start);
    await screen.findByRole("button", { name: "Choose New Movie 0" });
    expect(screen.getByText(/0 of 15 choices made/)).toBeDefined();
    expect(vi.mocked(generateTournament)).toHaveBeenCalledTimes(2);
  });

  it("locks duplicate clicks, completes a tournament, and preserves settings when playing again", async () => {
    vi.mocked(generateTournament).mockImplementation(async (settings) => ({
      kind: "success",
      data: { movies: movies(settings.size), total: 100 },
    }));
    renderTournament();
    fireEvent.click(screen.getByRole("button", { name: /Base movie/ }));
    await screen.findByText("100 movies available");
    fireEvent.click(screen.getByRole("button", { name: "Start tournament" }));
    const first = await screen.findByRole("button", { name: "Choose Movie 0" });
    fireEvent.click(first);
    fireEvent.click(first);
    await screen.findByText(/1 of 15 choices made/);
    for (let i = 1; i < 15; i++) {
      await waitFor(
        () => {
          const choices = screen.getAllByRole("button", {
            name: /^Choose Movie/,
          });
          expect(choices[0].hasAttribute("disabled")).toBe(false);
          fireEvent.click(choices[0]);
        },
        { timeout: 2000 },
      );
      if (i < 14)
        await screen.findByText(new RegExp(`${i + 1} of 15 choices made`));
    }
    await screen.findByText("Your winner");
    const history = screen
      .getByRole("heading", { name: "Your choices" })
      .closest("section");
    expect(history).not.toBeNull();
    expect(within(history!).getAllByText(/^Movie /)).toHaveLength(15);
    fireEvent.click(screen.getByRole("button", { name: "Play again" }));
    const base = await screen.findByRole("button", { name: /Base movie/ });
    expect(base.getAttribute("aria-pressed")).toBe("true");
    await waitFor(() =>
      expect(
        vi.mocked(generateTournament).mock.calls.length,
      ).toBeGreaterThanOrEqual(2),
    );
    expect(
      vi.mocked(generateTournament).mock.lastCall?.[0].collection_type,
    ).toBe("base");
  }, 20000);
});
