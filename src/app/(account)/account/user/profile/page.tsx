import { getLocale, getTranslations } from "next-intl/server";
import { backendURL } from "@/lib/constants";

import { GenreRadarChart } from "@/components/profile/charts/genre-radar-chart";
import { TimeRateChart } from "@/components/profile/charts/time-rate-chart";
import { UserInfo } from "@/components/profile/user-info";
import { TopRatedMovies } from "@/components/profile/charts/top-rated-movies";

import { getUsers } from "@/orval_api/users/users";
import { Language } from "@/orval_api/model";
import { getUserOrRedirect } from "@/app/services/user-api";

export default async function ProfilePage() {
  const user = await getUserOrRedirect();

  const t = await getTranslations();
  const locale = await getLocale();
  const lang = Language[locale as keyof typeof Language];

  const { aPIGetTimeRateMovie, aPIGetInfoReport } = getUsers();
  const { data } = await aPIGetTimeRateMovie(
    { user_uuid: user.uuid, lang },
    backendURL,
  );
  const { data: radarData } = await aPIGetInfoReport(
    { user_uuid: user.uuid, lang },
    backendURL,
  );

  return (
    <div className="flex h-full flex-col-reverse items-center justify-between gap-10 2xl:flex-row 2xl:items-stretch">
      <div className="w-full">
        <div className="flex flex-col items-center gap-4 2xl:flex-row 2xl:items-stretch">
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
