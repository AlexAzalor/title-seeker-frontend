import { useTranslations } from "next-intl";
import { QuicklyAddNewMovie } from "@/components/movie/quick-add-new-movie";

export default function QuickAddMoviePage() {
  const t = useTranslations("Form.quickMovie");

  return (
    <div className="mt-5 h-screen">
      <h1 className="mb-6 text-center text-2xl">{t("title")}</h1>

      <QuicklyAddNewMovie />
    </div>
  );
}
