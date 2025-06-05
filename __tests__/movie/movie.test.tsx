import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Language } from "@/orval_api/model";

import { MovieFormWizard } from "@/components/movie/add-movie/movie-form-wizard";
import { QuicklyAddNewMovie } from "@/components/movie/quick-add-new-movie";
import { GenresList } from "@/components/movie/movie-page/genres-list";
import { MovieCrew } from "@/components/movie/movie-page/movie-crew";
import { MovieFilterList } from "@/components/movie/movie-page/movie-filter-list";
import { RelatedSimilarList } from "@/components/movie/movie-page/related-similar-list";
import { MoviesCarousel } from "@/components/movie/movie-carousel";
import { ProjectProviders } from "../page.test";
import { FilterEditForm } from "@/components/movie/movie-page/filter-edit-form";
import { GenreEditForm } from "@/components/movie/movie-page/genre-edit-form";

test("Should render Movie Form", async () => {
  render(
    <MovieFormWizard
      visualProfileCategories={[]}
      actors={[]}
      directors={[]}
      genres={[]}
      specifications={[]}
      keywords={[]}
      actionTimes={[]}
      shared_universes={[]}
      base_movies={[]}
      characters={[]}
    />,
    { wrapper: ProjectProviders },
  );

  expect(screen.getByLabelText("movie-form-wizard")).toBeDefined();
  expect(screen.getByText("Next step")).toBeDefined();
  expect(screen.getByText("Clear form")).toBeDefined();
});

test("Should render QuicklyAddNewMovie", () => {
  render(<QuicklyAddNewMovie />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("quick-add-new-movie")).toBeDefined();
});

test("Should render GenresList", () => {
  render(<GenresList movieKey="test-key" genres={[]} />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("genres-list")).toBeDefined();
});

test("Should render MovieFilterList", () => {
  render(
    <MovieFilterList
      movieKey="movie-key"
      action_times={[]}
      keywords={[]}
      specifications={[]}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("movie-filter-list")).toBeDefined();
});

test("Should render MovieCrew", () => {
  render(<MovieCrew actors={[]} directors={[]} avatarURL="test" />, {
    wrapper: ProjectProviders,
  });

  expect(screen.getByLabelText("movie-crew")).toBeDefined();
});

test("Should render RelatedSimilarList", () => {
  render(
    <RelatedSimilarList
      currentMovieKey="test"
      movies={[]}
      posterUrl="test"
      type="related"
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("related-similar-list")).toBeDefined();
});

test("Should render MoviesCarousel", () => {
  render(
    <MoviesCarousel
      name="test"
      avatarURL="test"
      movies={[]}
      lang={Language.en}
      posterURL="test"
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByLabelText("movies-carousel")).toBeDefined();
});

test("Should render FilterEditForm", () => {
  render(
    <FilterEditForm
      movieKey="movie-key"
      filterItems={[
        {
          key: "test-key",
          name: "test-name",
          percentage_match: 50,
          description: "test-description",
        },
      ]}
      selectedFilterItems={[]}
      filterType="specifications"
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText("Add new filter")).toBeDefined();
});
test("Should render GenreEditForm", () => {
  render(
    <GenreEditForm
      movieKey="movie-key"
      allGenres={[]}
      selectedGenres={[]}
      selectedSubgenres={[]}
    />,
    {
      wrapper: ProjectProviders,
    },
  );

  expect(screen.getByText("Select Genres")).toBeDefined();
});
