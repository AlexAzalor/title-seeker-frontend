import { useTranslations } from "next-intl";
import { CustomTabs } from "@/components/my-custom-ui/custom-tabs";

export default function AboutRatingSystemPage() {
  const t = useTranslations("Rating");

  return (
    <div className="container flex min-h-screen max-w-[1280px] flex-col items-center gap-5 p-4 text-lg lg:p-10">
      <CustomTabs
        tabs={[
          {
            key: "visual-profile",
            component: (
              <>
                <h1 className="mb-2 text-center">{t("visualProfile.name")}</h1>
                <p className="mb-1 font-semibold">
                  {t("visualProfile.mainInfo")}
                </p>
                <p className="p-2 text-center font-semibold underline">
                  {t("visualProfile.important")}
                </p>
                <p className="my-2 rounded-md bg-[#E6F2FF] text-center font-bold dark:bg-[#1E1C3D]">
                  {t("visualProfile.criteria")}
                </p>

                <h2 className="mb-2 text-center">
                  {t("visualProfile.syndrome.name")}
                </h2>
                <p className="mb-1">{t("visualProfile.syndrome.info")}</p>
                <p className="mb-1">
                  {t("visualProfile.syndrome.movieSeries")}
                </p>
                <p className="mb-1">{t("visualProfile.syndrome.problem")}</p>
                <p className="mb-1">{t("visualProfile.syndrome.example")}</p>
              </>
            ),
          },
          {
            key: "movie-rate-box",
            component: (
              <>
                <h1 className="mb-2 text-center">{t("name")}</h1>
                <p className="mb-1 font-semibold">{t("mainInfo")}</p>

                <p className="my-2 rounded-md bg-[#E6F2FF] text-center font-bold dark:bg-[#1E1C3D]">
                  {t("description")}
                </p>

                <h2 className="mb-2 text-center">{t("advice.name")}</h2>
                <p className="mb-1">{t("advice.description")}</p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
