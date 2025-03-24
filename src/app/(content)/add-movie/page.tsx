import { getLocale } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { MovieFormWizard } from "@/components/movie/add-movie/movie-form-wizard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function AddMoviePage(props: {
  searchParams: SearchParams;
}) {
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
    },
  } = await aPIGetPreCreateData(
    { lang, temp_movie_key: tempMovieKey },
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
      />
    </div>
  );
}
