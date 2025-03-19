import { cookies } from "next/headers";
import { ButtonSwitch } from "./button-switch";

export const ButtonSwitchServer = async () => {
  const cookieStore = await cookies();
  // console.log('cookieStore', cookieStore);

  // cookieStore.set('locale', 'en');

  return (
    <>
      <ButtonSwitch locale={cookieStore.get("locale")?.value || "uk"} />
    </>
  );
};
