import { useTranslations } from "next-intl";

export default function TVSeriesPage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">{t("navigation.tvseries")}</h1>
    </div>
  );
}
