import Link from "next/link";
import type { MovieOut } from "@/orval_api/model";
import { ExpandableText } from "@/components/my-custom-ui/expandable-text";
import { Button } from "@/components/ui/button";
import { MovieCrew } from "@/components/movie/movie-page/movie-crew";
import { CustomTabs } from "@/components/my-custom-ui/custom-tabs";
import { VisualProfile } from "@/components/movie/movie-page/visual-profile.tsx/visual-profile";
import { MovieRateBox } from "@/components/movie/movie-page/movie-rate-box";

type Props = {
  data: MovieOut;
  avatarUrl: string;
  t: (key: string) => string;
  isOwner: boolean;
  isAdmin: boolean;
};

export const MovieContent = ({
  data,
  avatarUrl,
  t,
  isOwner,
  isAdmin,
}: Props) => (
  <div className="mb-4 flex flex-col justify-between gap-6 xl:flex-row">
    <div className="pt-6 sm:mx-auto">
      <ExpandableText text={data.description} />

      <MovieCrew
        avatarURL={avatarUrl}
        actors={data.actors}
        directors={data.directors}
      />
    </div>

    <CustomTabs
      className="h-124 max-w-148 sm:mx-auto xl:w-148 xl:max-w-none"
      header={
        <Link href="/help-center" className="mx-auto" target="_blank">
          <Button variant="link" className="text-light-gray h-auto w-auto p-0">
            {t("about")}
          </Button>
        </Link>
      }
      tabs={[
        {
          key: "visual-profile",
          name: t("visualProfile.name"),
          component: (
            <VisualProfile
              key="visual-profile"
              movieKey={data.key}
              radarData={data.visual_profile}
              isOwner={isOwner}
            />
          ),
        },
        {
          key: "movie-rate-box",
          name: t("name"),
          component: (
            <MovieRateBox
              key="movie-rate-box"
              movieKey={data.key}
              ratingType={data.rating_criterion}
              isAdmin={isAdmin}
              isUserRated={!!data.user_rating}
              userRatingData={data.user_rating_criteria}
              overallRatingCriteria={data.overall_average_rating_criteria}
            />
          ),
        },
      ]}
    />
  </div>
);
