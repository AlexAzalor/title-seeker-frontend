import { useTranslations } from "next-intl";
import { checkIfAdmin } from "@/middleware";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import type {
  UserInfoReportTotalActorsCount,
  Language,
} from "@/orval_api/model";
import type { UserExtended } from "@/auth";
import type { User } from "next-auth";

type Props = {
  lang: Language;
  joinedDate: string;
  moviesRated: number;
  lastMovieRateDate: string | null;
  totalActorsCount?: UserInfoReportTotalActorsCount;
  user: User & UserExtended;
};

export const UserInfo = ({
  lang,
  joinedDate,
  lastMovieRateDate,
  moviesRated,
  totalActorsCount,
  user,
}: Props) => {
  const t = useTranslations("User");

  return (
    <div
      className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border max-h-120 w-full rounded-[34px] border text-center 2xl:w-60"
      aria-label="user-info"
    >
      <div className="grid gap-2 p-4">
        <div className="flex flex-col gap-4">
          <Avatar className="mx-auto h-20 w-20 rounded-full">
            <AvatarImage src={user.image ?? ""} alt="User avatar" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p>{user.email}</p>
            <Separator className="my-2" />
            <div>
              <p>{t("joined")}:</p>
              <span className="font-bold">{formatDate(joinedDate, lang)}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div>
            <p>{t("ratedCount")}:</p>
            <span className="font-bold">{moviesRated}</span>
          </div>

          {!!totalActorsCount && checkIfAdmin(user.role) && (
            <div>
              <p>{t("totalActors")}:</p>
              <span className="font-bold">{totalActorsCount}</span>
            </div>
          )}

          {lastMovieRateDate && (
            <div>
              <p>{t("lastRatingDate")}:</p>
              <span className="font-bold">
                {formatDate(lastMovieRateDate, lang)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
