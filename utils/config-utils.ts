import presentationConfigs from "@/utils/presentation-configs";
import { getCachedCategories } from "@/contexts/settings-context";
import { DEFAULT_CATEGORIES } from "@/settings/settingsClient";

export function getPriorityColor(priority: string): string {
  const config = Object.values(presentationConfigs.priority).find(
    (item) => item.label === priority
  );
  return config?.color || "#6B7280";
}

export function getCategoryColor(category: string): string {
  const config = getCachedCategories().find((item) => item.label === category);
  if (config?.color) return config.color;
  const fallback = DEFAULT_CATEGORIES.find((item) => item.label === category);
  return fallback?.color || "#6B7280";
}

export function getEventBadgeClasses(category: string): string {
  const config = getCachedCategories().find((item) => item.label === category);
  if (config?.color) {
    return "";
  }
  const fallback = DEFAULT_CATEGORIES.find((item) => item.label === category);
  if (fallback?.color) return "";
  return "border-[#4B5563]/20 bg-[#4B5563]/10 text-[#4B5563]/90 dark:border-[#4B5563]/30 dark:bg-[#4B5563]/20 dark:text-[#4B5563]/80 [&_.event-dot]:fill-[#4B5563]";
}

export function getDurationColor(duration: number): string {
  if (duration <= 5) return presentationConfigs.duration.short.color;
  if (duration <= 15) return presentationConfigs.duration.medium.color;
  if (duration <= 30) return presentationConfigs.duration.long.color;
  if (duration <= 60) return presentationConfigs.duration.extended.color;
  if (duration <= 120) return presentationConfigs.duration.lengthy.color;
  return presentationConfigs.duration.marathon.color;
}
