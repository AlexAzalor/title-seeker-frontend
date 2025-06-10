import {
  UserInfoReport,
  Language,
  MovieOut,
  PageMoviePreviewOut,
  SortBy,
  SortOrder,
  UsersListOut,
} from "@/orval_api/model";
import { test, expect } from "@playwright/test";

const SIZE = 10;
const PAGE = 1;
const SORT_BY = SortBy.id;
const SORT_ORDER = SortOrder.desc;
const LANG = Language.uk;

const API_OPTIONS = { user_uuid: process.env.UUID ?? "", lang: LANG };
const PAGINATION_OPTIONS = {
  page: PAGE,
  size: SIZE,
  sort_by: SORT_BY,
  sort_order: SORT_ORDER,
  lang: LANG,
};

test.describe("API", () => {
  expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();

  test("Test Get movies: /api/movies", async ({ request }) => {
    const response = await request.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movies/`,
      {
        params: {
          ...PAGINATION_OPTIONS,
        },
      },
    );
    expect(response.ok()).toBeTruthy();
    const data: PageMoviePreviewOut = await response.json();
    expect(data).toBeDefined();
    expect(data).toHaveProperty("items");
    expect(data.items.length).toBe(10);
    expect(data.items[0]).toHaveProperty("title");
  });

  test("Test Get movie: /api/movies/movie-key", async ({ request }) => {
    const movieKey = "the-shawshank-redemption";
    const response = await request.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieKey}`,
    );
    expect(response.ok()).toBeTruthy();
    const data: MovieOut = await response.json();
    expect(data).toBeDefined();
    expect(data).toHaveProperty("title");
    expect(data.key).toBe(movieKey);
  });

  test("Test Get Radar chart data: /api/users/genre-radar-chart", async ({
    request,
  }) => {
    const response = await request.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/genre-radar-chart`,
      {
        params: { ...API_OPTIONS },
      },
    );
    expect(response.ok()).toBeTruthy();
    const data: UserInfoReport = await response.json();
    expect(data).toBeDefined();
    expect(data).toHaveProperty("genre_data");
    expect(data.genre_data.length).toBeGreaterThan(0);
  });

  test("Test Get All users: /api/users/all", async ({ request }) => {
    const response = await request.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/all`,
      {
        params: { ...API_OPTIONS },
      },
    );
    expect(response.ok()).toBeTruthy();
    const data: UsersListOut = await response.json();
    expect(data).toBeDefined();
    expect(data).toHaveProperty("users");
    expect(data.users.length).toBeGreaterThan(0);
  });
});
