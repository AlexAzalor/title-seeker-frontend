import { auth } from "@/auth";
import { GenreRadarChart } from "@/components/profile/genre-radar-chart";
import { TimeRateChart } from "@/components/profile/time-rate-chart";
import { UserInfo } from "@/components/profile/user-info";
import { backendURL } from "@/lib/constants";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";
import { getLocale } from "next-intl/server";

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
    <div className="flex justify-between gap-10">
      <div className="h-100 w-full">
        <GenreRadarChart radarData={radarData.genre_data} />
        <TimeRateChart moviesTimeRateData={data.movie_chart_data} />
      </div>

      <div className="shadow-form-layout dark:shadow-dark-form-layout max-h-120 w-60 rounded-[34px] border border-[#EFF0F7] text-center dark:border-[#211979]">
        <UserInfo />
      </div>
    </div>
  );
}
