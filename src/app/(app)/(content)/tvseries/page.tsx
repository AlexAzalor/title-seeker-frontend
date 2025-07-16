import { useTranslations } from "next-intl";

export default function TVSeriesPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen text-center">
      <h1 className="p-5 text-3xl">{t("HomePage.navigation.tvseries")}</h1>
      <p className="text-danger font-bold">{t("notImplemented")}</p>
    </div>
  );
}
