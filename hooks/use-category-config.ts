import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

import { useSettings } from "@/contexts/settings-context";

export type CategoryOption = {
  id: string;
  label: string;
  color: string;
  icon: string;
  Icon: LucideIcon;
};

const FALLBACK_COLOR = "#6B7280";
const FALLBACK_BADGE_CLASSES =
  "border-[#4B5563]/20 bg-[#4B5563]/10 text-[#4B5563]/90 dark:border-[#4B5563]/30 dark:bg-[#4B5563]/20 dark:text-[#4B5563]/80 [&_.event-dot]:fill-[#4B5563]";

const normalizeCategoryKey = (value?: string | null): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
};

export function useCategoryConfig() {
  const { categories, loading } = useSettings();

  const categoryLookup = useMemo(() => {
    const map = new Map<string, CategoryOption>();

    categories.forEach((category) => {
      const option = category as CategoryOption;
      const keys = new Set<string>();
      if (option.id) keys.add(option.id);
      if (option.label) keys.add(option.label);
      const normalizedLabel = normalizeCategoryKey(option.label);
      if (normalizedLabel) keys.add(normalizedLabel);
      const normalizedId = normalizeCategoryKey(option.id);
      if (normalizedId) keys.add(normalizedId);
      keys.forEach((key) => map.set(key, option));
    });
    return map;
  }, [categories]);

  const options = useMemo(() => categories as CategoryOption[], [categories]);

  const getCategory = (key?: string | null): CategoryOption | undefined => {
    if (!key) return undefined;

    const direct = categoryLookup.get(key);
    if (direct) return direct;
    const normalized = normalizeCategoryKey(key);
    if (!normalized) return undefined;
    return categoryLookup.get(normalized);
  };

  const getCategoryColor = (label?: string | null): string => {
    const found = getCategory(label);
    return found?.color || FALLBACK_COLOR;
  };

  const getCategoryIcon = (label?: string | null): LucideIcon => {
    const found = getCategory(label);
    return (
      found?.Icon ??
      categories[0]?.Icon ??
      ((() => null) as unknown as LucideIcon)
    );
  };

  /**
   * Use this when you need inline styles for event/task badges.
   * The background uses a translucent overlay of the category color.
   */
  const getEventBadgeStyle = (label?: string | null): CSSProperties => {
    const color = getCategoryColor(label);
    // Expose the color as a CSS variable so class-based consumers can read it.
    const style: CSSProperties & { [key: string]: string } = {
      "--badge-color": color,
      borderColor: color,
      color,
    };

    const isHex = /^#([0-9a-fA-F]{6})$/.test(color);
    if (isHex) {
      style.backgroundColor = `${color}1A`; // ~10% alpha
    }
    return style;
  };

  /**
   * Legacy helper: some components consume a class string. For custom colors,
   * prefer getEventBadgeStyle + inline style instead of this.
   */
  const getEventBadgeClasses = (label?: string | null): string => {
    const found = getCategory(label);
    if (!found) return FALLBACK_BADGE_CLASSES;
    // Leverage the CSS variable set in getEventBadgeStyle for the dot fill + text/border color.
    return "text-[var(--badge-color)] border-[var(--badge-color)] [&_.event-dot]:fill-[var(--badge-color)]";
  };

  return {
    loading,
    categories: options,
    getCategory,
    getCategoryColor,
    getCategoryIcon,
    getEventBadgeStyle,
    getEventBadgeClasses,
  };
}
