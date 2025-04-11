"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/lib/utils";
import { Language } from "@/orval_api/model";

type Props = {
  lang: Language;
  joinedDate: string;
  moviesRated: number;
  lastMovieRateDate: string;
};

export const UserInfo = ({
  lang,
  joinedDate,
  lastMovieRateDate,
  moviesRated,
}: Props) => {
  const session = useSession();
  const user = session?.data?.user;
  if (!user) {
    return null;
  }

  return (
    <div className="shadow-form-layout dark:shadow-dark-form-layout max-h-120 w-full rounded-[34px] border border-[#EFF0F7] text-center 2xl:w-60 dark:border-[#211979]">
      <div className="grid gap-2 p-4">
        <div className="flex flex-col gap-4">
          <Avatar className="mx-auto h-20 w-20 rounded-full">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p>{user.email}</p>
            <p>Joined {formatDate(joinedDate, lang)}</p>
          </div>
        </div>

        <div>
          <p>
            Movies rated: <span className="font-bold">{moviesRated}</span>
          </p>
          <p>
            Date of last movie rating:{" "}
            <span className="font-bold">
              {formatDate(lastMovieRateDate, lang)}
            </span>
          </p>
        </div>

        <div>
          <p>Some other info</p>
        </div>
      </div>
    </div>
  );
};
