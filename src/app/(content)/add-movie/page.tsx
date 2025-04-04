import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLocale } from "next-intl/server";

import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { MovieFormWizard } from "@/components/movie/add-movie/movie-form-wizard";
// import { getServerSession } from "next-auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function AddMoviePage(props: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return redirect("/");
  }

  const searchParams = await props.searchParams;
  const tempMovieKey =
    typeof searchParams.temp_movie_key === "string"
      ? searchParams.temp_movie_key
      : null;

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetPreCreateData } = getMovies();

  const {
    data: {
      actors,
      directors,
      specifications,
      genres,
      keywords,
      action_times,
      temporary_movie,
      shared_universes,
      base_movies,
      characters,
    },
  } = await aPIGetPreCreateData(
    {
      lang,
      temp_movie_key: tempMovieKey,
      user_uuid: session?.user.uuid,
    },
    backendURL,
  );

  return (
    <div className="min-h-screen">
      <MovieFormWizard
        actors={actors}
        directors={directors}
        genres={genres}
        specifications={specifications}
        keywords={keywords}
        actionTimes={action_times}
        temporaryMovie={temporary_movie}
        shared_universes={shared_universes}
        base_movies={base_movies}
        characters={characters}
      />
    </div>
  );
}
