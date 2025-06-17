import { useTranslations } from "next-intl";

export default function AnimePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen text-center">
      <h1 className="p-5 text-3xl">{t("HomePage.navigation.anime")}</h1>
      <p className="text-danger font-bold">{t("notImplemented")}</p>
    </div>
  );
}
