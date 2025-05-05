import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import { GenreRadarChart } from "@/components/profile/charts/genre-radar-chart";
import { TimeRateChart } from "@/components/profile/charts/time-rate-chart";
import { ProjectProviders } from "../../page.test";

test("Should render GenreRadarChart", () => {
  render(
    <GenreRadarChart
      radarData={[
        { name: "Action", count: 10 },
        { name: "Drama", count: 20 },
        { name: "Comedy", count: 30 },
        { name: "Horror", count: 40 },
        { name: "Sci-Fi", count: 50 },
        { name: "Fantasy", count: 60 },
        { name: "Romance", count: 70 },
        { name: "Thriller", count: 80 },
      ]}
    />,
    {
      wrapper: ProjectProviders,
    },
  );
  expect(screen.getByLabelText("genre-radar-chart")).toBeDefined();
});

test("Should render TimeRateChart", () => {
  render(
    <TimeRateChart
      moviesTimeRateData={[
        { created_at: "2025-01-01", movie_title: "Movie 1", rating: 5 },
        { created_at: "2025-02-02", movie_title: "Movie 2", rating: 7 },
        { created_at: "2025-03-03", movie_title: "Movie 3", rating: 10 },
      ]}
    />,
    {
      wrapper: ProjectProviders,
    },
  );
  expect(screen.getByLabelText("time-rate-chart")).toBeDefined();
});
