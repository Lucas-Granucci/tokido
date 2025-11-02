import { getCurrentUser } from "@/lib/user-server";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <p>This is the overview page</p>
    </div>
  );
}
