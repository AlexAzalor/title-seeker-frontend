import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";
import { ShareLinkButtons } from "@/components/movie/movie-page/components/share-link-buttons";
import { RelatedMovie, type RelatedMovieOut } from "@/orval_api/model";

const mocks = vi.hoisted(() => ({
  fields: vi.fn(),
  description: vi.fn(),
  editDescription: vi.fn(),
  actors: vi.fn(),
  directors: vi.fn(),
  editActors: vi.fn(),
  editDirectors: vi.fn(),
  editBoxOffice: vi.fn(),
  standaloneMovies: vi.fn(),
  editCollection: vi.fn(),
  refresh: vi.fn(),
  error: vi.fn(),
}));

vi.mock("@/app/(app)/services/admin-api", () => ({
  getMovieEditFields: mocks.fields,
  getMovieDescription: mocks.description,
  editMovieDescription: mocks.editDescription,
  editMovieTitle: vi.fn(),
  editMovieDetails: vi.fn(),
  getMovieActors: mocks.actors,
  getMovieDirectors: mocks.directors,
  editMovieActors: mocks.editActors,
  editMovieDirectors: mocks.editDirectors,
  editMovieBoxOffice: mocks.editBoxOffice,
  createActor: vi.fn(),
  createDirector: vi.fn(),
  getStandaloneMovies: mocks.standaloneMovies,
  editCollection: mocks.editCollection,
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
  usePathname: () => "/movies/film",
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: mocks.error },
}));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { role: "admin" } } }),
}));
vi.mock("@/components/audit-log/audit-log-drawer", () => ({
  AuditLogDrawer: () => null,
}));
vi.mock("@/components/my-custom-ui/custom-modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

function renderButtons(
  isAdmin = true,
  relatedMovies: RelatedMovieOut[] | null = null,
) {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ShareLinkButtons
        movieKey="film"
        movieTitle="Film"
        posterUrl=""
        avatarUrl=""
        isAdmin={isAdmin}
        movieData={{
          budget: "$1,000",
          domestic_gross: "$2,000",
          worldwide_gross: "$3,000",
          poster: "",
          related_movies: relatedMovies,
          actors: [
            {
              key: "actor",
              full_name: "Actor Name",
              character_name: "Character Name",
              age: 30,
              avatar_url: "",
              born: "",
              born_location: "",
            },
          ],
          directors: [
            {
              key: "director",
              full_name: "Director Name",
              age: 40,
              avatar_url: "",
              born: "",
              born_location: "",
            },
          ],
        }}
      />
    </NextIntlClientProvider>,
  );
}

