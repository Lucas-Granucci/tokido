import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user-server";
import TasksPageClient from "./TasksPageClient";

export default async function TasksPage() {
  return <TasksPageClient />;
}
