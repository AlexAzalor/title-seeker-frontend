import { MovieFormWizard } from "@/components/movies/add-movie/movie-form-wizard";
import { AddNewMovie } from "@/components/movies/add-new-movie";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getLocale } from "next-intl/server";

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
      next_movie_id,
      actors,
      directors,
      specifications,
      genres,
      keywords,
      action_times,
      temporary_movie,
    },
  } = await aPIGetPreCreateData(
    { lang, temp_movie_key: tempMovieKey },
    backendURL,
  );

  return (
    <div className="">
      <h1 className="text-2xl">Add new Movie</h1>

      <MovieFormWizard
        actors={actors}
        directors={directors}
        genres={genres}
        specifications={specifications}
        keywords={keywords}
        actionTimes={action_times}
      />

      {/* <AddNewMovie
        newMovieId={next_movie_id}
        actors={actors}
        directors={directors}
        specifications={specifications}
        genres={genres}
        keywords={keywords}
        actionTimes={action_times}
        temporaryMovie={temporary_movie}
      /> */}
    </div>
  );
}
