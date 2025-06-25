import { Suspense } from "react";
import { POSTER_URL } from "@/lib/constants";
import { FetchWrapper } from "@/components/my-custom-ui/fetch-wrapper";
import { Spinner } from "@/components/my-custom-ui/spinner";
import { RelatedSimilarMovieList } from "@/components/movie/movie-page/related-similar-list";
import { getMovies } from "@/orval_api/movies/movies";
import type {
  SimilarMovieOutList,
  APIGetSimilarMoviesParams,
} from "@/orval_api/model";

type Props = {
  movieKey: string;
  bottom?: boolean;
};

function SimilarMoviesFetcher({ movieKey, bottom }: Props) {
  const { aPIGetSimilarMovies } = getMovies();

  return (
    <Suspense
      fallback={
        <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border min-w-76 rounded-[34px] border p-5">
          <Spinner className="mx-auto w-fit" />
        </div>
      }
    >
      <FetchWrapper<
        SimilarMovieOutList,
        APIGetSimilarMoviesParams,
        typeof aPIGetSimilarMovies
      >
        apiFetch={aPIGetSimilarMovies}
        params={{ movie_key: movieKey }}
      >
        {({ result }) => (
          <RelatedSimilarMovieList
            type="similar"
            movies={result.data.similar_movies}
            posterUrl={POSTER_URL || "NO URL!!!"}
            currentMovieKey={movieKey}
            bottom={bottom}
          />
        )}
      </FetchWrapper>
    </Suspense>
  );
}

export default SimilarMoviesFetcher;
