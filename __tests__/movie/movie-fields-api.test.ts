import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getMovie: vi.fn(),
  editTitle: vi.fn(),
  editDetails: vi.fn(),
}));

vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/proxy", () => ({
  checkIfAdmin: (role: string) => role === "admin",
}));
vi.mock("@/app/(app)/services/global-api", () => ({
  fetchSettings: async () => ({
    backendURL: { baseURL: "https://api.example" },
  }),
}));
vi.mock("@/orval_api/movies/movies", () => ({
  getMovies: () => ({
    aPIGetMovie: mocks.getMovie,
    aPIEditTitle: mocks.editTitle,
    aPIEditMovieDetails: mocks.editDetails,
  }),
}));

import {
  editMovieDetails,
  editMovieTitle,
  getMovieEditFields,
} from "@/app/(app)/services/admin-api";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockResolvedValue({ user: { role: "admin", uuid: "admin-id" } });
  mocks.getMovie.mockImplementation(async (_key, { lang }) => ({
    data: {
      title: lang === "en" ? "English" : "Українська",
      location: lang === "en" ? "London" : "Лондон",
      duration: "2h 22m",
      release_date: "2001-12-19T00:00:00Z",
    },
  }));
  mocks.editTitle.mockResolvedValue({});
  mocks.editDetails.mockResolvedValue({});
});

describe("movie edit actions", () => {
  test("loads both language variants using the authenticated API", async () => {
    const result = await getMovieEditFields("film");
    expect(result.data).toEqual({
      title_en: "English",
      title_uk: "Українська",
      location_en: "London",
      location_uk: "Лондон",
      duration: "2h 22m",
      release_date: "2001-12-19T00:00:00Z",
    });
    expect(mocks.getMovie).toHaveBeenCalledWith(
      "film",
      { lang: "en", user_uuid: "admin-id" },
      { baseURL: "https://api.example" },
    );
    expect(mocks.getMovie).toHaveBeenCalledWith(
      "film",
      { lang: "uk", user_uuid: "admin-id" },
      { baseURL: "https://api.example" },
    );
  });

  test("sends the exact title and detail JSON payloads", async () => {
    const title = {
      movie_key: "film",
      title_en: "English",
      title_uk: "Українська",
    };
    const details = {
      movie_key: "film",
      duration: 142,
      release_date: "2001-12-19T00:00:00.000Z",
      location_en: "London",
      location_uk: "Лондон",
    };
    expect((await editMovieTitle(title)).status).toBe(200);
    expect((await editMovieDetails(details)).status).toBe(200);
    expect(mocks.editTitle).toHaveBeenCalledWith(
      title,
      { user_uuid: "admin-id" },
      { baseURL: "https://api.example" },
    );
    expect(mocks.editDetails).toHaveBeenCalledWith(
      details,
      { user_uuid: "admin-id" },
      { baseURL: "https://api.example" },
    );
  });

  test("denies non-admin requests without contacting the API", async () => {
    mocks.auth.mockResolvedValue({ user: { role: "user", uuid: "user-id" } });
    expect((await getMovieEditFields("film")).status).toBe(403);
    expect(
      (
        await editMovieTitle({
          movie_key: "film",
          title_en: "a",
          title_uk: "b",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await editMovieDetails({
          movie_key: "film",
          duration: 1,
          release_date: "2001-12-19T00:00:00Z",
          location_en: "a",
          location_uk: "b",
        })
      ).status,
    ).toBe(403);
    expect(mocks.getMovie).not.toHaveBeenCalled();
    expect(mocks.editTitle).not.toHaveBeenCalled();
    expect(mocks.editDetails).not.toHaveBeenCalled();
  });

  test("reports backend failures rather than treating them as successful updates", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      mocks.editTitle.mockRejectedValue(new Error("network error"));
      expect(
        await editMovieTitle({
          movie_key: "film",
          title_en: "a",
          title_uk: "b",
        }),
      ).toEqual({ status: 500, message: "Failed to update movie title" });
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
