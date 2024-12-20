import { AddNewMovie } from "@/components/movies/add-new-movie";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getMovies } from "@/orval_api/movies/movies";
import { getLocale } from "next-intl/server";

export default async function AddMoviePage() {
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
    },
  } = await aPIGetPreCreateData({ lang }, backendURL);

  return (
    <div className="">
      <h1 className="text-2xl">Add new Movie</h1>

      <AddNewMovie
        newMovieId={next_movie_id}
        actors={actors}
        directors={directors}
        specifications={specifications}
        genres={genres}
        keywords={keywords}
        actionTimes={action_times}
      />
    </div>
  );
}
