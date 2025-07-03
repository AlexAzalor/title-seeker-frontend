import Link from "next/link";
import { FilterEnum, type MovieOut } from "@/orval_api/model";
import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";
import { MoviesCollection } from "@/components/movie/movie-page/movies-collection";

type Props = {
  sharedUniverse?: MovieOut["shared_universe"];
  sharedUniverseOrder?: number | null;
  movieKey: string;
  posterUrl: string;
};

export const SharedUniverseSection = ({
  sharedUniverse,
  sharedUniverseOrder,
  movieKey,
  posterUrl,
}: Props) => {
  if (!sharedUniverse || !sharedUniverseOrder) return null;

  return (
    <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-4 flex w-full flex-col rounded-4xl border p-5">
      <Link
        href={`/super-search/?${FilterEnum.shared_universe}=${movieKey}`}
        scroll={false}
        className="flex items-center gap-4 p-2 text-2xl"
      >
        {sharedUniverse.name}

        <TooltipWrapper
          content={sharedUniverse.description}
          className="text-center"
        />
      </Link>

      <MoviesCollection
        data={sharedUniverse}
        posterUrl={posterUrl}
        currentMovieKey={movieKey}
        index={sharedUniverseOrder - 1}
      />
    </div>
  );
};
