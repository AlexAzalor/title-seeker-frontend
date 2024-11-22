import { useTranslations } from "next-intl";

export default function AnimePage() {
  const t = useTranslations("HomePage");

  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">{t("navigation.anime")}</h1>
    </div>
  );
}
