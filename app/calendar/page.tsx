import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
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
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      <p>This is the calendar page</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>User: {JSON.stringify(user, null, 2)}</pre>
        <pre>Error: {JSON.stringify(error, null, 2)}</pre>
      </div>
    </div>
  );
}
