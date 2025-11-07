import { getCurrentUser } from "@/lib/user-server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>This is the settings page</p>
    </div>
  );
}
