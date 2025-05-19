import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  return (
    <div>
      <h1 className="text-2xl">{t("title")}</h1>
      <p>{t("subTitle")}</p>
    </div>
  );
}
