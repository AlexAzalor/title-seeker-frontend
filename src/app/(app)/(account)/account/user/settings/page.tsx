import { getUserOrRedirect } from "@/app/(app)/services/user-api";
import { UserSettings } from "@/components/profile/settings/user-settings";

export default async function SettingsPage() {
  await getUserOrRedirect();

  return <UserSettings />;
}
