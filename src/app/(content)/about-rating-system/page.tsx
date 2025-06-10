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

                <div className="flex flex-col items-center gap-4">
                  <p className="font-semibold">{t("visualProfile.mainInfo")}</p>
                  <p className="text-center font-semibold underline">
                    {t("visualProfile.important")}
                  </p>
                  <p className="dark:bg-main-dark-hover bg-baby-blue rounded-md p-1 text-center font-bold">
                    {t("visualProfile.criteria")}
                  </p>
                </div>

                <h2 className="my-4 text-center">
                  {t("visualProfile.syndrome.name")}
                </h2>

                <div className="flex flex-col items-center gap-4">
                  <p>{t("visualProfile.syndrome.info")}</p>
                  <p>{t("visualProfile.syndrome.movieSeries")}</p>
                  <p>{t("visualProfile.syndrome.problem")}</p>
                  <p>{t("visualProfile.syndrome.example")}</p>
                </div>
              </>
            ),
          },
          {
            key: "movie-rate-box",
            component: (
              <>
                <h1 className="mb-2 text-center">{t("name")}</h1>
                <p className="mb-1 font-semibold">{t("mainInfo")}</p>

                <p className="bg-baby-blue dark:bg-main-dark-hover my-2 rounded-md text-center font-bold">
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
