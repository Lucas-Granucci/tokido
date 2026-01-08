import {
  GraduationCap,
  Microscope,
  Code2,
  User,
  Briefcase,
  MoreHorizontal,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type CategoryIconName =
  | "GraduationCap"
  | "Microscope"
  | "Code2"
  | "User"
  | "Briefcase"
  | "MoreHorizontal"
  | "Palette"
  | "Sparkles";

export const categoryIcons: Record<CategoryIconName, LucideIcon> = {
  GraduationCap,
  Microscope,
  Code2,
  User,
  Briefcase,
  MoreHorizontal,
  Palette,
  Sparkles,
};

export function getCategoryIcon(name?: string | null): LucideIcon {
  if (name && name in categoryIcons) {
    return categoryIcons[name as CategoryIconName];
  }
  return MoreHorizontal;
}
