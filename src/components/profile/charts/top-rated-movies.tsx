import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { POSTER_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserInfoReport } from "@/orval_api/model";

type Props = {
  radarData: UserInfoReport;
};

export const TopRatedMovies = ({ radarData }: Props) => {
  const t = useTranslations("Charts");

  return (
    <Card className="mb-4 w-fit">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t("topMoviesTitle")}</CardTitle>
        <CardDescription>{t("topMoviesSubtext")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pb-3 2xl:pb-0">
        {radarData.top_rated_movies.map((movie) => (
          <Link
            href={`/movies/${movie.key}`}
            key={movie.key}
            className={cn(
              "dark:hover:bg-main-dark-hover flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100",
            )}
          >
            <Image
              src={`${POSTER_URL}/posters/${movie.poster}`}
              alt="Movie poster"
              height={60}
              width={40}
              className="rounded-lg"
              blurDataURL="/static/blur-image.webp"
              placeholder="blur"
              loading="lazy"
            />
            <div>
              <div className="text-[16px]">{movie.title}</div>
            </div>

            <div className="mr-1 ml-auto text-xl font-bold">{movie.rating}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
