import { viewConfigs } from "../types/view-config";
import { Task } from "@/lib/tasks/types";

export function getPriorityColor(priority: string): string {
  return viewConfigs.priority[priority as keyof typeof viewConfigs.priority]
    ?.color;
}

export function getCategoryColor(category: string): string {
  const config = Object.values(viewConfigs.category).find(
    (item) => item.label === category
  );
  return config?.color || "#6B7280";
}

export function getDurationColor(duration: number): string {
  if (duration <= 5) return viewConfigs.duration.short.color;
  if (duration <= 15) return viewConfigs.duration.medium.color;
  if (duration <= 30) return viewConfigs.duration.long.color;
  if (duration <= 60) return viewConfigs.duration.extended.color;
  if (duration <= 120) return viewConfigs.duration.lengthy.color;
  return viewConfigs.duration.marathon.color;
}
