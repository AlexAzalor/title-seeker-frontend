import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import type { SearchParams } from "@/types/general";

import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { MovieFormWizard } from "@/components/movie/add-movie/movie-form-wizard";

export default async function AddMoviePage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (session?.user.role !== "owner") {
    return redirect("/");
  }

  const searchParams = await props.searchParams;
  const quickMovieKey =
    typeof searchParams.quick_movie_key === "string"
      ? searchParams.quick_movie_key
      : null;

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetPreCreateData } = getMovies();

  const {
    data: {
      visual_profile_categories,
      actors,
      directors,
      specifications,
      genres,
      keywords,
      action_times,
      quick_movie,
      shared_universes,
      base_movies,
      characters,
    },
  } = await aPIGetPreCreateData(
    {
      lang,
      quick_movie_key: quickMovieKey,
      user_uuid: session?.user.uuid,
    },
    backendURL,
  );

  return (
    <div className="min-h-screen">
      <MovieFormWizard
        visualProfileCategories={visual_profile_categories}
        actors={actors}
        directors={directors}
        genres={genres}
        specifications={specifications}
        keywords={keywords}
        actionTimes={action_times}
        quickMovie={quick_movie}
        shared_universes={shared_universes}
        base_movies={base_movies}
        characters={characters}
      />
    </div>
  );
}
