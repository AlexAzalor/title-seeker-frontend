import { auth } from "@/auth";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";

import { GenreRadarChart } from "@/components/profile/charts/genre-radar-chart";
import { TimeRateChart } from "@/components/profile/charts/time-rate-chart";
import { UserInfo } from "@/components/profile/user-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { backendURL, POSTER_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPITimeRateMovie, aPIGenreRadarChart } = getUsers();
  const { data } = await aPITimeRateMovie(
    { user_uuid: user.uuid, lang },
    backendURL,
  );
  const { data: radarData } = await aPIGenreRadarChart(
    { user_uuid: user.uuid, lang },
    backendURL,
  );

  return (
    <div className="flex h-full flex-col-reverse justify-between gap-10 2xl:flex-row">
      <div className="w-full">
        <div className="flex flex-col gap-4 2xl:flex-row">
          <GenreRadarChart radarData={radarData.genre_data} />

          <Card className="mb-4 w-fit">
            <CardHeader className="items-center pb-0">
              <CardTitle>My Top 3 Movies</CardTitle>
              <CardDescription>Shows your most rated movies.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pb-3 2xl:pb-0">
              {radarData.top_rated_movies.map((movie) => (
                <Link
                  href={`/movies/${movie.key}`}
                  key={movie.key}
                  className={cn(
                    "flex items-center gap-4 rounded-xl transition-all duration-200 select-none hover:bg-neutral-100 dark:hover:bg-[#1A183D]",
                  )}
                >
                  <Image
                    src={`${POSTER_URL}/posters/${movie.poster}`}
                    alt="Actor Avatar"
                    height={60}
                    width={40}
                    className="rounded-lg"
                  />
                  <div>
                    <div className="text-[16px]">{movie.title}</div>
                  </div>

                  <div className="mr-1 ml-auto text-xl font-bold">
                    {movie.rating}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="mx-auto hidden self-center 2xl:block">
            Not yet implemented Charts
          </div>
        </div>
        <TimeRateChart moviesTimeRateData={data.movie_chart_data} />
      </div>

      <UserInfo
        lang={lang}
        joinedDate={radarData.joined_date}
        lastMovieRateDate={radarData.last_movie_rate_date}
        moviesRated={radarData.movies_rated}
        totalActorsCount={radarData.total_actors_count}
      />
    </div>
  );
}
