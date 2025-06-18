import { auth } from "@/auth";
import { getLocale, getTranslations } from "next-intl/server";
import { GenreRadarChart } from "@/components/profile/charts/genre-radar-chart";
import { TimeRateChart } from "@/components/profile/charts/time-rate-chart";
import { UserInfo } from "@/components/profile/user-info";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";
import { TopRatedMovies } from "@/components/profile/charts/top-rated-movies";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return null;
  }

  const t = await getTranslations();
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPITimeRateMovie, aPIGetInfoReport } = getUsers();
  const { data } = await aPITimeRateMovie(
    { user_uuid: user.uuid, lang },
    backendURL,
  );
  const { data: radarData } = await aPIGetInfoReport(
    { user_uuid: user.uuid, lang },
    backendURL,
  );

  return (
    <div className="flex h-full flex-col-reverse justify-between gap-10 2xl:flex-row">
      <div className="w-full">
        <div className="flex flex-col gap-4 2xl:flex-row">
          <GenreRadarChart radarData={radarData.genre_data} />

          <TopRatedMovies radarData={radarData} />

          <p className="mx-auto hidden self-center font-bold 2xl:block">
            {t("notImplemented")}
          </p>
        </div>
        <TimeRateChart moviesTimeRateData={data.movie_chart_data} />
      </div>

      <UserInfo
        lang={lang}
        user={user}
        joinedDate={radarData.joined_date}
        lastMovieRateDate={radarData.last_movie_rate_date}
        moviesRated={radarData.movies_rated}
        totalActorsCount={radarData.total_actors_count}
      />
    </div>
  );
}
