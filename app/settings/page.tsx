import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>This is the settings page</p>
    </div>
  );
}
