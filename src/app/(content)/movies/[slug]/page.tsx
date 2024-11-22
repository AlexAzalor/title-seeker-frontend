import { PageProps } from "@/types/general";
import { getTranslations } from "next-intl/server";


export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const t = await getTranslations('HomePage');
  return (
    <div className="min-h-screen">
      <h1 className="p-5 text-3xl">{t("navigation.movies")}: {slug}</h1>
    </div>
  );
}
