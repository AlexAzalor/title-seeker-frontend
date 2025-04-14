import { UserSettings } from "@/components/profile/settings/user-settings";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl">Settings</h1>
      <p>Manage your account settings here.</p>
      <UserSettings />
    </div>
  );
}
