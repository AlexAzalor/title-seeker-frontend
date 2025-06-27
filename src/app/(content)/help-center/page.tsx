import { useTranslations } from "next-intl";
import { CustomTabs } from "@/components/my-custom-ui/custom-tabs";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutRatingSystemPage() {
  const t = useTranslations("Rating");
  const filters = useTranslations("Filters.about");

  const navigationKeys = Object.keys(filters.raw("cheatSheet.list"));

  return (
    <div className="container flex min-h-screen max-w-320 flex-col items-center gap-5 p-4 text-lg lg:p-10">
      <CustomTabs
        tabs={[
          {
            key: "visual-profile",
            name: t("visualProfile.name"),
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
            name: t("name"),
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
          {
            key: "title-filters",
            name: "Фільтри тайтлів",
            component: (
              <>
                <h1 className="mb-2 text-center">{filters("title")}</h1>
                <p className="mb-2">{filters("filters")}</p>
                <p className="bg-baby-blue dark:bg-main-dark-hover mb-3 rounded-md text-center font-bold">
                  {filters("percentageMatch")}
                </p>
                <p className="mb-1 font-semibold">
                  {filters("example.animal")}
                </p>
                <Link
                  target="_blank"
                  href="/super-search?page=1&specification=animals(10,100)"
                >
                  <Button className="text-gray-purple p-0" variant="link">
                    {filters("example.link")}
                  </Button>
                </Link>
                <p className="mb-1">{filters("example.half")}</p>
                <p className="mb-1">{filters("example.max")}</p>
                <p className="mb-4">{filters("example.min")}</p>

                <p className="bg-baby-blue dark:bg-main-dark-hover mb-4 rounded-md text-center font-bold">
                  {filters("feeling")}
                </p>

                <p className="mb-1 font-semibold">
                  {filters("cheatSheet.about")}
                </p>

                <div className="mb-5 w-fit">
                  <div className="grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-1">
                    {navigationKeys.map((key) => (
                      <Fragment key={key}>
                        <p className="font-bold whitespace-nowrap">
                          {filters(`cheatSheet.list.${key}.value`)}
                        </p>
                        <span className="">-</span>
                        <p className="">
                          {filters(`cheatSheet.list.${key}.label`)}
                        </p>
                      </Fragment>
                    ))}
                  </div>
                </div>

                <h2 className="mb-2 text-center">
                  {filters("description.about")}
                </h2>
                <p className="mb-1">{filters("description.note")}</p>

                <p className="bg-baby-blue dark:bg-main-dark-hover my-2 rounded-md text-center font-bold">
                  {filters("description.advice")}
                </p>

                <p className="text-gray-purple mb-1 text-base">
                  {filters("description.updating")}
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
