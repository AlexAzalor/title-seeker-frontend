import { getTranslations } from "next-intl/server";
import { getUserOrRedirect } from "@/app/(app)/services/user-api";

export default async function DashboardPage() {
  await getUserOrRedirect();

  const t = await getTranslations("");
  return (
    <div>
      <h1 className="text-2xl">{t("Dashboard.title")}</h1>
      <p>{t("Dashboard.subTitle")}</p>
      <p className="text-danger font-bold">{t("notImplemented")}</p>
    </div>
  );
}
