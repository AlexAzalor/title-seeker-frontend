"use client";

import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";

import { PersonLink } from "@/components/movie/movie-page/people-link";
import { CustomPeopleCarousel } from "@/components/my-custom-ui/custom-people-carousel";
import { FilterEnum, type MoviePersonOut } from "@/orval_api/model";

type Props = {
  movieKey: string;
  directors: MoviePersonOut[];
  avatarURL: string;
};

export const DirectorsList = ({ avatarURL, directors = [] }: Props) => {
  const t = useTranslations("Filters");
  const mq = useMediaQuery("(max-width: 1024px)");
  const actorsLength = mq ? 2 : 5;

  return (
    <>
      <p className="text-3xl font-bold">
        {directors.length > 1 ? t("directorPlural") : t("director")}
      </p>
      {directors.length > actorsLength ? (
        <CustomPeopleCarousel
          people={directors}
          avatarURL={avatarURL}
          linkType={FilterEnum.director}
          type="directors"
        />
      ) : (
        <div className="flex gap-3">
          {directors.map((director) => (
            <PersonLink
              avatarURL={avatarURL}
              key={director.key}
              person={director}
              linkQueryParam={FilterEnum.director}
              type="directors"
            />
          ))}
        </div>
      )}
    </>
  );
};
