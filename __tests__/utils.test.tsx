import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Language, SortBy, SortOrder } from "@/orval_api/model";
import { getFilterColor, percentageMatchColor } from "@/components/movie/utils";
import { formatURI } from "@/components/my-custom-ui/pagination/pagination-contoller";
import {
  cleanNumberValue,
  extractValues,
  extractWord,
  formatDate,
  formatKey,
  formattedDuration,
  getVisiblePages,
} from "@/lib/utils";

test("Should render color of the match percentage for movie filters", () => {
  const jsxElement = percentageMatchColor(50, "Test description");
  render(jsxElement);
  expect(screen.getByText("Test description")).toBeDefined();
  expect(screen.getByText("50%")).toBeDefined();
});

test("Should get the filter color", () => {
  const filterColor = getFilterColor("genre");
  expect(filterColor).toBe("#4A3AFF");
});

test("Should format query params for list of items with pagination", () => {
  const uriString = formatURI({
    uriKey: "test",
    query: "test",
    page: 1,
    size: 10,
    sortOrder: SortOrder.asc,
    sortBy: SortBy.id,
  });
  expect(uriString).toBe("/test?sort_by=id&sort_order=asc&page=1&size=10");
});

test("Should format key from the movie title", () => {
  const slug = formatKey(["The Shawshank Redemption"]);
  expect(slug).toBe("the-shawshank-redemption");
});

test("Should format iso date to readable form", () => {
  const isoDate = "2025-05-01T13:31:05.046Z";
  const dateEn = formatDate(isoDate, Language.en);
  expect(dateEn).toBe("May 1, 2025");
  const dateUk = formatDate(isoDate, Language.uk);
  expect(dateUk).toBe("1 травня 2025 р.");
});

test("Should format duration (number) to readable string form", () => {
  const durationEn = formattedDuration(142, Language.en);
  expect(durationEn).toBe("2h 22m");
  const durationUk = formattedDuration(142, Language.uk);
  expect(durationUk).toBe("2г 22хв");
});

test("Should clean number with comas (string) to clear number (also string)", () => {
  const cleanNumber = cleanNumberValue("25,000,000");
  expect(cleanNumber).toBe("25000000");
});

test("Shold extract filter name from query param: Drama(10,100) => Drama", () => {
  const cleanNumber = extractWord("Drama(10,100)");
  expect(cleanNumber).toBe("Drama");
});

test("Should extract values from filter query param: Drama(10,100) => [10, 100]", () => {
  const cleanNumber = extractValues("Drama(10,100)");
  expect(cleanNumber).toEqual([10, 100]);
});

test("Should calculate pages view buttons for pagination", () => {
  const cleanNumber = getVisiblePages(1, 10);
  expect(cleanNumber).toEqual([1, 2, 3, 4, "...", 10]);
  const cleanNumber2 = getVisiblePages(5, 10);
  expect(cleanNumber2).toEqual([1, "...", 4, 5, 6, "...", 10]);
});
