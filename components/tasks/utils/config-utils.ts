import { viewConfigs } from "../types/view-config";

export function getPriorityColor(priority: string): string {
  const config = Object.values(viewConfigs.priority).find(
    (item) => item.label === priority
  );
  return config?.color || "#6B7280";
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
