import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
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
      <div className="border-b p-3">
        <h1>Overview</h1>
      </div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <p>This is the overview page</p>
    </div>
  );
}