function openMenu() {
  fireEvent.keyDown(screen.getByRole("button", { name: "Edit movie" }), {
    key: "Enter",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.fields.mockResolvedValue({
    status: 200,
    data: {
      title_en: "English title",
      title_uk: "Ukrainian title",
      duration: "120",
      release_date: "2001-12-19T00:00:00Z",
      location_en: "London",
      location_uk: "London",
    },
  });
  mocks.description.mockResolvedValue({
    status: 200,
    data: {
      description_en: "English description ".repeat(20),
      description_uk: "Ukrainian description ".repeat(20),
    },
  });
  mocks.editDescription.mockResolvedValue({ status: 200, message: "Updated" });
  mocks.actors.mockResolvedValue({
    status: 200,
    data: {
      actors: [
        { id: 1, key: "actor", name: "Actor Name", another_lang_name: "" },
      ],
      characters: [
        {
          id: 1,
          key: "character",
          name: "Character Name",
          another_lang_name: "",
        },
      ],
    },
  });
  mocks.directors.mockResolvedValue({
    status: 200,
    data: {
      directors: [
        {
          id: 1,
          key: "director",
          name: "Director Name",
          another_lang_name: "",
        },
      ],
    },
  });
  mocks.editBoxOffice.mockResolvedValue({ status: 200, message: "Updated" });
  mocks.editActors.mockResolvedValue({ status: 200, message: "Updated" });
  mocks.editDirectors.mockResolvedValue({ status: 200, message: "Updated" });
  mocks.standaloneMovies.mockResolvedValue({ status: 200, data: [] });
  mocks.editCollection.mockResolvedValue({ status: 200, message: "Updated" });
});
afterEach(cleanup);

describe("movie edit menu", () => {
  test("is available only to admins", () => {
    renderButtons(false);
    expect(screen.queryByRole("button", { name: "Edit movie" })).toBeNull();
  });

  test.each([
    ["Edit title", "Title (en)"],
    ["Edit details", "Duration (in minutes)"],
  ])("opens the %s form with current data", async (item, field) => {
    renderButtons();
    openMenu();
    fireEvent.click(await screen.findByRole("menuitem", { name: item }));
    expect(await screen.findByLabelText(field)).toBeDefined();
    expect(mocks.fields).toHaveBeenCalledWith("film");
  });

  test("loads and saves the description, then closes and refreshes", async () => {
    renderButtons();
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit description" }),
    );
    const textareas = await screen.findAllByRole("textbox");
    expect((textareas[0] as HTMLTextAreaElement).value).toContain(
      "English description",
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.editDescription).toHaveBeenCalledWith(
        "film",
        "English description ".repeat(20).trim(),
        "Ukrainian description ".repeat(20).trim(),
      ),
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  test("reports a loading failure without opening a form", async () => {
    mocks.description.mockResolvedValue({ status: 403, message: "Forbidden" });
    renderButtons();
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit description" }),
    );
    await waitFor(() => expect(mocks.error).toHaveBeenCalledWith("Forbidden"));
    expect(screen.queryByRole("textbox")).toBeNull();
  });

  test("keeps the description form open when saving fails", async () => {
    mocks.editDescription.mockResolvedValue({
      status: 500,
      message: "Save failed",
    });
    renderButtons();
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit description" }),
    );
    await screen.findByLabelText("Description (en)");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.error).toHaveBeenCalledWith("Save failed"),
    );
    expect(screen.getByLabelText("Description (en)")).toBeDefined();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  test("opens box office with current values and saves changes", async () => {
    renderButtons();
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit box office" }),
    );
    const budget = await screen.findByLabelText("Budget ($)");
    expect((budget as HTMLInputElement).value).toBe("1000");
    fireEvent.change(budget, { target: { value: "1500" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.editBoxOffice).toHaveBeenCalledWith(
        "film",
        1500,
        2000,
        3000,
      ),
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
    expect(screen.queryByLabelText("Budget ($)")).toBeNull();
  });

  test.each([
    ["Edit actors", "Actor Name", "actors"],
    ["Edit directors", "Director Name", "directors"],
  ] as const)(
    "opens and saves %s with current selections",
    async (item, name, kind) => {
      renderButtons();
      openMenu();
      fireEvent.click(await screen.findByRole("menuitem", { name: item }));
      expect(await screen.findByDisplayValue(name)).toBeDefined();
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      if (kind === "actors") {
        await waitFor(() =>
          expect(mocks.editActors).toHaveBeenCalledWith("film", [
            { key: "actor", character_key: "character" },
          ]),
        );
      } else {
        await waitFor(() =>
          expect(mocks.editDirectors).toHaveBeenCalledWith("film", [
            "director",
          ]),
        );
      }
      await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
      expect(screen.queryByDisplayValue(name)).toBeNull();
    },
  );

  test.each([
    ["Edit actors", "actors"],
    ["Edit directors", "directors"],
  ] as const)(
    "does not open %s when choices cannot be loaded",
    async (item, kind) => {
      mocks[kind].mockResolvedValue({ status: 403, message: "Forbidden" });
      renderButtons();
      openMenu();
      fireEvent.click(await screen.findByRole("menuitem", { name: item }));
      await waitFor(() =>
        expect(mocks.error).toHaveBeenCalledWith("Forbidden"),
      );
      expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
    },
  );

  test("opens related movie editing for a standalone movie", async () => {
    renderButtons();
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit related movies" }),
    );
    expect(await screen.findByText("1. Film")).toBeDefined();
    expect(mocks.standaloneMovies).toHaveBeenCalledOnce();
  });

  test("opens and saves the existing collection for its base movie", async () => {
    renderButtons(true, [
      {
        key: "film",
        title: "Film",
        poster: "",
        relation_type: RelatedMovie.base,
      },
      {
        key: "sequel",
        title: "Sequel",
        poster: "",
        relation_type: RelatedMovie.sequel,
      },
    ]);
    openMenu();
    fireEvent.click(
      await screen.findByRole("menuitem", { name: "Edit related movies" }),
    );
    expect(await screen.findByText("2. Sequel")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(mocks.editCollection).toHaveBeenCalledWith({
        base_movie_key: "film",
        movies: [
          { movie_key: "sequel", relation_type: "sequel", collection_order: 2 },
        ],
      }),
    );
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
    expect(screen.queryByText("2. Sequel")).toBeNull();
  });

  test("does not allow a non-base movie to edit related movies", async () => {
    renderButtons(true, [
      {
        key: "base",
        title: "Base",
        poster: "",
        relation_type: RelatedMovie.base,
      },
      {
        key: "film",
        title: "Film",
        poster: "",
        relation_type: RelatedMovie.sequel,
      },
    ]);
    openMenu();
    expect(
      await screen.findByRole("menuitem", { name: "Edit title" }),
    ).toBeDefined();
    expect(
      screen.queryByRole("menuitem", { name: "Edit related movies" }),
    ).toBeNull();
    expect(mocks.standaloneMovies).not.toHaveBeenCalled();
  });
});
