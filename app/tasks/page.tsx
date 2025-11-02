import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user-server";
import TasksClient from "./TasksClient";

export default async function TasksPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return <TasksClient initialUser={user} />;
}
