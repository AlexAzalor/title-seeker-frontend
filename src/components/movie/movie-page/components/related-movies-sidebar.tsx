import { RelatedSimilarMovieList } from "@/components/movie/movie-page/related-similar-list";
import SimilarMoviesFetcher from "@/components/movie/movie-page/similar-movies-fetcher";
import type { RelatedMovieOut } from "@/orval_api/model";

type Props = {
  relatedMovies?: RelatedMovieOut[] | null;
  posterUrl: string;
  currentMovieKey: string;
  movieKey: string;
};

export const RelatedMoviesSidebar = ({
  relatedMovies,
  posterUrl,
  currentMovieKey,
  movieKey,
}: Props) => (
  <div className="xl:ml-auto">
    <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border max-w-84 rounded-lg border p-2 lg:w-76 lg:rounded-4xl lg:p-5">
      {relatedMovies?.length ? (
        <RelatedSimilarMovieList
          type="related"
          movies={relatedMovies}
          posterUrl={posterUrl}
          currentMovieKey={currentMovieKey}
        />
      ) : (
        <SimilarMoviesFetcher movieKey={movieKey} />
      )}
    </div>
  </div>
);
