import { GoogleLogin } from "@/components/google-login";

import { Slider } from "@/components/slider/slider";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-5 p-12">
        <h1 className="text-4xl">{t("title")}</h1>
        <h1>
          НЕ треба тратити час на дурню типу для зручності і т.д НЕ ТРЕБА!
        </h1>
        <h1>ГОЛОВНЕ ЛОГІКА І ФУНКЦІОНАЛЬНІСТЬ!!!!!!!!!!!!!</h1>
        <h1>1.5 години..... і це одна з...</h1>
        <h1>ПРОСТО ЗАПИШИ ІДЕЮ НА ПОТІМ!</h1>
        <Slider />
        <GoogleLogin />
      </main>
    </>
  );
}
