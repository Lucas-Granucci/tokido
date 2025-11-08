import { taskViewConfigs } from "./view-config";

export function getPriorityColor(priority: string): string {
  const config = Object.values(taskViewConfigs.priority).find(
    (item) => item.label === priority
  );
  return config?.color || "#6B7280";
}

export function getCategoryColor(category: string): string {
  const config = Object.values(taskViewConfigs.category).find(
    (item) => item.label === category
  );
  return config?.color || "#6B7280";
}

export function getDurationColor(duration: number): string {
  if (duration <= 5) return taskViewConfigs.duration.short.color;
  if (duration <= 15) return taskViewConfigs.duration.medium.color;
  if (duration <= 30) return taskViewConfigs.duration.long.color;
  if (duration <= 60) return taskViewConfigs.duration.extended.color;
  if (duration <= 120) return taskViewConfigs.duration.lengthy.color;
  return taskViewConfigs.duration.marathon.color;
}
