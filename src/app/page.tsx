// import Image from "next/image";

import { Slider } from "@/components/slider/slider";

export default function Home() {
  // const t = useTranslations("Home");

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-5 p-12">
        <h1 className="text-4xl">Hello World</h1>
        <Slider />
        {/* <UserInfo />
        <GoogleLogin />

        <ApiFetch />

        <p dangerouslySetInnerHTML={{ __html: t("description") }}></p>
        <CustomButton title="Click me" /> */}
      </main>
    </>
  );
}
