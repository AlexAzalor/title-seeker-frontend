import { GoogleLogin } from "@/components/google-login";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const keyFeatures = Object.keys(t.raw("keyFeatures.keys"));

  return (
    <>
      <main className="container flex min-h-screen flex-col items-center gap-5 p-12">
        <h1 className="text-4xl">{t("title")}</h1>
        <h2>{t("subTitle")}</h2>
        <p>{t("description")}</p>
        <h3>{t("solution")}</h3>

        <p>{t("keyFeatures.title")}</p>
        <ul className="flex items-center space-x-5">
          {keyFeatures.map((key) => (
            <li key={key}>
              <p>{t(`keyFeatures.keys.${key}`)}</p>
            </li>
          ))}
        </ul>
        {/* <Slider /> */}
        <GoogleLogin />
      </main>
    </>
  );
}
