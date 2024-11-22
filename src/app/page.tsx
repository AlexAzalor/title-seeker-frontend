// import Image from "next/image";

import { ButtonSwitchServer } from "@/components/button-server";
import { ButtonSwitch } from "@/components/button-switch";
import { GoogleLogin } from "@/components/google-login";
import { Slider } from "@/components/slider/slider";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-5 p-12">
        <h1 className="text-4xl">{t("title")}</h1>
        <ButtonSwitchServer />
        <Slider />
        <GoogleLogin />
        {/* <UserInfo />

        <ApiFetch />

        <p dangerouslySetInnerHTML={{ __html: t("description") }}></p>
        <CustomButton title="Click me" /> */}
      </main>
    </>
  );
}
